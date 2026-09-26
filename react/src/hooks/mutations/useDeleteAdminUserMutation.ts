import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export function useDeleteAdminUserMutation() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationKey: ["delete-admin-user"],
        mutationFn: async (userSeq: number) => {
            await api.delete(`/api/UserAdmin/users/${userSeq}`);
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            notify.success(t("toast.admin.deleteUserSuccessTitle"));
        },
        onError: () => {
            notify.error(t("toast.admin.deleteUserErrorTitle"));
        },
    })
}
