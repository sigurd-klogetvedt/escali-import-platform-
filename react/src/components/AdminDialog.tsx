import { FileText, LayoutTemplate, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type { AdminUser } from "../types/users";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./Dialog";
import { AdminDialogLayout } from "./admin-dialog/AdminDialogLayout";
import { AdminFilesPanel } from "./admin-dialog/AdminFilesPanel";
import type { AdminSectionId } from "./admin-dialog/AdminSidebarNav";
import { AdminTemplatesPanel } from "./admin-dialog/AdminTemplatesPanel";
import { AdminUserList } from "./admin-dialog/AdminUserList";

type AdminDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentUserId: string | null;
};

export const AdminDialog = ({ open, onOpenChange, currentUserId }: AdminDialogProps) => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState("");
    const [sortAscending, setSortAscending] = useState(true);
    const [activeSection, setActiveSection] = useState<AdminSectionId>("users");
    const { users, isLoading, isDeleting, error, deleteUser } = useAdminUsers({ enabled: open });

    const visibleUsers = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase();

        const filteredUsers = users.filter((user) => {
            if (normalizedSearch.length === 0) {
                return true;
            }

            return (
                user.DisplayName.toLowerCase().includes(normalizedSearch) ||
                user.Email.toLowerCase().includes(normalizedSearch)
            );
        });

        return filteredUsers.sort((firstUser, secondUser) => {
            const compareResult = firstUser.DisplayName.localeCompare(secondUser.DisplayName);
            return sortAscending ? compareResult : -compareResult;
        });
    }, [users, searchValue, sortAscending]);

    const handleEditUser = (user: AdminUser) => {
        console.info("Edit user is not implemented yet", user);
    };

    const handleDeleteUser = async (user: AdminUser) => {
        await deleteUser(user.UserSeq);
    };

    const sections = [
        { id: "users" as const, label: t("adminDialog.usersTitle"), icon: Users },
        { id: "files" as const, label: t("adminDialog.filesLabel"), icon: FileText },
        { id: "templates" as const, label: t("adminDialog.templatesLabel"), icon: LayoutTemplate },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 max-w-[760px] overflow-hidden h-[60vh]">
                <DialogHeader className="sr-only">
                    <DialogTitle>{t("adminDialog.dialogTitle")}</DialogTitle>
                    <DialogDescription>{t("adminDialog.dialogDescription")}</DialogDescription>
                </DialogHeader>
                <AdminDialogLayout
                    title={sections.find((section) => section.id === activeSection)?.label ?? t("adminDialog.usersTitle")}
                    navTitle={t("adminDialog.navTitle")}
                    navAriaLabel={t("adminDialog.sidebarAriaLabel")}
                    sections={sections}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    newLabel={t("adminDialog.newLabel")}
                    sortLabel={t("adminDialog.sortLabel")}
                    searchLabel={t("adminDialog.searchLabel")}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onToggleSort={() => setSortAscending((previous) => !previous)}
                    onClose={() => onOpenChange(false)}
                    showToolbar={activeSection === "users"}
                >
                    {activeSection === "users" ? (
                        <AdminUserList
                            users={visibleUsers}
                            isLoading={isLoading}
                            isDeleting={isDeleting}
                            error={error}
                            currentUserId={currentUserId}
                            emptyLabel={t("adminDialog.empty")}
                            loadingLabel={t("common.loading")}
                            errorLabel={t("adminDialog.loadError")}
                            administratorLabel={t("adminDialog.administrator")}
                            youLabel={t("adminDialog.you")}
                            editLabel={t("adminDialog.edit")}
                            deleteLabel={t("adminDialog.delete")}
                            onEditUser={handleEditUser}
                            onDeleteUser={handleDeleteUser}
                        />
                    ) : null}

                    {activeSection === "files" ? (
                        <AdminFilesPanel
                            title={t("adminDialog.filesPanelTitle")}
                            description={t("adminDialog.filesPanelDescription")}
                        />
                    ) : null}

                    {activeSection === "templates" ? (
                        <AdminTemplatesPanel
                            title={t("adminDialog.templatesPanelTitle")}
                            description={t("adminDialog.templatesPanelDescription")}
                        />
                    ) : null}
                </AdminDialogLayout>
            </DialogContent>
        </Dialog>
    );
};
