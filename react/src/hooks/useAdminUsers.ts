import type { AdminUser } from "@/types/users";
import { useDeleteAdminUserMutation } from "@/hooks/mutations";
import { useAdminUsersQuery } from "@/hooks/queries";
import { useQueryErrorToast } from "@/hooks/useQueryErrorToast";
import { useTranslation } from "react-i18next";

type UseAdminUsersResult = {
    users: AdminUser[];
    isLoading: boolean;
    isDeleting: boolean;
    error: string | null;
    deleteUser: (userSeq: number) => Promise<void>;
};

type UseAdminUsersOptions = {
    enabled?: boolean;
};

export const useAdminUsers = (options?: UseAdminUsersOptions): UseAdminUsersResult => {
    const enabled = options?.enabled ?? true;
    const usersQuery = useAdminUsersQuery({ enabled });
    const deleteMutation = useDeleteAdminUserMutation();
    const { t } = useTranslation();

    useQueryErrorToast(usersQuery, t("toast.admin.loadUsersErrorTitle"), {
        enabled,
        id: "admin-users-load",
    });

    const deleteUser = async (userSeq: number) => {
        await deleteMutation.mutateAsync(userSeq);
    }

    const listError = usersQuery.isError ? "Failed to load admin users" : null;
    const deleteError = deleteMutation.isError ? "Failed to delete admin user" : null;

    return {
        users: enabled ? (usersQuery.data ?? []) : [],
        isLoading: enabled ? usersQuery.isPending : false,
        isDeleting: deleteMutation.isPending,
        error: listError ?? deleteError,
        deleteUser,
    };
};
