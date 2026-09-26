import { getCoreRowModel, useReactTable, type ColumnResizeMode, type OnChangeFn, type RowSelectionState } from "@tanstack/react-table";
import Table from "./table";
import {
    buildPreviewColumns,
    getPreviewRowId,
    type PreviewColumnMapping,
    type PreviewRowWithId,
} from "./tableUtils";
import * as React from "react";
import { MappingPreviewTableContext } from "./MappingPreviewTableContext";
import { rowSelectionColumn } from "./RowSelectionColumn";
import type { InvalidCellLookup } from "@/pages/MappingPage/utils/mappedColumnDataUtils";

const DEFAULT_PREVIEW_COLUMN_MIN_WIDTH = 220;

export type DataTableProps = {
    data: PreviewRowWithId[];
    headers: string[];
    /** When a file column is mapped, its table column id becomes {@link PreviewColumnMapping.columnFieldName}. */
    columnMappings?: Record<string, PreviewColumnMapping | null | undefined>;
    mappingRow?: React.ReactNode;
    columnSearchBar?: React.ReactNode;
    highlightedColumnId?: string | null;
    invalidCellLookup?: InvalidCellLookup;
    invalidColumnSeqLookup?: Record<string, Record<string, number>>;
    changedCellLookup?: Record<string, Record<string, true>>;
    onSelectApprovedValue?: (rowId: string, columnId: string, value: string) => void;
    onRevertValue?: (rowId: string, columnId: string) => void;
    targetCellId?: string | null;
    enableRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    showColumnHeaders?: boolean;
};

export default function DataTable({
    data,
    headers,
    columnMappings,
    mappingRow,
    columnSearchBar,
    highlightedColumnId,
    invalidCellLookup,
    invalidColumnSeqLookup,
    changedCellLookup,
    onSelectApprovedValue,
    onRevertValue,
    targetCellId,
    enableRowSelection = false,
    rowSelection,
    onRowSelectionChange: onRowSelectionChangeProp,
    showColumnHeaders = true,
}: DataTableProps) {
    const effectiveRowSelection = React.useMemo(
        () => rowSelection ?? {},
        [rowSelection],
    );

    const columns = React.useMemo(() => {
        const dataColumns = buildPreviewColumns(headers, columnMappings);
        return enableRowSelection ? [rowSelectionColumn, ...dataColumns] : dataColumns;
    }, [headers, columnMappings, enableRowSelection]);

    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoization; safe to skip React Compiler memoization here.
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getPreviewRowId,
        defaultColumn: {
            size: DEFAULT_PREVIEW_COLUMN_MIN_WIDTH,
            minSize: DEFAULT_PREVIEW_COLUMN_MIN_WIDTH,
        },
        enableColumnResizing: true,
        columnResizeMode: "onChange" as ColumnResizeMode,
        enableRowSelection,
        state: { rowSelection: effectiveRowSelection },
        onRowSelectionChange: onRowSelectionChangeProp,
    });

    const mappingPreviewTableContext = React.useMemo(
        () => (enableRowSelection ? { table, rowSelection: effectiveRowSelection } : null),
        [enableRowSelection, table, effectiveRowSelection],
    );

    return (
        <MappingPreviewTableContext.Provider value={mappingPreviewTableContext}>
            <Table
                table={table}
                mappingRow={mappingRow}
                columnSearchBar={columnSearchBar}
                highlightedColumnId={highlightedColumnId}
                invalidCellLookup={invalidCellLookup}
                invalidColumnSeqLookup={invalidColumnSeqLookup}
                changedCellLookup={changedCellLookup}
                onSelectApprovedValue={onSelectApprovedValue}
                onRevertValue={onRevertValue}
                targetCellId={targetCellId}
                showColumnHeaders={showColumnHeaders}
            />
        </MappingPreviewTableContext.Provider>
    );
}
