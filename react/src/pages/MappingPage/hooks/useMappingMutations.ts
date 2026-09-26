import { useCallback } from "react";
import {
    getPreviewColumnMetas,
    type PreviewRowWithId,
} from "@/components/table/tableUtils";
import { useMappingStore } from "@/stores/mappingStore";

type ManualValueOverrides = Record<string, Record<string, string>>;

export function useMappingMutations(params: {
    headers: string[];
    effectiveTableData: PreviewRowWithId[];
}) {
    const { headers, effectiveTableData } = params;
    const columnMappings = useMappingStore((s) => s.columnMappings);
    const setColumnMappings = useMappingStore((s) => s.setColumnMappings);
    const setManualValueOverrides = useMappingStore((s) => s.setManualValueOverrides);

    const handleSelectApprovedValue = useCallback(
        (rowId: string, columnId: string, value: string) => {
            const fileHeader = getPreviewColumnMetas(headers, columnMappings).find(
                (meta) => meta.columnId === columnId,
            )?.fileHeader;
            if (!fileHeader) return;
            const currentRow = effectiveTableData.find((row) => row._rowId === rowId);
            if (!currentRow) return;
            const sourceValue = currentRow[fileHeader] ?? "";
            setManualValueOverrides((prev) => ({
                ...prev,
                ...Object.fromEntries(
                    effectiveTableData
                        .filter((row) => (row[fileHeader] ?? "") === sourceValue)
                        .map((row) => [
                            row._rowId,
                            { ...(prev[row._rowId] ?? {}), [fileHeader]: value },
                        ]),
                ),
            }));
        },
        [headers, columnMappings, effectiveTableData, setManualValueOverrides],
    );

    const handleRevertValue = useCallback(
        (rowId: string, columnId: string) => {
            const fileHeader = getPreviewColumnMetas(headers, columnMappings).find(
                (meta) => meta.columnId === columnId,
            )?.fileHeader;
            if (!fileHeader) return;
            setManualValueOverrides((prev) => {
                const rowOverrides = prev[rowId];
                if (!rowOverrides || !(fileHeader in rowOverrides)) return prev;
                const nextRow = { ...rowOverrides };
                delete nextRow[fileHeader];
                if (Object.keys(nextRow).length === 0) {
                    const rest = { ...prev };
                    delete rest[rowId];
                    return rest;
                }
                return { ...prev, [rowId]: nextRow };
            });
        },
        [headers, columnMappings, setManualValueOverrides],
    );

    const handleRemoveMapping = useCallback(
        (headerId: string) => {
            setColumnMappings((prev) => {
                const next = { ...prev };
                delete next[headerId];
                return next;
            });
            setManualValueOverrides((prev) => {
                const next: ManualValueOverrides = {};
                for (const [rowId, overrides] of Object.entries(prev)) {
                    if (!(headerId in overrides)) {
                        next[rowId] = overrides;
                        continue;
                    }
                    const rowNext = { ...overrides };
                    delete rowNext[headerId];
                    if (Object.keys(rowNext).length > 0) {
                        next[rowId] = rowNext;
                    }
                }
                return next;
            });
        },
        [setColumnMappings, setManualValueOverrides],
    );

    return { handleSelectApprovedValue, handleRevertValue, handleRemoveMapping };
}
