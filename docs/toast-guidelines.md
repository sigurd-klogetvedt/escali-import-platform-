# Toast guidelines

All user-facing toasts go through `notify` in `react/src/lib/notify.ts`,
which wraps Sonner. Never import `toast` from `sonner` directly; the
helper enforces consistent variants, durations, and a single `<Toaster />`
mount point (in `main.tsx`).

## Toast vs inline error

Rule of thumb:

- **Toast** — transient events tied to a user-initiated action (upload
  finished, user deleted, submit blocked by validation). The user may
  have navigated away by the time the event resolves; a toast surfaces
  it without changing the page.
- **Inline** — persistent state tied to content on the page (empty
  list, "No files found", load failure for the data that fills the
  view). Inline stays until the underlying data changes.

Many screens need both: show the inline message so the view has a
stable state, and fire one toast the first time a background load
fails so the user knows something broke.

## Variants

| Variant    | Use for                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `success`  | A user-initiated action completed (mutation success).                   |
| `error`    | A user-initiated action failed, or a load error blocks the current view. |
| `warning`  | Soft failure the user can fix without a retry (invalid file, blocked submit). |
| `info`     | Neutral status the user explicitly opted into. Rare; prefer inline UI. |

Defaults baked into `notify`:

- `success` / `info` → 4 s
- `warning` → 5 s
- `error` → 6 s (slightly longer so the user has time to read the reason)
- Top-right position, rich colors, close button, ARIA live region on.

## Deduplication rules

1. **No toast on background refetches.** React Query refetches on window
   focus, reconnect, and on `invalidateQueries`. A successful refetch
   is not a user-initiated event — do NOT fire a `success` toast for
   it. Success toasts only belong in `onSuccess` handlers of
   `useMutation`, or at explicit user actions.
2. **One toast per query error, not per retry.** Use
   `useQueryErrorToast` from `@/hooks`; it uses a ref to suppress
   repeats while the query is in an error state and resets when the
   query recovers or is disabled. For ad-hoc cases pass a stable Sonner
   `id` so repeated calls replace rather than stack.
3. **One toast per mutation attempt.** React Query mutations do not
   auto-retry by default, so wiring the toast in `onSuccess` /
   `onError` of the mutation hook is enough. Do not also toast at the
   call site.
4. **Many parallel queries (e.g. `useQueries`) need per-key tracking.**
   Use a `useRef<Set<Key>>()` to track which keys have already toasted
   and prune entries for keys that are no longer active.

## i18n

All messages come from the `toast.*` namespace in
`public/locales/{en,no}/translation.json`. Both languages must have
every key. Pass `t("toast.…")` results into `notify` — the helper
accepts plain strings and `t(...)` output with the same signature.

## Testing components that toast

In component tests, mock the helper so assertions remain deterministic
and do not depend on Sonner's DOM:

```ts
import { vi } from "vitest"; // or jest

vi.mock("@/lib/notify", () => ({
    notify: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
    },
}));
```

Then assert with `expect(notify.error).toHaveBeenCalledWith(...)`.
Avoid querying Sonner's toast DOM from tests; it is an implementation
detail.

## Example

```ts
import { notify } from "@/lib/notify";

useMutation({
    mutationFn: uploadFile,
    onSuccess: (_data, variables) => {
        notify.success(t("toast.upload.successTitle"), {
            description: variables.file.name,
        });
    },
    onError: (error) => {
        notify.error(t("toast.upload.errorTitle"), {
            description: error instanceof Error && error.message.length > 0
                ? error.message
                : t("toast.upload.fallbackErrorDescription"),
        });
    },
});
```
