import type { AdminUser } from "../../types/users";
import { AdminUserActionsMenu } from "./AdminUserActionsMenu";

type AdminUserRowProps = {
    user: AdminUser;
    isCurrentUser: boolean;
    isDeleting: boolean;
    onEditUser: (user: AdminUser) => void;
    onDeleteUser: (user: AdminUser) => void;
    administratorLabel: string;
    youLabel: string;
    editLabel: string;
    deleteLabel: string;
};

const getUserInitials = (displayName: string) => {
    return displayName
        .split(" ")
        .map((part) => part[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

export const AdminUserRow = ({
    user,
    isCurrentUser,
    isDeleting,
    onEditUser,
    onDeleteUser,
    administratorLabel,
    youLabel,
    editLabel,
    deleteLabel,
}: AdminUserRowProps) => {
    const initials = getUserInitials(user.DisplayName);

    return (
        <div className="content-stretch flex items-center justify-between overflow-clip px-[10px] py-[4px] rounded-[4px] w-full">
            <div className="content-stretch flex gap-[8px] items-center">
                <div className="border border-[#cfcfcf] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[50px] shrink-0 size-[28px]">
                    <p className="font-medium leading-[normal] text-[12px] text-black whitespace-nowrap">{initials}</p>
                </div>

                <div className="content-stretch flex flex-col font-medium items-start justify-center leading-[normal]">
                    <p className="text-[14px] text-black">
                        {user.DisplayName}
                        {isCurrentUser ? <span className="text-black/70"> ({youLabel})</span> : null}
                    </p>
                    <p className="text-[12px] text-black/70">{user.Email}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {user.IsAdmin ? (
                    <span className="bg-blue-100 text-blue-500 content-stretch flex h-[28px] items-center justify-center overflow-clip px-[12px] rounded-[50px] shrink-0 text-[12px] font-medium">
                        {administratorLabel}
                    </span>
                ) : null}

                <AdminUserActionsMenu
                    canDelete={!isCurrentUser}
                    isDeleting={isDeleting}
                    onEdit={() => onEditUser(user)}
                    onDelete={() => onDeleteUser(user)}
                    editLabel={editLabel}
                    deleteLabel={deleteLabel}
                />
            </div>
        </div>
    );
};
