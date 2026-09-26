import { useCallback, useEffect, useRef, useState } from "react";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type { InvalidCellLookup } from "@/pages/MappingPage/utils/mappedColumnDataUtils";
import { ChevronDown, CircleHelp, RotateCcw } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { ApprovedColumnValuesPopover } from "@/components/popover";
import { Button } from "@base-ui/react/button";
import { Tooltip } from "@base-ui/react/tooltip";
import { useTranslation } from "react-i18next";
import { elementScroll, useVirtualizer, type VirtualizerOptions } from "@tanstack/react-virtual"

type TableProps<TData> = {
    table: TanstackTable<TData>;
    children?: React.ReactNode;
    mappingRow?: React.ReactNode;
    columnSearchBar?: React.ReactNode;
    highlightedColumnId?: string | null;
    invalidCellLookup?: InvalidCellLookup;
    invalidColumnSeqLookup?: Record<string, Record<string, number>>;
    changedCellLookup?: Record<string, Record<string, true>>;
    onSelectApprovedValue?: (rowId: string, columnId: string, value: string) => void;
    onRevertValue?: (rowId: string, columnId: string) => void;
    targetCellId?: string | null;
    showColumnHeaders?: boolean;
};

function columnBorderClass(isHighlighted: boolean, isFirstRow: boolean, isLastRow: boolean): string {
    if (!isHighlighted) return "border border-gray-200";
    const sides = [
        "border-l-2 border-r-2 border-blue-500",
        isFirstRow ? "border-t-2 border-blue-500" : "border-t border-gray-200",
        isLastRow ? "border-b-2 border-blue-500" : "border-b border-gray-200",
    ].join(" ");
    return sides;
}

const CELL_PADDING_PX = 24 + 4;

function getFixedColumnWidthStyle(size: number) {
    return {
        width: size,
        minWidth: size,
        maxWidth: size,
    };
}

export default function Table<TData>({
    table,
    children,
    mappingRow,
    columnSearchBar,
    highlightedColumnId,
    invalidCellLookup,
    invalidColumnSeqLookup,
    changedCellLookup,
    onSelectApprovedValue,
    onRevertValue,
    targetCellId,
    showColumnHeaders = true,
}: TableProps<TData>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const columnFirstCellRef = useRef<HTMLTableCellElement | null>(null);
    const prevHighlightedRef = useRef<string | null>(null);
    const smoothScrollNonceRef = useRef<number>(0);
    const autoFittedColumns = useRef<Set<string>>(new Set());
    const defaultColumnSizes = useRef<Map<string, number>>(new Map());

    const { t } = useTranslation();

    const rows = table.getRowModel().rows;
    const rowCount = rows.length;

    useEffect(() => {
        for (const col of table.getAllColumns()) {
            if (!defaultColumnSizes.current.has(col.id)) {
                defaultColumnSizes.current.set(col.id, col.getSize());
            }
        }
    }, [table]);

    useEffect(() => {
        if (highlightedColumnId == null) {
            prevHighlightedRef.current = null;
            return;
        }
        if (highlightedColumnId === prevHighlightedRef.current) return;
        prevHighlightedRef.current = highlightedColumnId;
        const el = columnFirstCellRef.current;
        if (el && scrollRef.current) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [highlightedColumnId]);

    const scrollToFn: VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>["scrollToFn"] = useCallback(
        (offset, options, instance) => {
            const element = scrollRef.current;
            if (!element) return;

            const startTop = element.scrollTop;
            const distance = Math.abs(offset - startTop);

            // Large virtual jumps are more reliable as immediate scrolls.
            if (distance > 2500) {
                elementScroll(offset, { ...options, behavior: "auto" }, instance);
                return;
            }

            const durationMs = Math.min(420, Math.max(180, distance * 0.08));
            const startTime = performance.now();
            const nonce = ++smoothScrollNonceRef.current;

            const easeInOutCubic = (t: number) =>
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const tick = (now: number) => {
                if (smoothScrollNonceRef.current !== nonce) return;
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / durationMs, 1);
                const eased = easeInOutCubic(progress);
                const interpolated = startTop + (offset - startTop) * eased;
                elementScroll(interpolated, options, instance);
                if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        },
        [],
    );

    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual manages its own memoization; safe to skip React Compiler memoization here.
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 36,
        getItemKey: (index) => rows[index]?.id ?? index,
        overscan: 12,
        scrollToFn,
    });
    const columnSizing = table.getState().columnSizing;

    useEffect(() => {
        rowVirtualizer.measure();
    }, [rowVirtualizer, columnSizing]);

    useEffect(() => {
        if (!targetCellId) return;

        const [targetRowId] = targetCellId.split("::");
        if (!targetRowId) return;

        const targetIndex = rows.findIndex((row) => row.id === targetRowId);
        if (targetIndex < 0) return;

        rowVirtualizer.scrollToIndex(targetIndex, { align: "center" });

        let attempts = 0;
        const maxAttempts = 8;
        const tryScrollCellIntoView = () => {
            const cell = tableRef.current?.querySelector<HTMLElement>(`[data-cell-id="${CSS.escape(targetCellId)}"]`);
            if (cell) {
                cell.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                return;
            }
            attempts += 1;
            if (attempts < maxAttempts) requestAnimationFrame(tryScrollCellIntoView);
        };

        requestAnimationFrame(tryScrollCellIntoView);
    }, [targetCellId, rows, rowVirtualizer]);

    const handleResizeDoubleClick = useCallback((columnId: string) => {
        if (autoFittedColumns.current.has(columnId)) {
            const defaultSize = defaultColumnSizes.current.get(columnId) ?? 150;
            table.setColumnSizing((prev) => ({ ...prev, [columnId]: defaultSize }));
            autoFittedColumns.current.delete(columnId);
            return;
        }

        const tableEl = tableRef.current;
        if (!tableEl) return;

        const cells = tableEl.querySelectorAll<HTMLElement>(`[data-column-id="${CSS.escape(columnId)}"]`);
        let maxWidth = 0;
        for (const cell of cells) {
            const child = cell.firstElementChild as HTMLElement | null;
            const contentWidth = child ? child.scrollWidth : cell.scrollWidth;
            maxWidth = Math.max(maxWidth, contentWidth);
        }

        if (maxWidth > 0) {
            const fitted = maxWidth + CELL_PADDING_PX;
            table.setColumnSizing((prev) => ({ ...prev, [columnId]: fitted }));
            autoFittedColumns.current.add(columnId);
        }
    }, [table]);

    const handleResizeHover = useCallback((columnId: string, enter: boolean) => {
        const el = tableRef.current;
        if (!el) return;
        const lines = el.querySelectorAll<HTMLElement>(
            `[data-resize-handle="${CSS.escape(columnId)}"]`
        );
        for (const line of lines) {
            line.classList.toggle("bg-blue-500", enter);
            line.classList.toggle("bg-transparent", !enter);
        }
    }, []);

    const resizeHandlerMap = new Map<string, (e: unknown) => void>();
    for (const hg of table.getHeaderGroups()) {
        for (const header of hg.headers) {
            resizeHandlerMap.set(header.column.id, header.getResizeHandler());
        }
    }

    const resizingColumnId = table.getAllColumns().find((c) => c.getIsResizing())?.id ?? null;

    const isSelectColumn = (columnId: string) => columnId === "_select";
    const [openCellKey, setOpenCellKey] = useState<string | null>(null);
    const invalidColumnIds = new Set(
        Object.values(invalidCellLookup ?? {}).flatMap((columns) => Object.keys(columns)),
    );
    const stickyHeaderTopClass = mappingRow ? "top-12" : "top-0";

    const virtualItems = rowVirtualizer.getVirtualItems();
    const paddingTop = virtualItems.length > 0 ? virtualItems[0]!.start : 0;
    const paddingBottom = virtualItems.length > 0
        ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1]!.end
        : 0;
    const visibleColumnCount = table.getVisibleLeafColumns().length;

    return (
        <div className="w-full h-full min-h-0 flex flex-col bg-white">
            {columnSearchBar && (
                <div className="shrink-0 sticky top-0 bg-white">
                    {columnSearchBar}
                </div>
            )}
            {children}
            <div ref={scrollRef} className="w-full flex-1 min-h-0 overflow-x-auto overflow-y-auto pb-0.5">
                <table
                    ref={tableRef}
                    className="table-fixed border-spacing-0"
                    style={{ width: table.getCenterTotalSize() }}
                >
                    <colgroup>
                        {table.getAllColumns().map((col) => {
                            const size = col.getSize();
                            return <col key={col.id} style={getFixedColumnWidthStyle(size)} />;
                        })}
                    </colgroup>
                    <thead>
                        {mappingRow}
                        {showColumnHeaders
                            ? table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => {
                                        const isHighlighted = highlightedColumnId != null && header.column.id === highlightedColumnId;
                                        const isResizing = header.column.id === resizingColumnId;
                                        const selectCol = isSelectColumn(header.column.id);
                                        const canResize = header.column.getCanResize();
                                        const cellPad = selectCol ? "px-1.5" : "px-3";
                                        const isColumnInvalid = invalidColumnIds.has(header.column.id);
                                        return (
                                            <th
                                                key={header.id}
                                                ref={isHighlighted ? (el) => { columnFirstCellRef.current = el; } : undefined}
                                                data-column-id={header.column.id}
                                                className={`sticky ${stickyHeaderTopClass} z-20 h-9 ${isColumnInvalid ? "bg-red-100" : "bg-white"} ${cellPad} text-start text-sm font-medium text-black/70 whitespace-nowrap ${columnBorderClass(isHighlighted, false, false)}`}
                                                style={getFixedColumnWidthStyle(header.getSize())}
                                            >
                                                {isColumnInvalid ? (
                                                    <Tooltip.Provider>
                                                        <Tooltip.Root>
                                                            <Tooltip.Trigger
                                                                render={(props) => (
                                                                    <span
                                                                        {...props}
                                                                        className="absolute inset-0 z-10 block cursor-help"
                                                                    />
                                                                )}
                                                            >
                                                                <span className="flex w-full items-center justify-between gap-2 p-2">
                                                                    <span className="truncate">
                                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                                    </span>
                                                                    <CircleHelp className="h-4 w-4 shrink-0 text-black/70" />
                                                                </span>
                                                            </Tooltip.Trigger>
                                                            <Tooltip.Portal>
                                                                <Tooltip.Positioner side="top" sideOffset={8} className="z-3000">
                                                                    <Tooltip.Popup className="base-ui-tooltip-animation rounded-md border border-gray-200 bg-gray-900 px-3 py-2 text-sm text-white shadow-lg outline-none">
                                                                        {t("mappingPage.tooltipInvalidValues")}
                                                                    </Tooltip.Popup>
                                                                </Tooltip.Positioner>
                                                            </Tooltip.Portal>
                                                        </Tooltip.Root>
                                                    </Tooltip.Provider>
                                                ) : (
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                )}

                                                {canResize ? (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        onDoubleClick={() => handleResizeDoubleClick(header.column.id)}
                                                        onMouseEnter={() => handleResizeHover(header.column.id, true)}
                                                        onMouseLeave={() => handleResizeHover(header.column.id, false)}
                                                        className="absolute right-0 z-30 w-2 cursor-col-resize select-none touch-none"
                                                        style={{ transform: "translateX(50%)", top: -1, height: "calc(100% + 2px)" }}
                                                    >
                                                        <div
                                                            data-resize-handle={header.column.id}
                                                            className={`pointer-events-none absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 transition-colors ${isResizing ? "bg-blue-500" : "bg-transparent"
                                                                }`}
                                                        />
                                                    </div>
                                                ) : null}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))
                            : null}
                    </thead>
                    <tbody>
                        {paddingTop > 0 ? (
                            <tr>
                                <td colSpan={visibleColumnCount} style={{ height: `${paddingTop}px` }} />
                            </tr>
                        ) : null}
                        {virtualItems.length > 0
                            ? (
                                virtualItems.map((virtualRow) => {
                                    const row = rows[virtualRow.index];
                                    if (!row) return null;
                                    const isLastRow = virtualRow.index === rowCount - 1;
                                    return (
                                        <tr
                                            key={row.id}
                                            data-index={virtualRow.index}
                                            ref={(node) => rowVirtualizer.measureElement(node)}
                                            className="h-9"
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                const isHighlighted = highlightedColumnId != null && cell.column.id === highlightedColumnId;
                                                const isRowDeselected = !row.getIsSelected();
                                                const isResizing = cell.column.id === resizingColumnId;
                                                const resizeHandler = resizeHandlerMap.get(cell.column.id);
                                                const selectCol = isSelectColumn(cell.column.id);
                                                const canResize = cell.column.getCanResize();
                                                const cellPad = selectCol ? "px-1.5" : "px-3";
                                                const isInvalid = invalidCellLookup?.[row.id]?.[cell.column.id] === true;
                                                const invalidColumnSeq = invalidColumnSeqLookup?.[row.id]?.[cell.column.id];
                                                const isChanged = changedCellLookup?.[row.id]?.[cell.column.id] === true;
                                                const cellKey = `${row.id}::${cell.column.id}`;
                                                const isOpen = openCellKey === cellKey;
                                                const shouldAnchorHighlightedColumn = !showColumnHeaders && isHighlighted && virtualRow.index === 0;
                                                return (
                                                    <td
                                                        key={cell.id}
                                                        ref={shouldAnchorHighlightedColumn ? (el) => { columnFirstCellRef.current = el; } : undefined}
                                                        data-column-id={cell.column.id}
                                                        data-cell-id={cellKey}
                                                        className={`relative min-h-9 align-top ${cellPad} text-sm text-start ${isInvalid ? "bg-red-100 text-black" : isRowDeselected ? "bg-gray-100 text-black" : "text-black"} ${columnBorderClass(isHighlighted, false, isLastRow)}`}
                                                        style={getFixedColumnWidthStyle(cell.column.getSize())}
                                                    >
                                                        <div className={selectCol ? "" : "pr-10"}>
                                                            <div className="whitespace-normal wrap-break-word leading-5">
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </div>
                                                        </div>
                                                        {isChanged ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => onRevertValue?.(row.id, cell.column.id)}
                                                                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-sm p-0.5 text-black/70 hover:bg-black/10"
                                                                aria-label="Revert value"
                                                            >
                                                                <RotateCcw className="h-4 w-4" />
                                                            </button>
                                                        ) : null}
                                                        {isInvalid && invalidColumnSeq ? (
                                                            <Popover.Root
                                                                open={isOpen}
                                                                onOpenChange={(open) => setOpenCellKey(open ? cellKey : null)}
                                                            >
                                                                <Popover.Trigger
                                                                    render={<Button />}
                                                                    className="absolute inset-0 z-0 h-full w-full cursor-pointer rounded-sm p-0"
                                                                    aria-label="Select approved value"
                                                                />
                                                                <span className="pointer-events-none absolute right-3 top-1/2 z-0 -translate-y-1/2 text-black/70">
                                                                    <ChevronDown className="h-4 w-4" />
                                                                </span>
                                                                <ApprovedColumnValuesPopover
                                                                    InterfaceSeq={invalidColumnSeq}
                                                                    onSelectValue={(value) => {
                                                                        onSelectApprovedValue?.(row.id, cell.column.id, value);
                                                                        setOpenCellKey(null);
                                                                    }}
                                                                    onRequestClose={() => setOpenCellKey(null)}
                                                                />
                                                            </Popover.Root>
                                                        ) : null}
                                                        {canResize ? (
                                                            <div
                                                                onMouseDown={resizeHandler}
                                                                onTouchStart={resizeHandler}
                                                                onDoubleClick={() => handleResizeDoubleClick(cell.column.id)}
                                                                onMouseEnter={() => handleResizeHover(cell.column.id, true)}
                                                                onMouseLeave={() => handleResizeHover(cell.column.id, false)}
                                                                className="absolute right-0 z-10 w-2 cursor-col-resize select-none touch-none"
                                                                style={{ transform: "translateX(50%)", top: -1, height: "calc(100% + 2px)" }}
                                                            >
                                                                <div
                                                                    data-resize-handle={cell.column.id}
                                                                    className={`pointer-events-none absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 transition-colors ${isResizing ? "bg-blue-500" : "bg-transparent"}`}
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            )
                            : null}
                        {paddingBottom > 0 ? (
                            <tr>
                                <td colSpan={visibleColumnCount} style={{ height: `${paddingBottom}px` }} />
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}