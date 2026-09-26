import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react"

interface CheckboxGroupProps {
    value: string[];
    onValueChange: (value: string[]) => void;
    allValues?: string[];
    chilren: React.ReactNode;
    className?: string;
}
export default function CheckboxGroup({ ...props }: CheckboxGroupProps) {

    return (
        <BaseCheckboxGroup 
            className={props.className}
            value={props.value}
            allValues={props.allValues}
            onValueChange={props.onValueChange} 
        >
            {props.chilren}
        </BaseCheckboxGroup>
    )
}