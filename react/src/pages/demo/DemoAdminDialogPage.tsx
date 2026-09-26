import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, LayoutTemplate, Users } from "lucide-react";
import type { AdminUser } from "../../types/users";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/Dialog";
import { AdminDialogLayout } from "../../components/admin-dialog/AdminDialogLayout";
import type { AdminSectionId } from "../../components/admin-dialog/AdminSidebarNav";
import { AdminUserList } from "../../components/admin-dialog/AdminUserList";
import { AdminFilesPanel } from "../../components/admin-dialog/AdminFilesPanel";
import { AdminTemplatesPanel } from "../../components/admin-dialog/AdminTemplatesPanel";

const MOCK_USERS: AdminUser[] = [
    { UserSeq: 1, Email: "anna.hansen@example.com", DisplayName: "Anna Hansen", IsAdmin: true, IsActive: true, LastLoginAt: "2026-04-14T09:30:00Z", UserCreated: "2024-01-10T08:00:00Z" },
    { UserSeq: 2, Email: "erik.johansen@example.com", DisplayName: "Erik Johansen", IsAdmin: false, IsActive: true, LastLoginAt: "2026-04-13T14:20:00Z", UserCreated: "2024-02-15T10:00:00Z" },
    { UserSeq: 3, Email: "maria.berg@example.com", DisplayName: "Maria Berg", IsAdmin: false, IsActive: true, LastLoginAt: "2026-04-12T11:45:00Z", UserCreated: "2024-03-01T09:00:00Z" },
    { UserSeq: 4, Email: "olav.nilsen@example.com", DisplayName: "Olav Nilsen", IsAdmin: true, IsActive: true, LastLoginAt: "2026-04-14T08:10:00Z", UserCreated: "2024-01-05T07:00:00Z" },
    { UserSeq: 5, Email: "sofie.larsen@example.com", DisplayName: "Sofie Larsen", IsAdmin: false, IsActive: true, LastLoginAt: "2026-04-10T16:00:00Z", UserCreated: "2024-05-20T12:00:00Z" },
    { UserSeq: 6, Email: "thomas.pedersen@example.com", DisplayName: "Thomas Pedersen", IsAdmin: false, IsActive: true, LastLoginAt: "2026-03-28T10:30:00Z", UserCreated: "2024-06-11T08:00:00Z" },
    { UserSeq: 7, Email: "ingrid.dahl@example.com", DisplayName: "Ingrid Dahl", IsAdmin: false, IsActive: true, LastLoginAt: "2026-04-11T13:15:00Z", UserCreated: "2024-04-02T09:30:00Z" },
    { UserSeq: 8, Email: "magnus.solberg@example.com", DisplayName: "Magnus Solberg", IsAdmin: false, IsActive: true, LastLoginAt: null, UserCreated: "2026-04-01T10:00:00Z" },
];

const CURRENT_USER_ID = "1";

export const DemoAdminDialogPage = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [sortAscending, setSortAscending] = useState(true);
    const [activeSection, setActiveSection] = useState<AdminSectionId>("users");

    const visibleUsers = MOCK_USERS
        .filter((user) => {
            const search = searchValue.trim().toLowerCase();
            if (search.length === 0) return true;
            return user.DisplayName.toLowerCase().includes(search) || user.Email.toLowerCase().includes(search);
        })
        .sort((a, b) => {
            const result = a.DisplayName.localeCompare(b.DisplayName);
            return sortAscending ? result : -result;
        });

    const sections = [
        { id: "users" as const, label: t("adminDialog.usersTitle"), icon: Users },
        { id: "files" as const, label: t("adminDialog.filesLabel"), icon: FileText },
        { id: "templates" as const, label: t("adminDialog.templatesLabel"), icon: LayoutTemplate },
    ];

    return (
        <div className="flex items-center justify-center h-screen">
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
                Open Admin Dialog
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 max-w-[760px] overflow-hidden h-[60vh]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{t("adminDialog.dialogTitle")}</DialogTitle>
                        <DialogDescription>{t("adminDialog.dialogDescription")}</DialogDescription>
                    </DialogHeader>
                    <AdminDialogLayout
                        title={sections.find((s) => s.id === activeSection)?.label ?? t("adminDialog.usersTitle")}
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
                        onToggleSort={() => setSortAscending((prev) => !prev)}
                        onClose={() => setOpen(false)}
                        showToolbar={activeSection === "users"}
                    >
                        {activeSection === "users" ? (
                            <AdminUserList
                                users={visibleUsers}
                                isLoading={false}
                                isDeleting={false}
                                error={null}
                                currentUserId={CURRENT_USER_ID}
                                emptyLabel={t("adminDialog.empty")}
                                loadingLabel={t("common.loading")}
                                errorLabel={t("adminDialog.loadError")}
                                administratorLabel={t("adminDialog.administrator")}
                                youLabel={t("adminDialog.you")}
                                editLabel={t("adminDialog.edit")}
                                deleteLabel={t("adminDialog.delete")}
                                onEditUser={(user) => console.info("Edit user:", user)}
                                onDeleteUser={(user) => console.info("Delete user:", user)}
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
        </div>
    );
};
