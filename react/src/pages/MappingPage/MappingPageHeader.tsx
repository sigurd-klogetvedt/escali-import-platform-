import type { TFunction } from "i18next";

type MappingPageHeaderProps = {
    interfaceName: string | undefined;
    t: TFunction;
}

export function MappingPageHeader({ interfaceName, t }: MappingPageHeaderProps) {
    return (
        <div className="px-4 flex flex-col gap-2 items-start pb-4">
            <p className="font-medium text-lg text-black">{t("mappingPage.header", { sheetType: t(`sheetTypes.${interfaceName}`)?.toLowerCase() })}</p>
            <p className="font-medium text-sm text-black/70">{t("mappingPage.subheader")}</p>
        </div>
    )
}