import type { Column } from "@/components/InterfaceColumnsPills";
import {
    getPreviewColumnMetas,
    type PreviewRowWithId,
} from "@/components/table/tableUtils";
import type { InvalidCellLookup } from "@/pages/MappingPage/utils/mappedColumnDataUtils";

type ColumnMappings = Record<string, Column | null | undefined>;
type ManualValueOverrides = Record<string, Record<string, string>>;

export type MappedColumnRequiringApprovedValues = {
    fileHeader: string;
    columnSeq: number;
};

export type Conflict = {
    rowId: string;
    columnId: string;
    columnLabel: string;
};

export function buildInvalidCellLookup(params: {
    headers: string[];
    columnMappings: ColumnMappings;
    mappedColumnsRequiringApprovedValues: MappedColumnRequiringApprovedValues[];
    approvedValueSetsByColumnSeq: Map<number, Set<string>>;
    effectiveTableData: PreviewRowWithId[];
    selectedRowIds: Set<string>;
}): InvalidCellLookup {
    const {
        headers,
        columnMappings,
        mappedColumnsRequiringApprovedValues,
        approvedValueSetsByColumnSeq,
        effectiveTableData,
        selectedRowIds,
    } = params;
    const out: InvalidCellLookup = {};
    const metaByFileHeader = new Map(
        getPreviewColumnMetas(headers, columnMappings).map((meta) => [meta.fileHeader, meta]),
    );
    for (const { fileHeader, columnSeq } of mappedColumnsRequiringApprovedValues) {
        const approved = approvedValueSetsByColumnSeq.get(columnSeq);
        if (!approved || approved.size === 0) continue;
        const meta = metaByFileHeader.get(fileHeader);
        if (!meta) continue;
        for (const row of effectiveTableData) {
            if (!selectedRowIds.has(row._rowId)) continue;
            const normalizedValue = (row[fileHeader] ?? "").trim().toLowerCase();
            if (!approved.has(normalizedValue)) {
                out[row._rowId] = { ...(out[row._rowId] ?? {}), [meta.columnId]: true };
            }
        }
    }
    return out;
}

export function buildInvalidColumnSeqLookup(params: {
    headers: string[];
    columnMappings: ColumnMappings;
    mappedColumnsRequiringApprovedValues: MappedColumnRequiringApprovedValues[];
    invalidCellLookup: InvalidCellLookup;
}): Record<string, Record<string, number>> {
    const { headers, columnMappings, mappedColumnsRequiringApprovedValues, invalidCellLookup } = params;
    const out: Record<string, Record<string, number>> = {};
    const metaByFileHeader = new Map(
        getPreviewColumnMetas(headers, columnMappings).map((meta) => [meta.fileHeader, meta]),
    );
    for (const { fileHeader, columnSeq } of mappedColumnsRequiringApprovedValues) {
        const meta = metaByFileHeader.get(fileHeader);
        if (!meta) continue;
        for (const rowId of Object.keys(invalidCellLookup)) {
            if (!invalidCellLookup[rowId]?.[meta.columnId]) continue;
            out[rowId] = { ...(out[rowId] ?? {}), [meta.columnId]: columnSeq };
        }
    }
    return out;
}

export function buildConflicts(params: {
    headers: string[];
    columnMappings: ColumnMappings;
    invalidCellLookup: InvalidCellLookup;
}): Conflict[] {
    const { headers, columnMappings, invalidCellLookup } = params;
    const conflictsList: Conflict[] = [];
    const columnLabelById = new Map(
        getPreviewColumnMetas(headers, columnMappings).map((meta) => [meta.columnId, meta.headerLabel]),
    );
    for (const [rowId, invalidColumns] of Object.entries(invalidCellLookup)) {
        for (const columnId of Object.keys(invalidColumns)) {
            conflictsList.push({
                rowId,
                columnId,
                columnLabel: columnLabelById.get(columnId) ?? columnId,
            });
        }
    }
    return conflictsList;
}

export function buildChangedCellLookup(params: {
    headers: string[];
    columnMappings: ColumnMappings;
    manualValueOverrides: ManualValueOverrides;
}): Record<string, Record<string, true>> {
    const { headers, columnMappings, manualValueOverrides } = params;
    const out: Record<string, Record<string, true>> = {};
    const metaByFileHeader = new Map(
        getPreviewColumnMetas(headers, columnMappings).map((meta) => [meta.fileHeader, meta]),
    );
    for (const [rowId, overrides] of Object.entries(manualValueOverrides)) {
        for (const fileHeader of Object.keys(overrides)) {
            const meta = metaByFileHeader.get(fileHeader);
            if (!meta) continue;
            out[rowId] = { ...(out[rowId] ?? {}), [meta.columnId]: true };
        }
    }
    return out;
}

export function getMappedColumnsRequiringApprovedValues(
    columnMappings: ColumnMappings,
): MappedColumnRequiringApprovedValues[] {
    return Object.entries(columnMappings).flatMap(([fileHeader, col]) => {
        if (!col?.columnNeedsApprovedValues) return [];
        return [{ fileHeader, columnSeq: col.columnSeq }];
    });
}
