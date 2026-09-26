import { DragOverlay } from "@dnd-kit/core";
import { PillContent, type Column } from "@/components/InterfaceColumnsPills";

type MappingDragOverlayContentProps = {
    activeColumn: Column | null;
};

export function MappingDragOverlayContent({ activeColumn }: MappingDragOverlayContentProps) {
    return (
        <DragOverlay dropAnimation={null}>
            {activeColumn ? (
                <div className="flex gap-2 h-8 items-center justify-center px-2 rounded bg-white border border-[#ebebeb] font-medium text-sm text-black shrink-0 shadow-lg cursor-grabbing">
                    <PillContent
                        col={activeColumn}
                        displayName={
                            activeColumn.columnFieldDescriptions?.find((d) => d.languageCode === "no")?.value
                            ?? activeColumn.columnFieldDescriptions?.find((d) => d.languageCode === "en")?.value
                            ?? activeColumn.columnFieldName
                        }
                    />
                </div>
            ) : null}
        </DragOverlay>
    );
}
