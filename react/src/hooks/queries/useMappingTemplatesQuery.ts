import { api } from "@/api/apiClient";
import type { MappingTemplateListItem } from "@/types/mappingTemplate";
import { useQuery } from "@tanstack/react-query";

type ApiRow = {
    templateSeq?: number;
    TemplateSeq?: number;
    templateName?: string;
    TemplateName?: string;
    interfaceSeq?: number;
    InterfaceSeq?: number;
    templateCreatedAt?: string;
    TemplateCreatedAt?: string;
};

function normalizeList(rows: ApiRow[]): MappingTemplateListItem[] {
    return (rows ?? []).map((r) => ({
        templateSeq: r.templateSeq ?? r.TemplateSeq ?? 0,
        templateName: r.templateName ?? r.TemplateName ?? "",
        interfaceSeq: r.interfaceSeq ?? r.InterfaceSeq ?? 0,
        templateCreatedAt: r.templateCreatedAt ?? r.TemplateCreatedAt ?? "",
    }));
}

export function useMappingTemplatesQuery(interfaceSeq: number) {
    return useQuery({
        queryKey: ["mapping-templates", interfaceSeq],
        queryFn: async ({ signal }) => {
            const searchParams = new URLSearchParams({ interfaceSeq: String(interfaceSeq) });
            return api
                .get(`/api/MappingTemplates?${searchParams}`, { signal })
                .json<ApiRow[]>()
                .then(normalizeList);
        },
        enabled: interfaceSeq > 0,
    });
}