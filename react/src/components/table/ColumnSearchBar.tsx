import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ColumnSearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

export function ColumnSearchBar({
    value,
    onChange,
    onKeyDown,
}: ColumnSearchBarProps) {
    const { t } = useTranslation();

    return (
        <div className="flex h-9 w-full shrink-0 items-center gap-2 border border-[#dfdfdf] bg-white px-3">
            <Search className="size-4 shrink-0 text-black/70" aria-hidden />
            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t("mappingPage.searchColumn")}
                className="min-w-0 flex-1 bg-transparent font-medium text-sm text-black placeholder:text-black/70 outline-none"
                aria-label={t("mappingPage.searchColumn")}
            />
        </div>
    );
}
