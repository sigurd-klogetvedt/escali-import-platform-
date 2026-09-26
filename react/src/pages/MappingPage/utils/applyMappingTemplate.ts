import type { Column } from "@/components/InterfaceColumnsPills";

export type MappingTemplateColumnDetail = {
    templateColumnSeq: number;
    originalColumn: string;
    targetColumnSeq: number;
};

export type MappingTemplateDetail = {
    templateSeq: number;
    templateName: string;
    interfaceSeq: number;
    companySeq: number;
    createdByUserSeq: number;
    templateCreatedAt: string;
    columnMapping: MappingTemplateColumnDetail[];
};

type ApiColumnRow = {
    templateColumnSeq?: number;
    TemplateColumnSeq?: number;
    originalColumn?: string;
    OriginalColumn?: string;
    targetColumnSeq?: number;
    TargetColumnSeq?: number;
};

type ApiTemplate = {
    templateSeq?: number;
    TemplateSeq?: number;
    templateName?: string;
    TemplateName?: string;
    interfaceSeq?: number;
    InterfaceSeq?: number;
    companySeq?: number;
    CompanySeq?: number;
    createdByUserSeq?: number;
    CreatedByUserSeq?: number;
    templateCreatedAt?: string;
    TemplateCreatedAt?: string;
    columnMapping?: ApiColumnRow[];
    ColumnMapping?: ApiColumnRow[];
};

export function normalizeMappingTemplateDetail(raw: unknown): MappingTemplateDetail {
    const r = raw as ApiTemplate;
    const cols = r.columnMapping ?? r.ColumnMapping ?? [];
    return {
        templateSeq: r.templateSeq ?? r.TemplateSeq ?? 0,
        templateName: r.templateName ?? r.TemplateName ?? "",
        interfaceSeq: r.interfaceSeq ?? r.InterfaceSeq ?? 0,
        companySeq: r.companySeq ?? r.CompanySeq ?? 0,
        createdByUserSeq: r.createdByUserSeq ?? r.CreatedByUserSeq ?? 0,
        templateCreatedAt: r.templateCreatedAt ?? r.TemplateCreatedAt ?? "",
        columnMapping: cols.map((c) => ({
            templateColumnSeq: c.templateColumnSeq ?? c.TemplateColumnSeq ?? 0,
            originalColumn: c.originalColumn ?? c.OriginalColumn ?? "",
            targetColumnSeq: c.targetColumnSeq ?? c.TargetColumnSeq ?? 0,
        })),
    };
}

/**
 * Match template {@link originalColumn} to the preview's file header key (exact or trim-equal).
 */
export function resolveFileHeaderKey(fileHeaders: string[], templateOriginalColumn: string): string | null {
    const normalized = templateOriginalColumn.trim();
    for (const h of fileHeaders) {
        if (h === templateOriginalColumn || h.trim() === normalized) return h;
    }
    return null;
}

export type ApplyTemplateResult = {
    nextMappings: Record<string, Column | null>;
    applied: number;
    skippedNoHeader: number;
    skippedMissingTarget: number;
};

/**
 * Merges template rows into existing {@link columnMappings}: each matching file header
 * is set to the interface {@link Column} for {@link targetColumnSeq}.
 */
export function mergeTemplateIntoColumnMappings(
    currentMappings: Record<string, Column | null>,
    templateRows: { originalColumn: string; targetColumnSeq: number }[],
    fileHeaders: string[],
    interfaceColumns: Column[],
): ApplyTemplateResult {
    const colBySeq = new Map(interfaceColumns.map((c) => [c.columnSeq, c]));
    const nextMappings: Record<string, Column | null> = { ...currentMappings };
    let applied = 0;
    let skippedNoHeader = 0;
    let skippedMissingTarget = 0;

    for (const row of templateRows) {
        const fileKey = resolveFileHeaderKey(fileHeaders, row.originalColumn);
        if (fileKey == null) {
            skippedNoHeader++;
            continue;
        }
        const col = colBySeq.get(row.targetColumnSeq);
        if (col == null) {
            skippedMissingTarget++;
            continue;
        }
        nextMappings[fileKey] = col;
        applied++;
    }

    return { nextMappings, applied, skippedNoHeader, skippedMissingTarget };
}
