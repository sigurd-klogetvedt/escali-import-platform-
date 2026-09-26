import type { Column } from "@/components/InterfaceColumnsPills";
import { ColumnSearchBar, DataTable, MappingRow } from "@/components/table";
import { useHighlightedColumnId } from "@/hooks";
import { useMappingStore } from "@/stores/mappingStore";
import {
    type FilePreviewResponse,
    getPreviewColumnMetas,
    type PreviewRowWithId,
} from "@/components/table/tableUtils";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { useMemo } from "react";
import type { InvalidCellLookup } from "./utils/mappedColumnDataUtils";

type MappingPageTableProps = {
    previewLoading: boolean;
    previewError: unknown;
    previewData: FilePreviewResponse | null | undefined;
    tableData: PreviewRowWithId[];
    headers: string[];
    onRemoveMapping: (headerId: string) => void;
    availableOptions: { value: string; label: string; data: Column }[];
    rowSelection: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    invalidCellLookup?: InvalidCellLookup;
    invalidColumnSeqLookup?: Record<string, Record<string, number>>;
    changedCellLookup?: Record<string, Record<string, true>>;
    onSelectApprovedValue?: (rowId: string, columnId: string, value: string) => void;
    onRevertValue?: (rowId: string, columnId: string) => void;
    targetCellId?: string | null;
}

export function MappingPageTable({
    previewLoading,
    previewError,
    previewData,
    tableData,
    headers,
    onRemoveMapping,
    availableOptions,
    rowSelection,
    onRowSelectionChange,
    invalidCellLookup,
    invalidColumnSeqLookup,
    changedCellLookup,
    onSelectApprovedValue,
    onRevertValue,
    targetCellId,
}: MappingPageTableProps) {
    const columnSearchQuery = useMappingStore((s) => s.columnSearchQuery);
    const setColumnSearchQuery = useMappingStore((s) => s.setColumnSearchQuery);
    const selectOpenForHeaderId = useMappingStore((s) => s.selectOpenForHeaderId);
    const setSelectOpenForHeaderId = useMappingStore((s) => s.setSelectOpenForHeaderId);
    const columnMappings = useMappingStore((s) => s.columnMappings);
    const setColumnMappings = useMappingStore((s) => s.setColumnMappings);
    const highlightedColumnId = useHighlightedColumnId(headers, columnSearchQuery);

    const dataTableHighlightedColumnId = useMemo(() => {
        if (highlightedColumnId == null || !previewData?.headers?.length) return null;
        return (
            getPreviewColumnMetas(previewData.headers, columnMappings).find(
                (m) => m.fileHeader === highlightedColumnId,
            )?.columnId ?? null
        );
    }, [previewData, columnMappings, highlightedColumnId]);

    if (previewLoading) {
        return (
            <div className="flex-1 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50/50">
                <p className="text-sm text-black/50">Loading preview...</p>
            </div>
        );
    }
    if (previewError) {
        return (
            <div className="flex-1 flex items-center justify-center rounded-lg border border-red-200 bg-red-50/50">
                <p className="text-sm text-red-700">
                    {previewError instanceof Error
                        ? previewError.message
                        : typeof previewError === "object" && previewError != null && "message" in previewError
                            ? String((previewError as { message: unknown }).message)
                            : "Failed to load preview"}
                </p>
            </div>
        );
    }
    if (!previewData?.headers?.length || tableData.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50/50">
                <p className="text-sm text-black/50">No preview data</p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 flex flex-col">
            <DataTable
                data={tableData}
                headers={previewData.headers}
                columnMappings={columnMappings}
                enableRowSelection
                rowSelection={rowSelection}
                onRowSelectionChange={onRowSelectionChange}
                invalidCellLookup={invalidCellLookup}
                invalidColumnSeqLookup={invalidColumnSeqLookup}
                changedCellLookup={changedCellLookup}
                onSelectApprovedValue={onSelectApprovedValue}
                onRevertValue={onRevertValue}
                targetCellId={targetCellId}
                showColumnHeaders={false}
                columnSearchBar={
                    <ColumnSearchBar
                        value={columnSearchQuery}
                        onChange={setColumnSearchQuery}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && highlightedColumnId != null) {
                                e.preventDefault();
                                setSelectOpenForHeaderId(highlightedColumnId);
                            }
                        }}
                    />
                }
                highlightedColumnId={dataTableHighlightedColumnId}
                mappingRow={
                    <MappingRow<Column>
                        headers={headers}
                        columnMappings={columnMappings}
                        onRemove={onRemoveMapping}
                        renderMappedContent={(col) => (
                            <span className="whitespace-nowrap">{col.columnFieldName}</span>
                        )}
                        highlightedColumnId={highlightedColumnId}
                        availableOptions={availableOptions}
                        selectOpenForHeaderId={selectOpenForHeaderId}
                        onInteractWithCell={setSelectOpenForHeaderId}
                        onCloseSelect={() => setSelectOpenForHeaderId(null)}
                        onSelectColumn={(headerId, col) => {
                            setColumnMappings((prev) => ({ ...prev, [headerId]: col }));
                            setSelectOpenForHeaderId(null);
                        }}
                    />
                }
            />
        </div>
    )
}