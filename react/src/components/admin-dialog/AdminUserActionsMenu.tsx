import { Menu } from "@base-ui/react/menu";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

type AdminUserActionsMenuProps = {
    onEdit: () => void;
    onDelete: () => void;
    deleteLabel: string;
    editLabel: string;
    canDelete: boolean;
    isDeleting: boolean;
};

export const AdminUserActionsMenu = ({
    onEdit,
    onDelete,
    deleteLabel,
    editLabel,
    canDelete,
    isDeleting,
}: AdminUserActionsMenuProps) => {
    return (
        <Menu.Root>
            <Menu.Trigger
                aria-label="User actions"
                className="flex items-center justify-center h-7 w-7 rounded-sm transition hover:bg-gray-100 data-popup-open:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer"
            >
                <Ellipsis className="h-4 w-4 text-black" />
            </Menu.Trigger>

            <Menu.Portal>
                <Menu.Positioner side="bottom" align="end" sideOffset={8}>
                    <Menu.Popup className="base-ui-popup-animation min-w-[170px] rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5 shadow-lg">
                        <Menu.Item
                            onClick={onEdit}
                            className="flex w-full cursor-pointer items-center px-2 py-2 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black"
                        >
                            <Pencil className="h-4 w-4" />
                            {editLabel}
                        </Menu.Item>
                        <Menu.Item
                            disabled={!canDelete || isDeleting}
                            onClick={onDelete}
                            className="flex w-full cursor-pointer items-center px-2 py-2 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-red-50 text-red-600 transition focus-visible:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            <Trash2 className="h-4 w-4" />
                            {deleteLabel}
                        </Menu.Item>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
};
