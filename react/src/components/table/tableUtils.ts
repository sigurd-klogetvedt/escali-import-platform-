import { createColumnHelper } from "@tanstack/react-table";

/**
 * JSON shape returned by the file preview API: column names and a grid of cells
 */
export type FilePreviewResponse = {
    headers: string[];
    rows: string[][];
}

/**
 *  One preview row as a map from header name to cell value
 */
export type PreviewRow = Record<string, string>;

/**
 * A preview row with a stable synthetic id for TanStack Table row keys and selection
 * ({@link getPreviewRowId})
 */
export type PreviewRowWithId = PreviewRow & { _rowId: string };

const col = createColumnHelper<PreviewRowWithId>();

/** Subset of interface column used when resolving preview column ids from drag-and-drop mappings */
export type PreviewColumnMapping = {
    columnFieldName: string;
};

export type PreviewColumnMeta = {
    /** Original header key from the parsed file (row object key for cell values) */
    fileHeader: string;
    /** Stable TanStack column id; equals {@link PreviewColumnMapping.columnFieldName} when mapped and unique */
    columnId: string;
    /** Text shown in the data table header row */
    headerLabel: string;
};

/**
 * Derives per-column ids and labels from file headers and optional interface mappings.
 * When two columns would share the same {@link PreviewColumnMapping.columnFieldName}, ids are disambiguated.
 */
export function getPreviewColumnMetas(
    headers: string[],
    columnMappings?: Record<string, PreviewColumnMapping | null | undefined>,
): PreviewColumnMeta[] {
    const baseIds = headers.map((h) => columnMappings?.[h]?.columnFieldName ?? h);
    const counts = new Map<string, number>();
    for (const id of baseIds) {
        counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return headers.map((fileHeader) => {
        const m = columnMappings?.[fileHeader];
        const base = m?.columnFieldName ?? fileHeader;
        const collides = (counts.get(base) ?? 0) > 1;
        const columnId = collides ? `${base}__${fileHeader}` : base;
        const headerLabel = m?.columnFieldName ?? fileHeader;
        return { fileHeader, columnId, headerLabel };
    });
}

/**
 * Converts API preview data into table rows with one object per grid row and a stable
 * {@link PreviewRowWithId._rowId} derived from the row index.
 * When requested, the preview headers become row zero so mapping treats them as data.
 * 
 * @param response - Raw preview payload, `null` when not loaded / when unavailable
 * @returns An empty array if headers or rows are missing; otherwise returns {@link PreviewRowWithId} rows.
 */
type PreviewResponseToTableDataOptions = {
    includeHeadersAsFirstRow?: boolean;
};

export function previewResponseToTableData(
    response: FilePreviewResponse | null,
    options: PreviewResponseToTableDataOptions = {},
): PreviewRowWithId[] {
    if (!response?.headers?.length || !response?.rows) {
        return [];
    }
    const previewRows = response.rows.map((row, rowIndex) => {
        const cells = Object.fromEntries(
            response.headers.map((header, i) => [header, row[i] ?? ""]),
        ) as PreviewRow;
        return {
            ...cells,
            _rowId: `row-${options.includeHeadersAsFirstRow ? rowIndex + 1 : rowIndex}`,
        };
    });

    if (!options.includeHeadersAsFirstRow) {
        return previewRows;
    }

    const headerRow = Object.fromEntries(
        response.headers.map((header) => [header, header]),
    ) as PreviewRow;

    return [{ ...headerRow, _rowId: "row-headers" }, ...previewRows];
}

/**
 * Builds TanStack accessor columns for each preview header (dynamic cols).
 * Cell values always come from {@link PreviewColumnMeta.fileHeader} so every row shows the same file column.
 * When {@link columnMappings} maps a file header, the column id and header label use {@link PreviewColumnMapping.columnFieldName}.
 */
export function buildPreviewColumns(
    headers: string[],
    columnMappings?: Record<string, PreviewColumnMapping | null | undefined>,
) {
       const metas = getPreviewColumnMetas(headers, columnMappings);
    return metas.map(({ columnId, headerLabel }) =>
        col.accessor((row) => row[columnId] ?? "", { id: columnId, header: headerLabel }),
    );
}

/**
 * Returns TanStack's row id for a preview row (the {@link PreviewRowWithId._rowId} field).
 * Suitable for `getRowId` on {@link useReactTable}.
 * @param row 
 * @returns 
 */
export function getPreviewRowId(row: PreviewRowWithId): string {
    return row._rowId;
}