import { useCallback, useMemo } from "react";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { previewResponseToTableData } from "@/components/table/tableUtils";
import { useFilePreview, useQueryErrorToast } from "@/hooks";
import { useMappingStore } from "@/stores/mappingStore";

export function usePreviewTableState(params: {
    fileSeqNum: number;
    localStorage: boolean;
    t: TFunction;
}) {
    const { fileSeqNum, localStorage, t } = params;

    const manualValueOverrides = useMappingStore((s) => s.manualValueOverrides);
    const rowSelectionOverrides = useMappingStore((s) => s.rowSelectionOverrides);
    const hasCustomRowSelection = useMappingStore((s) => s.hasCustomRowSelection);
    const setRowSelectionOverrides = useMappingStore((s) => s.setRowSelectionOverrides);
    const setHasCustomRowSelection = useMappingStore((s) => s.setHasCustomRowSelection);

    const { data: previewData, loading: previewLoading, error: previewError } = useFilePreview({
        fileSeq: fileSeqNum,
        localStorage,
        enabled: true,
    });
    useQueryErrorToast(
        { isError: previewError != null },
        t("toast.mapping.previewErrorTitle"),
        { id: `file-preview-${fileSeqNum}-${localStorage ? "local" : "blob"}` },
    );

    const tableData = useMemo(
        () => previewResponseToTableData(previewData, { includeHeadersAsFirstRow: true }), [previewData]
    );

    const headers = useMemo(() => previewData?.headers ?? [], [previewData?.headers]);

    const defaultRowSelection = useMemo(
        () => Object.fromEntries(tableData.map((row) => [row._rowId, true])),
        [tableData],
    );
    const rowSelection = hasCustomRowSelection ? rowSelectionOverrides : defaultRowSelection;

    const effectiveTableData = useMemo(
        () =>
            tableData.map((row) => {
                const overrides = manualValueOverrides[row._rowId];
                return overrides ? { ...row, ...overrides } : row;
            }),
        [tableData, manualValueOverrides],
    );

    const selectedTableData = useMemo(
        () => effectiveTableData.filter((row) => rowSelection[row._rowId] ?? false),
        [effectiveTableData, rowSelection],
    );
    const selectedRowIds = useMemo(
        () => new Set(selectedTableData.map((r) => r._rowId)),
        [selectedTableData],
    );

    const handleRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>(
        (updater) => {
            setHasCustomRowSelection(true);
            setRowSelectionOverrides((prev) => {
                const baseSelection = hasCustomRowSelection ? prev : defaultRowSelection;
                return typeof updater === "function" ? updater(baseSelection) : updater;
            });
        },
        [hasCustomRowSelection, defaultRowSelection, setHasCustomRowSelection, setRowSelectionOverrides],
    );

    return {
        previewData,
        previewLoading,
        previewError,
        tableData,
        headers,
        effectiveTableData,
        selectedTableData,
        selectedRowIds,
        rowSelection,
        handleRowSelectionChange,
    };
}
