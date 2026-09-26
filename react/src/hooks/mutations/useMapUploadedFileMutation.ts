import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type MapUploadedFileVariables = {
    fileSeq: number;
    interfaceSeq: number;
};

export function useMapUploadedFileMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationKey: ["map-uploaded-file"],
        mutationFn: async ({ fileSeq, interfaceSeq}: MapUploadedFileVariables) => {
            await api.patch(`api/UploadFiles/${fileSeq}/mapping`, {
                json: { interfaceSeq },
            });
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
            notify.success(t("toast.mapping.markMappedSuccessTitle"));
        },
        onError: (error) => {
            const serverMessage = error instanceof Error && error.message.length > 0 ? error.message : null;
            notify.error(t("toast.mapping.markMappedErrorTitle"), {
                description: serverMessage ?? t("toast.mapping.markMappedFallbackErrorDescription"),
            });
        },
    });
}