import type { AdminUser } from "../../types/users";
import { AdminUserRow } from "./AdminUserRow";

type AdminUserListProps = {
    users: AdminUser[];
    isLoading: boolean;
    isDeleting: boolean;
    error: string | null;
    currentUserId: string | null;
    emptyLabel: string;
    loadingLabel: string;
    errorLabel: string;
    administratorLabel: string;
    youLabel: string;
    editLabel: string;
    deleteLabel: string;
    onEditUser: (user: AdminUser) => void;
    onDeleteUser: (user: AdminUser) => void;
};

export const AdminUserList = ({
    users,
    isLoading,
    isDeleting,
    error,
    currentUserId,
    emptyLabel,
    loadingLabel,
    errorLabel,
    administratorLabel,
    youLabel,
    editLabel,
    deleteLabel,
    onEditUser,
    onDeleteUser,
}: AdminUserListProps) => {
    if (isLoading) {
        return <p className="px-[10px] py-[4px] text-sm text-black/70">{loadingLabel}</p>;
    }

    if (error) {
        return <p className="px-[10px] py-[4px] text-sm text-red-600">{errorLabel}</p>;
    }

    if (users.length === 0) {
        return <p className="px-[10px] py-[4px] text-sm text-black/70">{emptyLabel}</p>;
    }

    return (
        <>
            {users.map((user) => {
                const isCurrentUser = currentUserId != null && Number(currentUserId) === user.UserSeq;

                return (
                    <AdminUserRow
                        key={user.UserSeq}
                        user={user}
                        isCurrentUser={isCurrentUser}
                        isDeleting={isDeleting}
                        onEditUser={onEditUser}
                        onDeleteUser={onDeleteUser}
                        administratorLabel={administratorLabel}
                        youLabel={youLabel}
                        editLabel={editLabel}
                        deleteLabel={deleteLabel}
                    />
                );
            })}
        </>
    );
};
