import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HTTPError } from "ky";
import { useTranslation } from "react-i18next";

export type CreateMappingTemplateColumnInput = {
    originalColumn: string;
    targetColumnSeq: number;
};

type CreateMappingTemplateVariables = {
    templateName: string;
    interfaceSeq: number;
    columnMapping: CreateMappingTemplateColumnInput[];
};

export function useCreateMappingTemplateMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationKey: ["create-mapping-template"],
        mutationFn: async ({ templateName, interfaceSeq, columnMapping }: CreateMappingTemplateVariables) => {
            await api.post("/api/MappingTemplates", {
                json: {
                    templateName,
                    interfaceSeq,
                    columnMapping,
                },
            });
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["mapping-templates", variables.interfaceSeq] });
            notify.success(t("mappingPage.templateCreateSuccessTitle"));
        },
        onError: async (error) => {
            let description = t("mappingPage.templateCreateErrorFallback");
            if (error instanceof HTTPError) {
                try {
                    const body = (await error.response.json()) as { message?: string };
                    if (body.message) description = body.message;
                } catch {
                    /* ignore */
                }
            }
            notify.error(t("mappingPage.templateCreateErrorTitle"), { description });
        },
    });
}
