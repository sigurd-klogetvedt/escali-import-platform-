import {
    getPreviewColumnMetas,
    type PreviewColumnMapping,
    type PreviewRowWithId,
} from "@/components/table/tableUtils";

/**
 * Accumulated mapping payload: interface field name → all cell values for that mapping (one per preview row).
 * Starts empty; each map adds a key; unmap removes it. Values always mirror the current preview for that file column.
 */
export type MappedColumnData = Record<string, string[]>;
export type InvalidCellLookup = Record<string, Record<string, true>>;

export type ApprovedColumnValuesResponse = {
    columnSeq: number;
    byLanguage: {
        languageCode: string;
        values: string[];
    }[];
};

export function createEmptyMappedColumnData(): MappedColumnData {
    return {};
}

/** Values for one file column across all preview rows (same order as {@link PreviewRowWithId} rows). */
export function extractColumnValuesFromPreviewRows(
    tableData: PreviewRowWithId[],
    fileHeader: string,
): string[] {
    return tableData.map((row) => row[fileHeader] ?? "");
}

export function addMappedColumn(
    state: MappedColumnData,
    columnFieldName: string,
    values: string[],
): MappedColumnData {
    return { ...state, [columnFieldName]: values };
}

export function removeMappedColumn(state: MappedColumnData, columnFieldName: string): MappedColumnData {
    const next = { ...state };
    delete next[columnFieldName];
    return next;
}

/**
 * Builds the mapped-column JSON from the current preview grid and which file headers are mapped.
 * Keys are {@link PreviewColumnMapping.columnFieldName}; unmapped columns do not appear.
 */
export function buildMappedColumnDataFromMappings(
    tableData: PreviewRowWithId[],
    columnMappings: Record<string, PreviewColumnMapping | null | undefined>,
): MappedColumnData {
    const next: MappedColumnData = {};
    for (const [fileHeader, col] of Object.entries(columnMappings)) {
        if (!col) continue;
        next[col.columnFieldName] = extractColumnValuesFromPreviewRows(tableData, fileHeader);
    }
    return next;
}

/**
 * Table rows for the preview grid: each key matches TanStack column id ({@link getPreviewColumnMetas}).
 * Mapped columns read from {@link MappedColumnData}; unmapped columns read from the raw preview row.
 */
export function buildDisplayPreviewRows(
    tableData: PreviewRowWithId[],
    headers: string[],
    columnMappings: Record<string, PreviewColumnMapping | null | undefined>,
    mappedColumnData: MappedColumnData,
): PreviewRowWithId[] {
    const metas = getPreviewColumnMetas(headers, columnMappings);
    return tableData.map((sourceRow, rowIndex) => {
        const row: PreviewRowWithId = { _rowId: sourceRow._rowId };
        for (const { fileHeader, columnId } of metas) {
            const mapped = columnMappings[fileHeader];
            if (mapped) {
                row[columnId] = mappedColumnData[mapped.columnFieldName]?.[rowIndex] ?? "";
            } else {
                row[columnId] = sourceRow[fileHeader] ?? "";
            }
        }
        return row;
    });
}

function normalizeApprovedValue(value: string): string {
    return value.trim().toLowerCase();
}

/**
 * Builds a lookup set of approved values across all languages for a column.
 * Validation must not depend on selected UI language.
 */
export function approvedValueSetAllLanguages(response: ApprovedColumnValuesResponse | undefined): Set<string> {
    if (!response) return new Set();
    const out = new Set<string>();
    for (const lang of response.byLanguage) {
        for (const value of lang.values) {
            out.add(normalizeApprovedValue(value));
        }
    }
    return out;
}
