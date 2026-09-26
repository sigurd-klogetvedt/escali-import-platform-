import { Check, ChevronDown, PlusIcon } from "lucide-react";
import { Select } from "@base-ui/react/select";
import { useTranslation } from "react-i18next";

const templateItems = [
    { value: "transactions", label: "Transactions" },
    { value: "collateral", label: "Collateral" },
    { value: "market-rates", label: "Market rates" },
    { value: "interest-data", label: "Interest data" },
    { value: "security-data", label: "Security data" },
    { value: "balances", label: "Balances" },
];

export const MappingHeader = () => {
    const { t } = useTranslation();

    return (
        <div className="mx-4 mt-4 mb-8 flex shrink-0 flex-col gap-6 items-start w-full">
            <div className="flex flex-col gap-2 items-start">
                <p className="font-medium text-lg text-black">{t("mappingPage.header")}</p>
                <p className="font-medium text-sm text-black/70">{t("mappingPage.subheader")}</p>
            </div>
            <div className="flex flex-col gap-4 items-start">
                <div className="flex flex-col gap-2 items-start">
                    <p className="font-medium text-base text-black">
                        {t("mappingPage.templateHeader")} <span className="text-black/70">{t("mappingPage.templateHeaderOptional")}</span>
                    </p>
                    <p className="font-medium text-sm text-black/70">
                        {t("mappingPage.templateSubheader")}
                    </p>
                </div>
                <div className="flex h-8 gap-4 items-center justify-start">
                    <Select.Root items={templateItems}>
                        <Select.Trigger className="flex h-8 w-[275px] items-center justify-between rounded border border-[#d9d9d9] bg-white px-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-popup-open:bg-gray-50">
                            <Select.Value
                                placeholder={t("mappingPage.templateUseButton")}
                                className="truncate font-medium text-left text-sm text-black/70"
                            />
                            <ChevronDown className="ml-2 h-4 w-4 text-black" />
                        </Select.Trigger>

                        <Select.Portal>
                            <Select.Backdrop />
                            <Select.Positioner side="bottom" align="start" sideOffset={6}>
                                <Select.Popup className="base-ui-popup-animation z-50 min-w-[275px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg outline-none">
                                    <Select.List className="max-h-64 overflow-y-auto py-0.5 text-sm text-gray-800">
                                        {templateItems.map((item) => (
                                            <Select.Item
                                                key={item.value ?? "placeholder"}
                                                value={item.value}
                                                className="flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-800 outline-none hover:bg-gray-100 data-highlighted:bg-gray-100 data-highlighted:text-gray-900"
                                            >
                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                <Select.ItemIndicator className="ml-2 text-gray-600">
                                                    <Check className="h-4 w-4 shrink-0" />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        ))}
                                    </Select.List>
                                </Select.Popup>
                            </Select.Positioner>
                        </Select.Portal>
                    </Select.Root>

                    <div className="flex h-5 items-center justify-center w-px shrink-0">
                        <div className="w-px h-5 bg-[#d9d9d9]" aria-hidden />
                    </div>
                    <button
                        type="button"
                        className="bg-white border border-[#d9d9d9] flex gap-2 h-8 items-center justify-center px-2 rounded shrink-0 font-medium text-sm text-black hover:bg-gray-50 transition"
                    >
                        <PlusIcon className="size-4 shrink-0" aria-hidden />
                        {t("mappingPage.templateCreateButton")}
                    </button>
                </div>
            </div>
        </div>
    );
};