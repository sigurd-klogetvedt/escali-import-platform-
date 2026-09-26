import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { type UploadedFileAPIResponse } from "@/types/files";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type UploadFileVariables = {
    file: File;
    uploadToLocal: boolean;
};

export function useUploadFileMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async ({ file, uploadToLocal }: UploadFileVariables) => {
            const formData = new FormData();
            formData.append("file", file);
            const endpoint = uploadToLocal ? "/api/LocalUploadFiles/upload" : "/api/UploadFiles/upload";
            return api.post(endpoint, { body: formData }).json<UploadedFileAPIResponse>();
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["uploaded-files"],
            });
            notify.success(t("toast.upload.successTitle"), {
                description: variables.file.name,
            });
        },
        onError: (error) => {
            const serverMessage = error instanceof Error && error.message.length > 0
                ? error.message
                : null;
            notify.error(t("toast.upload.errorTitle"), {
                description: serverMessage ?? t("toast.upload.fallbackErrorDescription"),
            });
        },
    })
}
