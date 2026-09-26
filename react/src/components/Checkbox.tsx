import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon } from "@phosphor-icons/react";
import { Minus } from "lucide-react";
interface CheckboxProps {
    label?: string;
    value?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    defaultChecked?: boolean;
    indeterminate?: boolean;
    parent?: boolean;
    disabled?: boolean;
}
export function Checkbox({
    label,
    value,
    checked,
    onCheckedChange,
    defaultChecked = true,
    indeterminate,
    parent,
    disabled,
}:  CheckboxProps) {
    return (
        <label className="flex gap-2 items-center group cursor-pointer">
            <BaseCheckbox.Root 
                value={value}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                indeterminate={indeterminate}
                parent={parent}
                {...(checked === undefined ? { defaultChecked } : {})}
                className="flex size-5 rounded-sm border border-neutral-200 bg-white text-neutral-600 items-center justify-center group-hover:bg-neutral-100 transition-all data-disabled:opacity-50 data-disabled:cursor-not-allowed">
                <BaseCheckbox.Indicator className="flex text-black items-center justify-center">
                    {indeterminate ? (
                        <Minus className="size-3 shrink-0 stroke-[2.5]" aria-hidden />
                    ) : (
                        <CheckIcon weight="bold" size={12} />
                    )}
                </BaseCheckbox.Indicator>
            </BaseCheckbox.Root>
            {label ? <span className="text-sm text-neutral-950">{label}</span> : null}
        </label>
    )
}