import { Menu } from "@base-ui/react/menu";
import { CaretRightIcon, CircleDashedIcon, FunnelSimpleIcon, SortAscendingIcon, SubtractSquareIcon } from "@phosphor-icons/react";

const filterIconMap = {
    SortAscendingIcon,
    SubtractSquareIcon,
    CircleDashedIcon,
} as const;

type FilterIconName = keyof typeof filterIconMap;

type FilterLeafItem = {
    id: number | string;
    label: string;
};

type FilterOptionWithItems = {
    trigger: {
        id: string;
        label: string;
        icon: FilterIconName;
    };
    items: FilterLeafItem[];
};

type FilterOptionWithoutItems = {
    id: string;
    label: string;
    icon: FilterIconName;
};

export type FilterOption = FilterOptionWithItems | FilterOptionWithoutItems;

type FilterMenuProps = {
    triggerLabel: string;
    options: FilterOption[];
    onLeafItemClick?: (optionId: string, itemId?: number | string) => void;
    isSelected?: (optionId: string, itemId?: number | string) => boolean;
};

function hasItems(option: FilterOption): option is FilterOptionWithItems {
    return "items" in option;
}

export function FilterMenu({ triggerLabel, options, onLeafItemClick, isSelected }: FilterMenuProps) {
    return (
        <Menu.Root>
            <Menu.Trigger className="text-black flex cursor-pointer items-center gap-1 h-8 px-2 justify-center rounded-sm bg-white hover:bg-gray-50 border border-[#E2E2E2] font-medium text-sm data-popup-open:bg-gray-100 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
                <FunnelSimpleIcon className="size-4 text-black" aria-hidden />
                {triggerLabel}
            </Menu.Trigger>

            <Menu.Portal>
                <Menu.Positioner side="bottom" align="start" sideOffset={8} className="z-4000">
                    <Menu.Popup className="base-ui-popup-animation rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5 w-[170px]">
                        <Menu.Viewport>
                            {options.map((option) => {
                                if (hasItems(option)) {
                                    const Icon = filterIconMap[option.trigger.icon];

                                    return (
                                        <Menu.SubmenuRoot key={option.trigger.id}>
                                            <Menu.SubmenuTrigger className="data-popup-open:bg-gray-100 flex w-full justify-between cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Icon className="size-4" />
                                                    {option.trigger.label}
                                                </div>
                                                <CaretRightIcon className="size-4 text-black" />
                                            </Menu.SubmenuTrigger>

                                            <Menu.Portal>
                                                <Menu.Positioner side="right" align="start" sideOffset={8} className="z-4000">
                                                    <Menu.Popup className="base-ui-popup-animation rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5 w-[170px]">
                                                        <Menu.Viewport>
                                                            {option.items.map((item) => {
                                                                const selected = isSelected?.(option.trigger.id, item.id) ?? false;

                                                                return (
                                                                    <Menu.Item key={item.id} onClick={() => onLeafItemClick?.(option.trigger.id, item.id)} className={`flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 transition hover:bg-gray-100 ${selected ? "bg-gray-100 text-black" : "hover:bg-gray-100 text-black/70 hover:text-black"}`}>
                                                                        {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                                                                    </Menu.Item>
                                                                );
                                                            })}
                                                        </Menu.Viewport>
                                                    </Menu.Popup>
                                                </Menu.Positioner>
                                            </Menu.Portal>
                                        </Menu.SubmenuRoot>
                                    );
                                }

                                const Icon = filterIconMap[option.icon];

                                const selected = isSelected?.(option.id) ?? false;

                                return (
                                    <Menu.Item key={option.id} onClick={() => onLeafItemClick?.(option.id)} className={`flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 text-black/70 transition hover:bg-gray-100 hover:text-black ${selected ? "bg-gray-100 text-black" : "hover:bg-gray-100 text-black/70 hover:text-black"}`}>
                                        <Icon className="size-4" />
                                        {option.label}
                                    </Menu.Item>
                                )
                            })}
                        </Menu.Viewport>
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    )
}