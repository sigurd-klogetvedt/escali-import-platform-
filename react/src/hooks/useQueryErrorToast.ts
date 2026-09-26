import { useEffect, useRef } from "react";
import { notify } from "@/lib/notify";

type QueryLike = {
    isError: boolean;
};

type UseQueryErrorToastOptions = {
    /**
     * When false, the toast will not fire and the internal
     * "has toasted" ref is reset so it can fire again once
     * the query is re-enabled.
     */
    enabled?: boolean;
    /**
     * Stable Sonner id to dedupe repeated toasts for the same
     * logical resource. Strongly recommended — without an id
     * Sonner will stack toasts on background refetches.
     */
    id?: string | number;
    description?: string;
};

/**
 * Fires a single `notify.error` toast the first time a React Query
 * query enters an error state during its current enabled cycle.
 * Subsequent retries in the same error cycle are suppressed; the
 * ref resets when the query recovers or when `enabled` goes false,
 * so a fresh failure after recovery will toast again.
 *
 * React Query v5 removed `onError` from `useQuery`, so this hook
 * is the recommended replacement for query-level error feedback.
 */
export function useQueryErrorToast(
    query: QueryLike,
    title: string,
    options?: UseQueryErrorToastOptions,
) {
    const hasToastedRef = useRef(false);
    const enabled = options?.enabled ?? true;
    const id = options?.id;
    const description = options?.description;

    useEffect(() => {
        if (!enabled) {
            hasToastedRef.current = false;
            return;
        }
        if (!query.isError) {
            hasToastedRef.current = false;
            return;
        }
        if (hasToastedRef.current) {
            return;
        }
        hasToastedRef.current = true;
        notify.error(title, { id, description });
    }, [enabled, query.isError, title, id, description]);
}
