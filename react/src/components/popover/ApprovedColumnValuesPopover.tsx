import { useMemo, useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { Tabs } from "@base-ui/react/tabs";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api } from "@/api/apiClient";

type ApprovedColumnValuesPopoverProps = {
    InterfaceSeq: number;
    onSelectValue?: (value: string) => void;
    onRequestClose?: () => void;
};

type ApprovedColumnValuesResponse = {
    columnSeq: number;
    byLanguage: {
        languageCode: string;
        values: string[];
    }[];
};

const LANGUAGE_LABELS: Record<string, string> = {
    en: "English",
    no: "Norsk",
};

export default function ApprovedColumnValuesPopover({
    InterfaceSeq,
    onSelectValue,
    onRequestClose,
}: ApprovedColumnValuesPopoverProps) {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const { t } = useTranslation();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["approved-column-values", InterfaceSeq],
        queryFn: async () => {
            return await api.get(
                `/api/approvedcolumnvalues/column/${InterfaceSeq}`,
            ).json<ApprovedColumnValuesResponse>();
        },
        enabled: InterfaceSeq > 0,
    });

    const languages = useMemo(() => data?.byLanguage ?? [], [data]);
    const resolvedActiveTab = activeTab ?? (languages.length > 0 ? languages[0].languageCode : null);

    const activeValues = useMemo(() => {
        if (!resolvedActiveTab) return [];
        const current = languages.find((l) => l.languageCode === resolvedActiveTab);
        return current?.values ?? [];
    }, [languages, resolvedActiveTab]);

    const filteredValues = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return activeValues;
        return activeValues.filter((value) => value.toLowerCase().includes(q));
    }, [activeValues, search]);

    return (
            <Popover.Portal>
                <Popover.Positioner sideOffset={8} className="z-3000">
                    <Popover.Popup className="base-ui-popup-animation z-3000 w-[250px] rounded-md border border-neutral-200 bg-white p-1 shadow-lg">
                        <div className="mb-1 flex h-8 items-center gap-1 rounded-sm px-2">
                            <Search className="size-4 text-black/70" />
                            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("common.search")} className="min-w-0 flex-1 bg-transparent text-sm outline-none text-black/70 font-medium" aria-label={t("popover.searchAriaLabel")} />
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-6 text-sm text-black/60">
                                {t("common.loading")}
                            </div>
                        ) : isError ? (
                            <div className="flex items-center justify-center py-6 text-sm text-red-600">
                                {t("popover.loadFailed")}
                            </div>
                        ) : languages.length === 0 ? (
                            <div className="flex items-center justify-center py-6 text-sm text-black/60">
                                {t("popover.loadNoContent")}
                            </div>
                        ) : (
                            <Tabs.Root value={resolvedActiveTab ?? undefined} onValueChange={(value) => setActiveTab(value)}>
                                <Tabs.List className="rounded-md w-full mb-2 items-center justify-center flex p-0.5 bg-neutral-100">
                                    {languages.map((lang) => (
                                        <Tabs.Tab key={lang.languageCode} value={lang.languageCode} className="flex-1 rounded-sm px-2 py-1 text-sm font-medium data-active:bg-white data-active:text-black data-active:border data-active:border-neutral-200">
                                            {LANGUAGE_LABELS[lang.languageCode] ?? lang.languageCode.toUpperCase()}
                                        </Tabs.Tab>
                                    ))}
                                </Tabs.List>

                                {languages.map((lang) => (
                                    <Tabs.Panel key={lang.languageCode} value={lang.languageCode} className="border-t border-neutral-100">
                                        <ValuesList values={filteredValues} onSelect={(value) => {
                                            onSelectValue?.(value);
                                            onRequestClose?.();
                                        }} />
                                    </Tabs.Panel>
                                ))}
                            </Tabs.Root>
                        )}
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
    )
}

function ValuesList({ values, onSelect, }: { values: string[]; onSelect: (value: string) => void; }) {
    const { t } = useTranslation();

    if (values.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <p className="py-2 text-sm text-black/60">{t("popover.loadNoContent")}</p>
            </div>
        );
    }

    return (
        <ul className="max-h-56 space-y-1 overflow-auto pt-1">
            {values.map((value) => (
                <li key={value}>
                    <button type="button" onClick={() => onSelect(value)} className="w-full cursor-pointer rounded-sm p-2 text-left text-sm font-medium hover:bg-neutral-100">
                        {value}
                    </button>
                </li>
            ))}
        </ul>
    );
}