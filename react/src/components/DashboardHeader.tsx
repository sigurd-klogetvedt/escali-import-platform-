import { Menu } from "@base-ui/react";
import { useTranslation } from "react-i18next";
import { Building2, ChevronRight, CircleDashed, ListFilter, Settings2, SquaresExclude, X } from "lucide-react";
import type { SheetType } from "@/types/sheet-types";
import type { Status } from "@/types/statuses";

type DashboardHeaderProps = {
    sheetTypes: SheetType[];
    statuses: Status[];
    loading: boolean;
    count: number;
    filters: FilterState;
    onFiltersChange: (next: FilterState) => void;
};

export type FilterState = {
    typeIds: number[];
    statusIds: number[];
    companyFiles: boolean;
};

export const DashboardHeader = ({ sheetTypes, statuses, loading, count, filters, onFiltersChange }: DashboardHeaderProps) => {
    const { t } = useTranslation();

    const filterOptions = {
        type: {
            trigger: {
                id: "type",
                label: "Type",
                icon: "SquaresExclude" as const,
            },
            items: sheetTypes.map((st) => ({
                id: st.InterfaceSeq.toString(),
                interfaceSeq: st.InterfaceSeq,
                label: t(`sheetTypes.${st.InterfaceName}`),
            })),
        },
        status: {
            trigger: {
                id: "status",
                label: "Status",
                icon: "CircleDashed" as const,
            },
            items: statuses.map((s) => ({
                id: s.StatusSeq.toString(),
                statusSeq: s.StatusSeq,
                label: t(`statuses.${s.StatusName.toLowerCase()}`),
            })),
        },
        companyFiles: {
            id: "company-files",
            label: t("filerow.companyFiles"),
            icon: "Building2" as const,
        },
    };

    const filterIconMap = {
        SquaresExclude,
        CircleDashed,
        Building2,
    } as const;

    const handleFilterClick = (payload: { group: "type" | "status" | "company"; id: string }) => {
        if (payload.group === "type") {
            const id = Number(payload.id);
            const exists = filters.typeIds.includes(id);
            onFiltersChange({
                ...filters,
                typeIds: exists ? filters.typeIds.filter((x) => x !== id) : [...filters.typeIds, id],
            });
            return;
        }

        if (payload.group === "status") {
            const id = Number(payload.id);
            const exists = filters.statusIds.includes(id);
            onFiltersChange({
                ...filters,
                statusIds: exists ? filters.statusIds.filter((x) => x !== id) : [...filters.statusIds, id],
            });
            return;
        }

        onFiltersChange({ ...filters, companyFiles: !filters.companyFiles });
    };

    const clearFilter = (group: "type" | "status" | "company") => {
        if (group === "type") {
            onFiltersChange({ ...filters, typeIds: [] });
            return;
        }

        if (group === "status") {
            onFiltersChange({ ...filters, statusIds: [] });
            return;
        }

        onFiltersChange({ ...filters, companyFiles: false });
    };

    const selectedTypes = sheetTypes.filter((st) => filters.typeIds.includes(st.InterfaceSeq));
    const selectedStatuses = filterOptions.status.items.filter((item) => filters.statusIds.includes(item.statusSeq));

    const TypeIcon = filterIconMap[filterOptions.type.trigger.icon as keyof typeof filterIconMap];
    const StatusIcon = filterIconMap[filterOptions.status.trigger.icon as keyof typeof filterIconMap];
    const CompanyIcon = filterIconMap[filterOptions.companyFiles.icon as keyof typeof filterIconMap];

    return (
        <div className="flex items-center justify-between h-8 w-full">
            <div className="flex gap-2 pr-4 items-center justify-start shrink-0">
                <p className="font-medium text-base text-black">{t("filerow.uploads")}</p>
                <div className="w-px h-3.5 bg-neutral-200" />
                <p className="text-black/50 text-sm font-medium">
                    {loading ? t("common.loading") : `${count} ${t("common.files")}`}
                </p>
            </div>

            <div className="h-full flex-1 min-w-0 overflow-x-auto" dir="rtl">
                <div className="h-full flex items-center justify-start gap-1 px-2 w-max">
                    {selectedTypes.map((st) => (
                        <div key={`type-${st.InterfaceSeq}`} className="flex items-center justify-center gap-2 px-3 py-3 rounded-full bg-white border border-neutral-200 h-8" dir="ltr">
                            <div className="flex items-center justify-center gap-1 text-sm text-black font-medium">
                                <TypeIcon className="w-4 h-4" />
                                {t(`sheetTypes.${st.InterfaceName}`)}
                            </div>
                            <button type="button" onClick={() => handleFilterClick({ group: "type", id: st.InterfaceSeq.toString() })} className="flex items-center justify-center rounded-full h-5 w-5 hover:bg-gray-100 transition" aria-label="Remove type filter">
                                <X className="text-black w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {selectedStatuses.map((s) => (
                        <div key={`status-${s.statusSeq}`} className="flex items-center justify-center gap-2 px-3 py-3 rounded-full bg-white border border-neutral-200 h-8" dir="ltr">
                            <div className="flex items-center justify-center gap-1 text-sm text-black font-medium">
                                <StatusIcon className="w-4 h-4" />
                                {s.label}
                            </div>
                            <button type="button" onClick={() => handleFilterClick({ group: "status", id: s.statusSeq.toString() })} className="flex items-center justify-center rounded-full h-5 w-5 hover:bg-gray-100 transition" aria-label="Remove status filter">
                                <X className="text-black w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {filters.companyFiles && (
                        <div className="flex items-center justify-center gap-2 px-3 py-3 rounded-full bg-white border border-neutral-200 h-8" dir="ltr">
                            <div className="flex items-center justify-center gap-1 text-sm text-black font-medium">
                                <CompanyIcon className="w-4 h-4" />
                                {filterOptions.companyFiles.label}
                            </div>
                            <button type="button" onClick={() => clearFilter("company")} className="flex items-center justify-center rounded-full h-5 w-5 hover:bg-gray-100 transition" aria-label="Remove company files filter">
                                <X className="text-black w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 h-full shrink-0 pl-1.5">
                <Menu.Root>
                    <Menu.Trigger className="text-black flex cursor-pointer items-center gap-1 h-full px-2 justify-center rounded-sm bg-white hover:bg-gray-50 border border-[#E2E2E2] font-medium text-sm data-popup-open:bg-gray-100 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                        <ListFilter className="w-4 h-4 text-black" />
                        {t("filerow.filterButton")}
                    </Menu.Trigger>

                    <Menu.Portal>
                        <Menu.Positioner side="bottom" align="start" sideOffset={8}>
                            <Menu.Popup className="base-ui-popup-animation rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5 w-[170px]">
                                <Menu.Viewport>
                                    <Menu.SubmenuRoot>
                                        <Menu.SubmenuTrigger className="data-popup-open:bg-gray-100 flex w-full justify-between cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black">
                                            <div className="flex items-center justify-center gap-1">
                                                {(() => {
                                                    const Icon = filterIconMap[filterOptions.type.trigger.icon];
                                                    return <Icon className="w-4 h-4" />;
                                                })()}
                                                {filterOptions.type.trigger.label}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-black" />
                                        </Menu.SubmenuTrigger>

                                        <Menu.Portal>
                                            <Menu.Positioner side="right" align="start" sideOffset={8}>
                                                <Menu.Popup className="base-ui-popup-animation rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5 w-[170px]">
                                                    <Menu.Viewport>
                                                        {filterOptions.type.items.map((item) => {
                                                            const isSelected = filters.typeIds.includes(item.interfaceSeq);

                                                            return (
                                                                <Menu.Item key={item.id} className={`flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 transition 
                                                                ${isSelected ? "bg-gray-100 text-black" : "hover:bg-gray-100 text-black/70 hover:text-black"}`} onClick={() => handleFilterClick({ group: "type", id: item.id })}>
                                                                    {item.label}
                                                                </Menu.Item>
                                                            );
                                                        })}
                                                    </Menu.Viewport>
                                                </Menu.Popup>
                                            </Menu.Positioner>
                                        </Menu.Portal>
                                    </Menu.SubmenuRoot>

                                    <Menu.SubmenuRoot>
                                        <Menu.SubmenuTrigger className="data-popup-open:bg-gray-100 flex w-full justify-between cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black">
                                            <div className="flex items-center justify-center gap-1">
                                                {(() => {
                                                    const Icon = filterIconMap[filterOptions.status.trigger.icon];
                                                    return <Icon className="w-4 h-4" />;
                                                })()}
                                                {filterOptions.status.trigger.label}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-black" />
                                        </Menu.SubmenuTrigger>

                                        <Menu.Portal>
                                            <Menu.Positioner side="right" align="start" sideOffset={8}>
                                                <Menu.Popup className="base-ui-popup-animation rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5 w-[170px]">
                                                    <Menu.Viewport>
                                                        {filterOptions.status.items.map((item) => {
                                                            const isSelected = filters.statusIds.includes(item.statusSeq);

                                                            return (
                                                                <Menu.Item key={item.id} className={`flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 transition
                                                                ${isSelected ? "bg-gray-100 text-black" : "hover:bg-gray-100 text-black/70 hover:text-black"}`} onClick={() => handleFilterClick({ group: "status", id: item.id })}>
                                                                    {item.label}
                                                                </Menu.Item>
                                                            )
                                                        })}
                                                    </Menu.Viewport>
                                                </Menu.Popup>
                                            </Menu.Positioner>
                                        </Menu.Portal>
                                    </Menu.SubmenuRoot>

                                    <Menu.Item key={filterOptions.companyFiles.id} className={`flex w-full justify-between cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black ${filters.companyFiles ? "bg-gray-100 text-black" : ""}`} onClick={() => handleFilterClick({ group: "company", id: filterOptions.companyFiles.id })}>
                                        <div className="flex items-center justify-center gap-1">
                                            {(() => {
                                                const Icon = filterIconMap[filterOptions.companyFiles.icon];
                                                return <Icon className="w-4 h-4" />;
                                            })()}
                                            {filterOptions.companyFiles.label}
                                        </div>
                                    </Menu.Item>
                                </Menu.Viewport>
                            </Menu.Popup>
                        </Menu.Positioner>
                    </Menu.Portal>
                </Menu.Root>

                <button className="cursor-pointer flex items-center gap-1 h-full px-2 justify-center rounded-sm bg-white hover:bg-gray-50 transition border border-[#E2E2E2] text-black font-medium text-sm">
                    <Settings2 className="w-4 h-4 text-black" />
                    {t("filerow.manageTemplatesButton")}
                </button>
            </div>
        </div>
    );
};

