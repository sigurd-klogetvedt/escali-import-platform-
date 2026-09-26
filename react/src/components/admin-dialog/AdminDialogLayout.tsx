import { Search, SlidersHorizontal, UserPlus, X } from "lucide-react";
import type { ReactNode } from "react";
import type { AdminSection, AdminSectionId } from "./AdminSidebarNav";
import { AdminSidebarNav } from "./AdminSidebarNav";

type AdminDialogLayoutProps = {
    title: string;
    onClose: () => void;
    navTitle: string;
    navAriaLabel: string;
    sections: AdminSection[];
    activeSection: AdminSectionId;
    onSectionChange: (sectionId: AdminSectionId) => void;
    newLabel: string;
    sortLabel: string;
    searchLabel: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onToggleSort: () => void;
    showToolbar: boolean;
    children: ReactNode;
};

export const AdminDialogLayout = ({
    title,
    onClose,
    navTitle,
    navAriaLabel,
    sections,
    activeSection,
    onSectionChange,
    newLabel,
    sortLabel,
    searchLabel,
    searchValue,
    onSearchChange,
    onToggleSort,
    showToolbar,
    children,
}: AdminDialogLayoutProps) => {
    return (
        <div className="flex items-start w-full h-full">
            <AdminSidebarNav
                title={navTitle}
                sections={sections}
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                ariaLabel={navAriaLabel}
            />

            <section className="flex flex-col items-start w-full h-full">
                <div className="flex flex-col items-start overflow-clip w-full h-full">
                    <div className="border-neutral-200 border-b border-solid flex h-12 items-center justify-between overflow-clip px-4 w-full">
                        <p className="font-medium text-base text-black whitespace-nowrap">{title}</p>
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-sm hover:bg-neutral-100 transition cursor-pointer"
                        >
                            <X className="h-4 w-4 text-black/70" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 items-center overflow-clip w-full">
                        {showToolbar ? (
                            <div className="flex gap-2 items-center overflow-clip px-4 w-full h-12">
                                <button
                                    type="button"
                                    className="bg-white border border-neutral-300 border-solid flex gap-1 h-8 items-center justify-center px-2 rounded-sm cursor-pointer hover:bg-neutral-100 transition text-sm font-medium"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    {newLabel}
                                </button>
                                <button
                                    type="button"
                                    onClick={onToggleSort}
                                    className="bg-white border border-neutral-300 border-solid flex gap-1 h-8 items-center justify-center px-2 rounded-sm cursor-pointer hover:bg-neutral-100 transition text-sm font-medium"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    {sortLabel}
                                </button>
                                <label className="bg-white border border-neutral-300 border-solid flex flex-1 gap-1 h-8 items-center min-h-px min-w-px px-2 rounded-sm">
                                    <Search className="h-4 w-4 text-black/70" />
                                    <input
                                        value={searchValue}
                                        onChange={(event) => onSearchChange(event.target.value)}
                                        placeholder={searchLabel}
                                        className="w-full bg-transparent text-sm text-black placeholder:text-black/70 outline-none"
                                    />
                                </label>
                            </div>
                        ) : null}

                        {children}
                    </div>
                </div>
            </section>
        </div>
    );
};
