import type { Dispatch, SetStateAction } from "react";
import type { Column } from "../components/InterfaceColumnsPills";
import * as React from "react";
import { PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { MAPPING_CELL_PREFIX } from "../components/table";

export function useMappingDragAndDrop(
    setColumnMappings: Dispatch<SetStateAction<Record<string, Column | null>>>,
) {
    const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

    const handleDragStart = React.useCallback((event: DragStartEvent) => {
        const col = event.active.data.current as Column | undefined;
        if (col) setActiveColumn(col);
    }, []);

    const handleDragEnd = React.useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveColumn(null);
        if (over && typeof over.id === "string" && over.id.startsWith(MAPPING_CELL_PREFIX) && active.data.current) {
            const headerId = over.id.slice(MAPPING_CELL_PREFIX.length);
            const col = active.data.current as Column;
            setColumnMappings((prev) => ({ ...prev, [headerId]: col }));
        }
    }, [setColumnMappings]);
    
    return { sensors, handleDragStart, handleDragEnd, activeColumn };
}