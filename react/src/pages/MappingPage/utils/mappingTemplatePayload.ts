import type { Column } from "@/components/InterfaceColumnsPills";

export type CreateTemplateColumnMappingRow = {
    originalColumn: string;
    targetColumnSeq: number;
};

/**
 * Builds API `columnMapping` rows: each file column header → interface {@link Column.columnSeq}.
 * Keys in `columnMappings` are the original dataset header names from the preview.
 */
export function buildColumnMappingsForCreateTemplate(
    columnMappings: Record<string, Column | null | undefined>,
): CreateTemplateColumnMappingRow[] {
    const rows: CreateTemplateColumnMappingRow[] = [];
    for (const [originalColumn, col] of Object.entries(columnMappings)) {
        if (col == null) continue;
        rows.push({ originalColumn, targetColumnSeq: col.columnSeq });
    }
    return rows;
}
