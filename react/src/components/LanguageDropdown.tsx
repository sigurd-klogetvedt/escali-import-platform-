import { Menu } from "@base-ui/react/menu";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Flag, type FlagCode } from "./Flag";

const languages = [
    { code: "en", label: "English" },
    { code: "no", label: "Norsk" },
];

export const LanguageDropdown = () => {
    const { i18n } = useTranslation();

    const current = languages.find((l) => l.code === i18n.resolvedLanguage) ?? languages[0];

    return (
        <Menu.Root>
            <Menu.Trigger className="flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-1 h-9 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-popup-open:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                <Flag code={current.code as FlagCode} size={24} />
                <span>{current.label}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </Menu.Trigger>

            <Menu.Portal>
                <Menu.Positioner side="bottom" align="end" sideOffset={8}>
                    <Menu.Popup className="base-ui-popup-animation min-w-[140px] rounded-md border border-gray-200 bg-white p-1 shadow-lg outline-none gap-0.5">
                        {languages.map((lang) => (
                            <Menu.Item key={lang.code} onClick={() => i18n.changeLanguage(lang.code)} className={`flex w-full cursor-pointer items-center gap-2 rounded-sm  px-2 h-8 text-sm outline-none transition ${lang.code === current.code ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                                <Flag code={lang.code as FlagCode} size={24} />
                                {lang.label}
                            </Menu.Item>
                        ))}
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    )
};