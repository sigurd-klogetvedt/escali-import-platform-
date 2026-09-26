import type { LucideIcon } from "lucide-react";

export type AdminSectionId = "users" | "files" | "templates";

export type AdminSection = {
    id: AdminSectionId;
    label: string;
    icon: LucideIcon;
};

type AdminSidebarNavProps = {
    title: string;
    sections: AdminSection[];
    activeSection: AdminSectionId;
    onSectionChange: (sectionId: AdminSectionId) => void;
    ariaLabel: string;
};

export const AdminSidebarNav = ({
    title,
    sections,
    activeSection,
    onSectionChange,
    ariaLabel,
}: AdminSidebarNavProps) => {
    return (
        <aside className="border-neutral-200 border-r border-solid flex flex-col gap-2 items-start overflow-clip px-2.5 py-4 shrink-0 w-50 h-full">
            <div className="flex items-center justify-center px-2">
                <p className="font-medium text-base text-black whitespace-nowrap">{title}</p>
            </div>

            <nav aria-label={ariaLabel} className="flex flex-col gap-0.5 items-start w-full">
                {sections.map((section) => {
                    const isActive = section.id === activeSection;
                    const Icon = section.icon;

                    return (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => onSectionChange(section.id)}
                            className={`flex gap-1 h-8 items-center overflow-clip px-2 rounded-sm w-full transition font-medium text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                                isActive ? "bg-neutral-100 text-black" : "text-black/80 hover:bg-neutral-100"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{section.label}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};
