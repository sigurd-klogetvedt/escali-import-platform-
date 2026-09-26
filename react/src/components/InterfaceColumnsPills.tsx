import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Asterisk, GripVertical, LayoutList } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { api } from "@/api/apiClient";
import { useTranslation } from "react-i18next";

const SKELETON_PILL_COUNT = 30;

type ColumnFieldDescription = {
    languageCode: "en" | "no" | string;
    value: string;
};

export type Column = {
    columnSeq: number;
    interfaceSeq: number;
    columnFieldName: string;
    columnType: "Text" | "Date" | "Float" | "Amount" | "YesNo" | "Int" | string;
    dataTypeSeq?: number;
    dataType?: string;
    columnRequired: boolean;
    columnNeedsApprovedValues?: boolean;
    columnRemarks: string;
    columnFieldDescriptions?: ColumnFieldDescription[];
};

type InterfaceColumnsPillsProps = {
    interfaceSeq: number;
    searchQuery?: string;
    sortBy?: "name" | "nameDesc" | null;
    requiredOnly?: boolean;
    dataTypeSeqFilters?: number[];
    partiallyRequiredOnly?: boolean;
    /** Columns currently placed in the mapping row; these are excluded from the pill list */
    droppedColumns?: Column[];
};

export function PillContent({ col, displayName }: { col: Column; displayName: string }) {
    return (
        <>
        <GripVertical className="size-4 shrink-0 text-black/50" aria-hidden />
        <span className="whitespace-nowrap">{displayName}</span>
        {col.columnRequired && <Asterisk className="size-4 shrink-0 text-red-600" aria-hidden />}
        </>
    );
}

export function DraggablePill({ col, displayName }: { col: Column; displayName: string }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: col.columnSeq,
        data: col,
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} className={`flex gap-2 h-8 items-center justify-center px-2 rounded bg-white border border-[#ebebeb] font-medium text-sm text-black shrink-0 transition-shadow ${isDragging ? "opacity-50 shadow-md" : "hover:cursor-grab active:cursor-grabbing"}`} data-node-id="251:350">
            <PillContent col={col} displayName={displayName} />
        </div>
    );
}

export const InterfaceColumnsPills: React.FC<InterfaceColumnsPillsProps> = ({
    interfaceSeq,
    searchQuery = "",
    sortBy = null,
    requiredOnly = false,
    dataTypeSeqFilters = [],
    partiallyRequiredOnly = false,
    droppedColumns: parentDroppedColumns = [],
}) => {
    const { i18n } = useTranslation();
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const fetchColumns = async() => {
            setLoading(true);
            setError(null);

            try {
                const res = await api.get(`/api/interfaces/${interfaceSeq}/columns`).json<Column[]>();
                if (!isCancelled) {
                    setColumns(res);
                }
            } catch (error) {
                if (!isCancelled) {
                    setError(error instanceof Error ? error.message : "Failed to fetch columns");
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchColumns();

        return () => {
            isCancelled = true;
        }
    }, [interfaceSeq]);

    const selectedLanguage = useMemo(() => {
        const lang = (i18n.resolvedLanguage ?? i18n.language ?? "en").toLowerCase();
        if (lang.startsWith("no")) return "no";
        return "en";
    }, [i18n.resolvedLanguage, i18n.language]);

    const getDisplayName = (col: Column) => {
        const descriptions = col.columnFieldDescriptions ?? [];
        const exact = descriptions.find((d) => d.languageCode?.toLowerCase() === selectedLanguage);
        const english = descriptions.find((d) => d.languageCode?.toLowerCase() === "en");
        return exact?.value || english?.value || col.columnFieldName;
    };

    const searched = columns.filter((col) =>
        getDisplayName(col).toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    const sorted = sortBy === "name" ? [...searched].sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b))) 
    : sortBy === "nameDesc" ? [...searched].sort((a, b) => getDisplayName(b).localeCompare(getDisplayName(a)))
    : searched;

    const requiredFiltered = requiredOnly ? sorted.filter((col) => col.columnRequired) : sorted;

    const dataTypeFiltered = dataTypeSeqFilters.length === 0
    ? requiredFiltered
    : requiredFiltered.filter((col) => col.dataTypeSeq != null && dataTypeSeqFilters.includes(col.dataTypeSeq));

    const partiallyRequiredFilter = partiallyRequiredOnly ? dataTypeFiltered.filter((col) => col.columnNeedsApprovedValues === true) : dataTypeFiltered;

    const availableColumns = partiallyRequiredFilter.filter(
        (col) => !parentDroppedColumns.some((d) => d.columnSeq === col.columnSeq)
    );

    if (loading) {
        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-wrap gap-4 w-full" data-node-id="251:519">
                    {Array.from({ length: SKELETON_PILL_COUNT }, (_, i) => (
                        <div key={i} className="h-8 rounded bg-gray-200 animate-pulse min-w-[80px]" style={{ width: 60 + (i % 5) * 24 }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50/50 px-6 py-8 text-center w-full">
                <p className="font-medium text-red-800">Couldn't load columns</p>
                <p className="text-sm text-red-600">{error}</p>
            </div>
        );
    }

    if (columns.length === 0 || availableColumns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center w-full">
                <LayoutList className="h-8 w-8 text-gray-400" aria-hidden />
                <p className="font-medium text-gray-700">No columns found</p>
                <p className="text-sm text-gray-500">There were no columns that matches your filter and search. Try adjusting the filters.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-4 w-full content-start">
                {availableColumns.map((col) => (
                    <DraggablePill key={col.columnSeq} col={col} displayName={getDisplayName(col)} />
                ))}
            </div>
        </div>
    );
};