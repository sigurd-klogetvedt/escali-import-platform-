import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type DeleteFileVariables = {
    fileSeq: number;
    fileName: string;
};

export function useDeleteFileMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationKey: ["delete-file"],
        mutationFn: async ({ fileSeq }: DeleteFileVariables) => {
            await api.delete(`api/UploadFiles/${fileSeq}`);
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["uploaded-files"] });
            notify.success(t("toast.delete.successTitle"), {
                description: variables.fileName,
            });
        },
        onError: (error) => {
            const serverMessage = error instanceof Error && error.message.length > 0
                ? error.message
                : null;
            notify.error(t("toast.delete.errorTitle"), {
                description: serverMessage ?? t("toast.delete.fallbackErrorDescription"),
            });
        },
    });
}
