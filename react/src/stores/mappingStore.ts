import type { Column } from "@/components/InterfaceColumnsPills";
import type { RowSelectionState } from "@tanstack/react-table";
import { create } from "zustand";

type SortBy = "name" | "nameDesc" | null;
type ManualValueOverrides = Record<string, Record<string, string>>;
type ColumnMappings = Record<string, Column | null>;

type MappingStore = {
    /* State */
    searchQuery: string;
    columnSearchQuery: string;
    sortBy: SortBy;
    requiredOnly: boolean;
    selectedDataTypeSeqs: number[];
    partiallyRequiredOnly: boolean;
    columnMappings: ColumnMappings;
    selectOpenForHeaderId: string | null;
    rowSelectionOverrides: RowSelectionState;
    hasCustomRowSelection: boolean;
    manualValueOverrides: ManualValueOverrides;

    /* Setters */
    setSearchQuery: (v: string) => void;
    setColumnSearchQuery: (v: string) => void;
    setSortBy: (next: SortBy | ((prev: SortBy) => SortBy)) => void;
    setRequiredOnly: (next: boolean | ((prev: boolean) => boolean)) => void;
    setSelectedDataTypeSeqs: (next: number[] | ((prev: number[]) => number[])) => void;
    setPartiallyRequiredOnly: (next: boolean | ((prev: boolean) => boolean)) => void;
    setColumnMappings: (next: ColumnMappings | ((prev: ColumnMappings) => ColumnMappings)) => void;
    setSelectOpenForHeaderId: (v: string | null) => void;
    setRowSelectionOverrides: (next: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => void;
    setHasCustomRowSelection: (v: boolean) => void;
    setManualValueOverrides: (
        next: ManualValueOverrides | ((prev: ManualValueOverrides) => ManualValueOverrides)
    ) => void;

    resetMappingUi: () => void;
};

const initialState = {
    searchQuery: "",
    columnSearchQuery: "",
    sortBy: null as SortBy,
    requiredOnly: false,
    selectedDataTypeSeqs: [] as number[],
    partiallyRequiredOnly: false,
    columnMappings: {} as ColumnMappings,
    selectOpenForHeaderId: null as string | null,
    rowSelectionOverrides: {} as RowSelectionState,
    hasCustomRowSelection: false,
    manualValueOverrides: {} as ManualValueOverrides,
};

export const useMappingStore = create<MappingStore>()((set) => ({
    ...initialState,

    setSearchQuery: (value) => set({ searchQuery: value }),
    setColumnSearchQuery: (value) => set({ columnSearchQuery: value }),
    setSortBy: (next) =>
        set((state) => ({
            sortBy: typeof next === "function" ? next(state.sortBy) : next,
        })),
    setRequiredOnly: (next) =>
        set((state) => ({
            requiredOnly:
                typeof next === "function" ? next(state.requiredOnly) : next,
        })),
    setSelectedDataTypeSeqs: (next) => 
        set((state) => ({
            selectedDataTypeSeqs:
            typeof next === "function" ? next(state.selectedDataTypeSeqs) : next,
        })),
    setPartiallyRequiredOnly: (next) => 
        set((state) => ({
            partiallyRequiredOnly:
            typeof next === "function" ? next(state.partiallyRequiredOnly) : next,
        })),
    setColumnMappings: (next) =>
        set((state) => ({
            columnMappings:
                typeof next === "function" ? next(state.columnMappings) : next,
        })),
    setSelectOpenForHeaderId: (value) => set({ selectOpenForHeaderId: value }),
    setRowSelectionOverrides: (next) =>
        set((state) => ({
            rowSelectionOverrides:
                typeof next === "function" ? next(state.rowSelectionOverrides) : next,
        })),
    setHasCustomRowSelection: (value) => set({ hasCustomRowSelection: value }),
    setManualValueOverrides: (next) =>
        set((state) => ({
            manualValueOverrides:
                typeof next === "function" ? next(state.manualValueOverrides) : next,
        })),
    resetMappingUi: () => set(initialState),

}));