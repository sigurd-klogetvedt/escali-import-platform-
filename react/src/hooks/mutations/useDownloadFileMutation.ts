import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type DownloadFileVariables = {
    fileSeq: number;
    fileName: string;
};

/**
 * Parses a `Content-Disposition` header and extracts the filename.
 * Prefers RFC 5987's `filename*=UTF-8''…` form (which the API emits for
 * non-ASCII names) and falls back to the legacy `filename="…"` form.
 * Returns `null` when no filename can be derived so the caller can fall
 * back to the row's `OriginalFileName`.
 */
function parseContentDispositionFilename(header: string | null): string | null {
    if (!header) return null;

    const utf8Match = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (utf8Match) {
        try {
            return decodeURIComponent(utf8Match[1].trim());
        } catch {
            // Malformed encoding; fall through to the legacy form.
        }
    }

    const quotedMatch = header.match(/filename\s*=\s*"([^"]+)"/i);
    if (quotedMatch) return quotedMatch[1];

    const bareMatch = header.match(/filename\s*=\s*([^;]+)/i);
    if (bareMatch) return bareMatch[1].trim();

    return null;
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Defer revoke so Safari/Firefox finish kicking off the download first.
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Downloads an uploaded file via the authenticated API client and
 * triggers a browser save dialog. `useMutation`'s `mutationFn` does not
 * receive an `AbortSignal` from TanStack Query (unlike `useQuery`), so
 * we manage one manually via `useRef` and abort it on unmount.
 */
export function useDownloadFileMutation() {
    const { t } = useTranslation();
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
        };
    }, []);

    return useMutation({
        mutationKey: ["download-file"],
        mutationFn: async ({ fileSeq, fileName }: DownloadFileVariables) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const response = await api.get(`api/UploadFiles/${fileSeq}/download`, {
                signal: controller.signal,
            });

            const blob = await response.blob();
            const headerName = parseContentDispositionFilename(
                response.headers.get("Content-Disposition"),
            );
            triggerBrowserDownload(blob, headerName ?? fileName);

            return { fileName: headerName ?? fileName };
        },
        onSuccess: (data) => {
            notify.success(t("toast.download.successTitle"), {
                description: data.fileName,
            });
        },
        onError: (error) => {
            // Silently ignore aborts (component unmounted or new download started).
            if (error instanceof DOMException && error.name === "AbortError") return;
            if (error instanceof Error && error.name === "AbortError") return;

            const serverMessage = error instanceof Error && error.message.length > 0
                ? error.message
                : null;
            notify.error(t("toast.download.errorTitle"), {
                description: serverMessage ?? t("toast.download.fallbackErrorDescription"),
            });
        },
    });
}
