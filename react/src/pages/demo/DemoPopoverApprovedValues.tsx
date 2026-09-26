import { ApprovedColumnValuesPopover } from "@/components/popover";
import { Button } from "@base-ui/react/button";
import { Popover } from "@base-ui/react/popover";
import { useState } from "react";

export function DemoPopoverApprovedValues() {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    return (
        <main className="w-screen h-screen items-center justify-center flex bg-neutral-50 flex-col gap-8">
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger render={<Button />}>
                    Select approved value
                </Popover.Trigger>

                <ApprovedColumnValuesPopover InterfaceSeq={9} onSelectValue={(value) => {
                    setSelectedValue(value);
                    setOpen(false);
                }}
                onRequestClose={() => setOpen(false)} />
            </Popover.Root>

            <p className="text-sm font-medium text-black/70">
                {selectedValue ? `Selected value: ${selectedValue}`: "No value selected"}
            </p>
        </main>
    )
}