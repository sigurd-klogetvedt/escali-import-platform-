import { createContext, useContext } from "react";
import type { RowSelectionState, Table } from "@tanstack/react-table";
import type { PreviewRowWithId } from "./tableUtils";

export type MappingPreviewTableContextValue = {
    table: Table<PreviewRowWithId>;
    /** Included so consumers re-render when selection changes (`table` instance is stable). */
    rowSelection: RowSelectionState;
};

export const MappingPreviewTableContext = createContext<MappingPreviewTableContextValue | null>(null);

export function useMappingPreviewTable() {
    return useContext(MappingPreviewTableContext);
}
