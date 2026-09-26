import * as React from "react";

export function useHighlightedColumnId(headers: string[], columnSearchQuery: string): string | null {
    return React.useMemo(() => {
        const q = columnSearchQuery.trim();
        if (q === "") return null;
        return headers.find((h) => h.toLowerCase().includes(q.toLowerCase())) ?? null;
    }, [headers, columnSearchQuery]);
}