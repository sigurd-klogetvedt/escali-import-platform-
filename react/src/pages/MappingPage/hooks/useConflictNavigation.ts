import { useCallback, useMemo, useState } from "react";
import { useMappingStore } from "@/stores/mappingStore";
import {
    buildConflicts,
    type Conflict,
} from "@/pages/MappingPage/utils/mappingLookupBuilders";
import type { InvalidCellLookup } from "@/pages/MappingPage/utils/mappedColumnDataUtils";

export function useConflictNavigation(params: {
    headers: string[];
    invalidCellLookup: InvalidCellLookup;
}) {
    const { headers, invalidCellLookup } = params;
    const columnMappings = useMappingStore((s) => s.columnMappings);

    const [storedConflictIndex, setStoredConflictIndex] = useState(1);
    const [storedTargetCellId, setStoredTargetCellId] = useState<string | null>(null);

    const conflicts = useMemo<Conflict[]>(
        () => buildConflicts({ headers, columnMappings, invalidCellLookup }),
        [headers, columnMappings, invalidCellLookup],
    );

    // Derive at render time so we don't need a setState-in-effect to clamp the
    // index or clear the target cell when the conflict list shrinks/empties.
    const currentConflictIndex = conflicts.length === 0
        ? 1
        : Math.min(Math.max(storedConflictIndex, 1), conflicts.length);

    const targetCellId = conflicts.length === 0 ? null : storedTargetCellId;

    const handleNextConflict = useCallback(() => {
        if (conflicts.length === 0) return;
        const currentConflict = conflicts[currentConflictIndex - 1];
        const currentConflictCellId = currentConflict
            ? `${currentConflict.rowId}::${currentConflict.columnId}`
            : null;
        if (currentConflictCellId && targetCellId !== currentConflictCellId) {
            setStoredTargetCellId(currentConflictCellId);
            return;
        }
        const nextIndex = Math.min(currentConflictIndex + 1, conflicts.length);
        const targetConflict = conflicts[nextIndex - 1];
        setStoredConflictIndex(nextIndex);
        setStoredTargetCellId(
            targetConflict ? `${targetConflict.rowId}::${targetConflict.columnId}` : null,
        );
    }, [conflicts, currentConflictIndex, targetCellId]);

    const handlePreviousConflict = useCallback(() => {
        if (conflicts.length === 0) return;
        const currentConflict = conflicts[currentConflictIndex - 1];
        const currentConflictCellId = currentConflict
            ? `${currentConflict.rowId}::${currentConflict.columnId}`
            : null;
        if (currentConflictCellId && targetCellId !== currentConflictCellId) {
            setStoredTargetCellId(currentConflictCellId);
            return;
        }
        const nextIndex = Math.max(currentConflictIndex - 1, 1);
        const targetConflict = conflicts[nextIndex - 1];
        setStoredConflictIndex(nextIndex);
        setStoredTargetCellId(
            targetConflict ? `${targetConflict.rowId}::${targetConflict.columnId}` : null,
        );
    }, [conflicts, currentConflictIndex, targetCellId]);

    return {
        conflicts,
        currentConflictIndex,
        targetCellId,
        handleNextConflict,
        handlePreviousConflict,
    };
}
