import { Select } from "@base-ui/react";
import { CircleDashedIcon, PlusIcon, SortAscendingIcon, SubtractSquareIcon, XIcon } from "@phosphor-icons/react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/Dialog";
import { useMappingStore } from "@/stores/mappingStore";
import { useTranslation } from "react-i18next";
import {
    useCreateMappingTemplateMutation,
    useDataTypesQuery,
    useMappingTemplatesQuery,
    useQueryErrorToast,
} from "@/hooks";
import { FilterMenu, type FilterOption } from "@/components/FilterMenu";
import type { Column } from "@/components/InterfaceColumnsPills";
import { api } from "@/api/apiClient";
import { notify } from "@/lib/notify";
import { useEffect, useMemo, useState } from "react";
import { buildColumnMappingsForCreateTemplate } from "@/pages/MappingPage/utils/mappingTemplatePayload";
import {
    mergeTemplateIntoColumnMappings,
    normalizeMappingTemplateDetail,
} from "@/pages/MappingPage/utils/applyMappingTemplate";
import { MAPPING_TEMPLATE_EMPTY_VALUE } from "@/pages/MappingPage/mappingConstants";

type ActiveFilterChip = {
    key: string;
    label: string;
    icon: "sort" | "dataType" | "required" | "partiallyRequired";
    onRemove: () => void;
};

type MappingToolbarProps = {
    interfaceSeq: number;
    fileHeaders: string[];
    interfaceColumns: Column[];
    interfaceColumnsLoading: boolean;
};

export function MappingToolbar({
    interfaceSeq,
    fileHeaders,
    interfaceColumns,
    interfaceColumnsLoading,
}: MappingToolbarProps) {
    const { t } = useTranslation();
    const searchQuery = useMappingStore((s) => s.searchQuery);
    const setSearchQuery = useMappingStore((s) => s.setSearchQuery);

    const sortBy = useMappingStore((s) => s.sortBy);
    const setSortBy = useMappingStore((s) => s.setSortBy);
    const requiredOnly = useMappingStore((s) => s.requiredOnly);
    const setRequiredOnly = useMappingStore((s) => s.setRequiredOnly);
    const selectedDataTypeSeqs = useMappingStore((s) => s.selectedDataTypeSeqs);
    const setSelectedDataTypeSeqs = useMappingStore((s) => s.setSelectedDataTypeSeqs);
    const partiallyRequiredOnly = useMappingStore((s) => s.partiallyRequiredOnly);
    const setPartiallyRequiredOnly = useMappingStore((s) => s.setPartiallyRequiredOnly);
    const columnMappings = useMappingStore((s) => s.columnMappings);
    const setColumnMappings = useMappingStore((s) => s.setColumnMappings);

    const [selectedTemplateSeq, setSelectedTemplateSeq] = useState<string | null>(null);
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

    useEffect(() => {
        setSelectedTemplateSeq(null);
    }, [interfaceSeq]);

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);

    const createTemplateMutation = useCreateMappingTemplateMutation();

    useEffect(() => {
        if (createDialogOpen) {
            setTemplateName("");
            setNameError(null);
        }
    }, [createDialogOpen]);

    const columnMappingRows = useMemo(() => buildColumnMappingsForCreateTemplate(columnMappings), [columnMappings]);
    const mappingCount = columnMappingRows.length;

    const handleDialogOpenChange = (open: boolean) => {
        if (createTemplateMutation.isPending) return;
        setCreateDialogOpen(open);
        if (!open) setNameError(null);
    };

    const handleOpenCreateTemplate = () => {
        if (interfaceSeq <= 0) {
            notify.warning(t("mappingPage.templateCreateNoMappingsTitle"), {
                description: t("mappingPage.templateCreateNoMappingsDescription"),
            });
            return;
        }
        if (columnMappingRows.length === 0) {
            notify.warning(t("mappingPage.templateCreateNoMappingsTitle"), {
                description: t("mappingPage.templateCreateNoMappingsDescription"),
            });
            return;
        }
        setCreateDialogOpen(true);
    };

    const handleSubmitCreateTemplate = () => {
        const trimmed = templateName.trim();
        if (!trimmed) {
            setNameError(t("mappingPage.templateCreateNameRequired"));
            return;
        }
        setNameError(null);
        createTemplateMutation.mutate(
            {
                templateName: trimmed,
                interfaceSeq,
                columnMapping: columnMappingRows,
            },
            {
                onSuccess: () => {
                    setCreateDialogOpen(false);
                },
            },
        );
    };

    const { data: dataTypes = [] } = useDataTypesQuery();

    const mappingTemplatesQuery = useMappingTemplatesQuery(interfaceSeq);
    useQueryErrorToast(mappingTemplatesQuery, t("toast.mapping.mappingTemplatesErrorTitle"), {
        id: `mapping-templates-${interfaceSeq}`,
        enabled: interfaceSeq > 0,
    });

    const templates = mappingTemplatesQuery.data ?? [];
    const selectItems = useMemo(
        () => templates.map((item) => ({ value: String(item.templateSeq), label: item.templateName })),
        [templates],
    );

    const selectItemsWithEmpty = useMemo(
        () => [{ value: MAPPING_TEMPLATE_EMPTY_VALUE, label: t("mappingPage.templateEmptyOption") }, ...selectItems],
        [t, selectItems],
    );

    useEffect(() => {
        if (selectedTemplateSeq == null) return;
        if (selectedTemplateSeq === MAPPING_TEMPLATE_EMPTY_VALUE) return;
        const exists = templates.some((x) => String(x.templateSeq) === selectedTemplateSeq);
        if (!exists) setSelectedTemplateSeq(null);
    }, [templates, selectedTemplateSeq]);

    const handleTemplateValueChange = async (nextValue: string | null) => {
        if (nextValue == null || nextValue === "") {
            setSelectedTemplateSeq(null);
            return;
        }

        if (nextValue === MAPPING_TEMPLATE_EMPTY_VALUE) {
            setColumnMappings({});
            setSelectedTemplateSeq(MAPPING_TEMPLATE_EMPTY_VALUE);
            return;
        }

        if (interfaceColumnsLoading) {
            notify.warning(t("mappingPage.templateApplyWaitColumns"));
            return;
        }
        if (interfaceColumns.length === 0) {
            notify.warning(t("mappingPage.templateApplyErrorTitle"), {
                description: t("mappingPage.templateApplyNothingDescription"),
            });
            return;
        }

        const templateSeq = Number.parseInt(nextValue, 10);
        if (!Number.isFinite(templateSeq)) return;

        setSelectedTemplateSeq(nextValue);
        setIsApplyingTemplate(true);
        try {
            const raw = await api.get(`/api/MappingTemplates/${templateSeq}`).json<unknown>();
            const template = normalizeMappingTemplateDetail(raw);

            if (template.interfaceSeq !== interfaceSeq) {
                setSelectedTemplateSeq(null);
                notify.warning(t("mappingPage.templateApplyErrorTitle"), {
                    description: t("mappingPage.templateApplyInterfaceMismatch"),
                });
                return;
            }

            const prev = useMappingStore.getState().columnMappings;
            const { nextMappings, applied } = mergeTemplateIntoColumnMappings(
                prev,
                template.columnMapping,
                fileHeaders,
                interfaceColumns,
            );

            if (applied === 0) {
                setSelectedTemplateSeq(null);
                notify.warning(t("mappingPage.templateApplyErrorTitle"), {
                    description: t("mappingPage.templateApplyNothingDescription"),
                });
                return;
            }

            setColumnMappings(nextMappings);
            notify.success(t("mappingPage.templateApplySuccessTitle"), {
                description: t("mappingPage.templateApplySuccessDescription", { applied }),
            });
        } catch {
            setSelectedTemplateSeq(null);
            notify.error(t("mappingPage.templateApplyErrorTitle"));
        } finally {
            setIsApplyingTemplate(false);
        }
    };

    const templateSelectIdle = interfaceSeq <= 0;
    const templateSelectPending = mappingTemplatesQuery.isPending;
    const templateSelectError = mappingTemplatesQuery.isError;
    const templateSelectReady = !templateSelectPending && !templateSelectError;
    const templateSelectEmpty = templateSelectReady && templates.length === 0;
    const templateSelectDisabled = templateSelectIdle || isApplyingTemplate;

    const filterOptions: FilterOption[] = [
        {
            trigger: {
                id: "sort",
                label: t("mappingFilter.sort.sort"),
                icon: "SortAscendingIcon",
            },
            items: [
                { id: 1, label: t("mappingFilter.sort.nameAsc") },
                { id: 2, label: t("mappingFilter.sort.nameDesc") },
                { id: "required", label: t("mappingFilter.sort.required") },
            ],
        },
        {
            trigger: {
                id: "dataType",
                label: t("mappingFilter.sort.dataType"),
                icon: "SubtractSquareIcon",
            },
            items: dataTypes.map((d) => ({
                id: d.DataTypeSeq,
                label: d.Type,
            })),
        },
        /*{
            id: "partiallyRequired",
            label: t("mappingFilter.sort.partially"),
            icon: "CircleDashedIcon",
        },*/
    ];

    const handleFilterClick = (optionId: string, itemId?: number | string) => {
        if (optionId === "sort") {
            if (itemId === 1) {
                setSortBy((prev) => (prev === "name" ? null : "name"));
            }

            if (itemId === 2) {
                setSortBy((prev) => (prev === "nameDesc" ? null : "nameDesc"));
            }

            if (itemId === "required") {
                setRequiredOnly((prev) => !prev);
            }
            return;
        }

        if (optionId === "dataType" && typeof itemId === "number") {
            setSelectedDataTypeSeqs((prev) =>
                prev.includes(itemId)
                    ? prev.filter((seq) => seq !== itemId)
                    : [...prev, itemId]
            );
            return;
        }

        if (optionId === "partiallyRequired") {
            setPartiallyRequiredOnly((prev) => !prev);
        }
    };

    const activeFilters = useMemo<ActiveFilterChip[]>(() => {
        const chips: ActiveFilterChip[] = [];

        if (sortBy === "name") {
            chips.push({
                key: "sort-name",
                label: t("mappingFilter.sort.nameAscShort"),
                icon: "sort",
                onRemove: () => setSortBy(null),
            });
        }

        if (sortBy === "nameDesc") {
            chips.push({
                key: "sort-name-desc",
                label: t("mappingFilter.sort.nameDescShort"),
                icon: "sort",
                onRemove: () => setSortBy(null),
            });
        }

        if (requiredOnly) {
            chips.push({
                key: "required-only",
                label: t("mappingFilter.sort.required"),
                icon: "required",
                onRemove: () => setRequiredOnly(false),
            });
        }

        const selectedDataTypes = dataTypes.filter((d) => selectedDataTypeSeqs.includes(d.DataTypeSeq));
        selectedDataTypes.forEach((selected) => {
                chips.push({
                    key: `datatype-${selected.DataTypeSeq}`,
                    label: selected.Type.charAt(0).toUpperCase() + selected.Type.slice(1),
                    icon: "dataType",
                    onRemove: () =>
                        setSelectedDataTypeSeqs((prev) =>
                            prev.filter((seq) => seq !== selected.DataTypeSeq)
                        ),
                });
        });

        if (partiallyRequiredOnly) {
            chips.push({
                key: "partially-required",
                label: t("mappingFilter.sort.partially"),
                icon: "partiallyRequired",
                onRemove: () => setPartiallyRequiredOnly(false),
            });
        }

        return chips;
    }, [
        t,
        sortBy,
        requiredOnly,
        selectedDataTypeSeqs,
        partiallyRequiredOnly,
        dataTypes,
        setSortBy,
        setRequiredOnly,
        setSelectedDataTypeSeqs,
        setPartiallyRequiredOnly,
    ]);

    const chipIcon = (icon: ActiveFilterChip["icon"]) => {
        if (icon === "sort") return <SortAscendingIcon className="size-4" />;
        if (icon === "dataType") return <SubtractSquareIcon className="size-4" />;
        if (icon === "partiallyRequired") return <CircleDashedIcon className="size-4" />;
        return <SortAscendingIcon className="size-4" />;
    };

    return (
        <>
        <div className="flex flex-col gap-4 items-start w-full pb-4 border-b border-dashed border-b-[#E0E0E0]">
            <div className="flex flex-col gap-4">
                <h2 className="font-medium text-base text-black leading-normal">
                    {t("mappingPage.notMapped")}
                </h2>
                <p className="font-medium text-black/70 text-sm leading-normal">
                    {t("mappingPage.templateSubheader")}
                </p>
            </div>
            <div className="flex gap-4 items-center w-full">
                <div className="flex flex-1 min-w-0 gap-4 items-center">
                    <input
                        type="text"
                        placeholder={t("mappingPage.searchTags")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="shrink-0 bg-white border border-[#d9d9d9] h-8 px-2 rounded w-full max-w-[363px] font-medium text-sm text-black placeholder:text-black/50 outline-none focus:border-black/30"
                    />

                    <div className="shrink-0 flex h-5 items-center justify-center w-px">
                        <div className="w-px h-5 bg-[#d9d9d9]" aria-hidden />
                    </div>

                    <div className="flex flex-1 min-w-0 items-center justify-start gap-2">
                        <div className="shrink-0">
                            <FilterMenu triggerLabel={t("filerow.filterButton")} options={filterOptions} onLeafItemClick={handleFilterClick} isSelected={(optionId, itemId) => {
                                if (optionId === "sort") {
                                    if (itemId === 1) return sortBy === "name";
                                    if (itemId === 2) return sortBy === "nameDesc";
                                    if (itemId === "required") return requiredOnly;
                                    return false;
                                }

                                if (optionId === "dataType" && typeof itemId === "number") {
                                    return selectedDataTypeSeqs.includes(itemId);
                                }

                                if (optionId === "partiallyRequired") {
                                    return partiallyRequiredOnly;
                                }

                                return false;
                            }} />
                        </div>
                        <div className="h-full flex-1 min-w-0 overflow-x-auto">
                            <div className="h-full flex items-center justify-start gap-2 px-2 w-max">
                                {activeFilters.map((filter) => (
                                    <div key={filter.key} className="flex items-center justify-center gap-2 px-3 py-3 rounded-full bg-white border border-neutral-200 h-8 shrink-0">
                                        <div className="flex items-center justify-center gap-1 text-sm text-black font-medium">
                                            {chipIcon(filter.icon)}
                                            {filter.label}
                                        </div>
                                        <button type="button" onClick={filter.onRemove} className="flex items-center justify-center rounded-full size-5 hover:bg-gray-100 transition" aria-label={`Remove ${filter.label} filter`}>
                                            <XIcon className="size-4 text-black" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>  
                </div>
                <div className="flex gap-4 items-center shrink-0">
                    <div className="flex h-8 gap-4 items-center justify-start">
                        <Select.Root
                            items={selectItemsWithEmpty}
                            disabled={templateSelectDisabled}
                            value={selectedTemplateSeq ?? undefined}
                            onValueChange={handleTemplateValueChange}
                        >
                            <Select.Trigger className="flex h-8 w-[275px] items-center justify-between rounded border border-[#d9d9d9] bg-white px-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-popup-open:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-black/40">
                                <Select.Value
                                    placeholder={
                                        templateSelectIdle
                                            ? t("mappingPage.templateUseButton")
                                            : templateSelectPending
                                              ? t("mappingPage.templatesLoading")
                                              : t("mappingPage.templateUseButton")
                                    }
                                    className="truncate font-medium text-left text-sm text-black/70"
                                />
                                {(templateSelectPending && !templateSelectIdle) || isApplyingTemplate ? (
                                    <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin text-black" aria-hidden />
                                ) : (
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-black" aria-hidden />
                                )}
                            </Select.Trigger>

                            <Select.Portal>
                                <Select.Backdrop />
                                <Select.Positioner side="bottom" align="start" sideOffset={6}>
                                    <Select.Popup className="z-50 min-w-[275px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg outline-none font-medium">
                                        <Select.List className="max-h-64 overflow-y-auto py-0.5 text-sm text-gray-800">
                                            {templateSelectIdle ? (
                                                <div className="px-3 py-2 text-sm text-gray-500" role="status">
                                                    {t("mappingPage.templateUseButton")}
                                                </div>
                                            ) : (
                                                <>
                                                    <Select.Item
                                                        key={MAPPING_TEMPLATE_EMPTY_VALUE}
                                                        value={MAPPING_TEMPLATE_EMPTY_VALUE}
                                                        className="flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-800 outline-none hover:bg-gray-100 data-highlighted:bg-gray-100 data-highlighted:text-gray-900"
                                                    >
                                                        <Select.ItemText>{t("mappingPage.templateEmptyOption")}</Select.ItemText>
                                                        <Select.ItemIndicator className="ml-2 text-gray-600">
                                                            <Check className="h-4 w-4 shrink-0" />
                                                        </Select.ItemIndicator>
                                                    </Select.Item>
                                                    {templateSelectPending ? (
                                                        <div
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600"
                                                            role="status"
                                                        >
                                                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                                                            {t("mappingPage.templatesLoading")}
                                                        </div>
                                                    ) : templateSelectError ? (
                                                        <div className="px-3 py-2 text-sm text-red-600" role="alert">
                                                            {t("mappingPage.templatesLoadError")}
                                                        </div>
                                                    ) : templateSelectEmpty ? (
                                                        <div className="px-3 py-2 text-sm text-gray-600" role="status">
                                                            {t("mappingPage.templatesEmpty")}
                                                        </div>
                                                    ) : (
                                                        selectItems.map((item) => (
                                                            <Select.Item
                                                                key={item.value}
                                                                value={item.value}
                                                                className="flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-800 outline-none hover:bg-gray-100 data-highlighted:bg-gray-100 data-highlighted:text-gray-900"
                                                            >
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator className="ml-2 text-gray-600">
                                                                    <Check className="h-4 w-4 shrink-0" />
                                                                </Select.ItemIndicator>
                                                            </Select.Item>
                                                        ))
                                                    )}
                                                </>
                                            )}
                                        </Select.List>
                                    </Select.Popup>
                                </Select.Positioner>
                            </Select.Portal>
                        </Select.Root>

                        <div className="flex h-5 items-center justify-center w-px shrink-0">
                            <div className="w-px h-5 bg-[#D9D9D9]" aria-hidden />
                        </div>
                        <button
                            type="button"
                            onClick={handleOpenCreateTemplate}
                            className="bg-white border border-[#D9D9D9] flex gap-2 h-8 items-center justify-center px-2 rounded shrink-0 font-medium text-sm text-black hover:bg-gray-50 transition"
                        >
                            <PlusIcon className="size-4 shrink-0" aria-hidden />
                            {t("mappingPage.templateCreateButton")}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="max-w-md space-y-4">
                <DialogHeader>
                    <DialogTitle>{t("mappingPage.templateCreateDialogTitle")}</DialogTitle>
                    <DialogDescription>
                        {t("mappingPage.templateCreateDialogDescription", { count: mappingCount })}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <label htmlFor="mapping-template-name" className="text-sm font-medium text-black">
                        {t("mappingPage.templateNameLabel")}
                    </label>
                    <input
                        id="mapping-template-name"
                        type="text"
                        value={templateName}
                        onChange={(e) => {
                            setTemplateName(e.target.value);
                            if (nameError) setNameError(null);
                        }}
                        placeholder={t("mappingPage.templateNamePlaceholder")}
                        disabled={createTemplateMutation.isPending}
                        className="h-9 w-full rounded border border-[#d9d9d9] bg-white px-3 text-sm text-black outline-none focus:border-black/30 disabled:bg-gray-50 disabled:text-black/40"
                        autoComplete="off"
                    />
                    {nameError ? (
                        <p className="text-sm text-red-600" role="alert">
                            {nameError}
                        </p>
                    ) : null}
                </div>
                <DialogFooter className="gap-2 pt-2">
                    <button
                        type="button"
                        onClick={() => handleDialogOpenChange(false)}
                        disabled={createTemplateMutation.isPending}
                        className="rounded border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-black hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t("mappingPage.cancelButton")}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitCreateTemplate}
                        disabled={createTemplateMutation.isPending}
                        className="inline-flex items-center justify-center gap-2 rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {createTemplateMutation.isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                                {t("mappingPage.templateCreateSaving")}
                            </>
                        ) : (
                            t("mappingPage.templateCreateSubmit")
                        )}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}