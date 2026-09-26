import { useDroppable } from "@dnd-kit/core";
import { Check, ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Select } from "@base-ui/react/select";
import { Checkbox } from "@/components/Checkbox";
import { useMappingPreviewTable } from "./MappingPreviewTableContext";
import { ROW_CHECKBOX_COLUMN_PX } from "./RowSelectionColumn";

/** Used as droppable id prefix; parent can match in onDragEnd to apply mapping. */
export const MAPPING_CELL_PREFIX = "mapping-cell:";

type MappingCellProps<T> = {
    headerId: string;
    mapping: T | null;
    onRemove: () => void;
    renderMappedContent: (mapping: T) => React.ReactNode;
    isColumnHighlighted?: boolean;
    /** For column mapping: options to show in the select when cell is interacted */
    availableOptions?: { value: string; label: string; data: T }[];
    selectOpen?: boolean;
    onCloseSelect?: () => void;
    onSelectOption?: (headerId: string, option: T) => void;
    onInteractWithCell?: (headerId: string) => void;
};

function MappingCell<T>({
    headerId,
    mapping,
    onRemove,
    renderMappedContent,
    isColumnHighlighted,
    availableOptions,
    selectOpen,
    onCloseSelect,
    onSelectOption,
    onInteractWithCell,
}: MappingCellProps<T>) {
    const droppableId = MAPPING_CELL_PREFIX + headerId;
    const { isOver, setNodeRef } = useDroppable({ id: droppableId });
    const { t } = useTranslation();

    const isHighlighted = isColumnHighlighted || isOver;
    const cellClass = isHighlighted ? "bg-blue-100 ring-2 ring-blue-500 ring-inset" : "";

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onInteractWithCell?.(headerId);
        }
    };

    const showSelect = selectOpen && (availableOptions?.length ?? 0) > 0 && !mapping;

    return (
        <th
            ref={setNodeRef}
            tabIndex={0}
            role="button"
            aria-label={mapping ? `Mapped: ${String(headerId)}` : `Add mapping for ${headerId}`}
            onKeyDown={handleKeyDown}
            className={`sticky top-0 z-20 h-12 border border-[#dfdfdf] bg-white px-3 align-middle whitespace-nowrap text-start ${cellClass}`}
        >
            <div className="flex h-8 min-h-8 w-full min-w-0 items-center justify-start">
                {mapping ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#193cb8] bg-[#dbeafe] px-3 py-1.5 font-medium text-sm text-[#193cb8] whitespace-nowrap text-start">
                        {renderMappedContent(mapping)}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            className="flex size-5 items-center justify-center rounded-full text-[#193cb8] transition-colors hover:bg-[#193cb8]/20"
                            aria-label="Remove mapping"
                        >
                            <X className="size-3.5" />
                        </button>
                    </span>
                ) : showSelect ? (
                    <Select.Root
                        open={true}
                        onOpenChange={(open) => !open && onCloseSelect?.()}
                        value={null}
                        onValueChange={(value) => {
                            const option = availableOptions!.find((o) => o.value === value);
                            if (option) onSelectOption?.(headerId, option.data);
                        }}
                        items={availableOptions!}
                    >
                        <Select.Trigger className="flex h-8 w-full min-w-0 items-center justify-between rounded border border-[#d9d9d9] bg-white px-3 text-sm font-medium text-black outline-none focus-visible:ring-2 focus-visible:ring-blue-500 data-popup-open:bg-gray-50">
                            <Select.Value placeholder={t("mappingPage.addMapping")} className="truncate text-left text-sm font-medium text-black/70" />
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-black" aria-hidden />
                        </Select.Trigger>
                        <Select.Portal>
                            <Select.Backdrop />
                            <Select.Positioner side="bottom" align="start" sideOffset={6} className="z-3000">
                                <Select.Popup className="base-ui-popup-animation z-100 min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg outline-none font-medium">
                                    <Select.List className="max-h-64 overflow-y-auto py-0.5 text-sm text-gray-800">
                                        {availableOptions!.map((opt) => (
                                            <Select.Item
                                                key={opt.value}
                                                value={opt.value}
                                                className="flex cursor-pointer items-center justify-between gap-2 px-3 py-1.5 text-sm text-gray-800 outline-none hover:bg-gray-100 data-highlighted:bg-gray-100 data-highlighted:text-gray-900"
                                            >
                                                <Select.ItemText>{opt.label}</Select.ItemText>
                                                <Select.ItemIndicator className="ml-2 text-gray-600">
                                                    <Check className="h-4 w-4 shrink-0" />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        ))}
                                    </Select.List>
                                </Select.Popup>
                            </Select.Positioner>
                        </Select.Portal>
                    </Select.Root>
                ) : (
                    <span
                        className={`inline-flex h-8 items-center justify-start rounded border border-dashed px-3 font-medium text-sm text-black transition-colors whitespace-nowrap text-start ${isHighlighted ? "border-blue-500 bg-blue-100" : "border-[#b3b3b3] bg-[#f9fafb]"}`}
                    >
                        {t("mappingPage.addMapping")}
                    </span>
                )}
            </div>
        </th>
    );
}

export type MappingRowProps<T> = {
    headers: string[];
    columnMappings: Record<string, T | null>;
    onRemove: (headerId: string) => void;
    renderMappedContent: (mapping: T) => React.ReactNode;
    highlightedColumnId?: string | null;
    availableOptions?: { value: string; label: string; data: T }[];
    selectOpenForHeaderId?: string | null;
    onInteractWithCell?: (headerId: string) => void;
    onCloseSelect?: () => void;
    onSelectColumn?: (headerId: string, option: T) => void;
};

function MappingRowSelectAllHeaderCell() {
    const ctx = useMappingPreviewTable();
    if (!ctx) return null;
    const { table } = ctx;
    const selectableRows = table.getFilteredRowModel().flatRows.filter((row) => row.getCanSelect());
    const selectedCount = selectableRows.filter((row) => row.getIsSelected()).length;
    const allSelected = selectableRows.length > 0 && selectedCount === selectableRows.length;
    const someSelected = selectedCount > 0 && selectedCount < selectableRows.length;
    return (
        <th
            className="sticky top-0 z-20 h-12 border border-[#dfdfdf] bg-white px-1.5 align-middle"
            style={{
                width: ROW_CHECKBOX_COLUMN_PX,
                minWidth: ROW_CHECKBOX_COLUMN_PX,
                maxWidth: ROW_CHECKBOX_COLUMN_PX,
            }}
            aria-label="Select all rows"
        >
            <div className="flex h-full w-full items-center justify-center">
                <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
                />
            </div>
        </th>
    );
}

export function MappingRow<T>({
    headers,
    columnMappings,
    onRemove,
    renderMappedContent,
    highlightedColumnId,
    availableOptions,
    selectOpenForHeaderId,
    onInteractWithCell,
    onCloseSelect,
    onSelectColumn,
}: MappingRowProps<T>) {
    return (
        <tr>
            <MappingRowSelectAllHeaderCell />
            {headers.map((headerId) => (
                <MappingCell<T>
                    key={headerId}
                    headerId={headerId}
                    mapping={columnMappings[headerId] ?? null}
                    onRemove={() => onRemove(headerId)}
                    renderMappedContent={renderMappedContent}
                    isColumnHighlighted={highlightedColumnId != null && headerId === highlightedColumnId}
                    availableOptions={availableOptions}
                    selectOpen={selectOpenForHeaderId === headerId}
                    onCloseSelect={onCloseSelect}
                    onSelectOption={onSelectColumn}
                    onInteractWithCell={onInteractWithCell}
                />
            ))}
        </tr>
    );
}
