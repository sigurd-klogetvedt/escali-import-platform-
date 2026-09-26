import { useLocation, useNavigate } from "react-router-dom"
import type { MappedColumnData } from "../MappingPage/utils/mappedColumnDataUtils";
import type { PreviewRowWithId } from "@/components/table/tableUtils";
import { useCallback, useMemo, useState } from "react";
import { DataTable } from "@/components/table";
import { Button } from "@base-ui/react/button";
import { useTranslation } from "react-i18next";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { useMapUploadedFileMutation } from "@/hooks";

type ReviewRouteState = {
    mappedColumnData: MappedColumnData;
    fileSeq?: number;
    interfaceSeq?: number;
};

const EMPTY_MAPPED_COLUMN_DATA: MappedColumnData = {};

function mappedColumnDataToTableData(mappedColumnData: MappedColumnData): {
    headers: string[];
    rows: PreviewRowWithId[];
} {
    const headers = Object.keys(mappedColumnData);

    if (headers.length === 0) {
        return { headers: [], rows: [] };
    }

    const maxRowCount = Math.max(
        ...headers.map((header) => mappedColumnData[header]?.length ?? 0),
    );

    const rows: PreviewRowWithId[] = Array.from({ length: maxRowCount }, (_, rowIndex) => {
        const row: PreviewRowWithId = { _rowId: `review-row-${rowIndex}` };
        for (const header of headers) {
            row[header] = mappedColumnData[header]?.[rowIndex] ?? "";
        }
        return row;
    });

    return { headers, rows };
}

export function ReviewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const state = location.state as ReviewRouteState | null;
    const mappedColumnData = state?.mappedColumnData ?? EMPTY_MAPPED_COLUMN_DATA;
    const fileSeq = state?.fileSeq;
    const interfaceSeq = state?.interfaceSeq;
    
    const { headers, rows } = useMemo(
        () => mappedColumnDataToTableData(mappedColumnData),
        [mappedColumnData],
    );

    const hasMappedData = headers.length > 0 && rows.length > 0;
    const rowCount = rows.length;
    const columnCount = headers.length;

    const buildAllSelected = (rs: PreviewRowWithId[]): RowSelectionState =>
        rs.length === 0 ? {} : Object.fromEntries(rs.map((r) => [r._rowId, true]));

    const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => buildAllSelected(rows));
    const [prevRows, setPrevRows] = useState(rows);

    // Reset selection when the upstream `rows` reference changes. Using the
    // "adjusting state on prop change" pattern (set state during render) avoids
    // the cascading-render issue that an effect would cause here.
    if (prevRows !== rows) {
        setPrevRows(rows);
        setRowSelection(buildAllSelected(rows));
    }

    const handleRowSelectionChange = useCallback<OnChangeFn<RowSelectionState>>((updater) => {
        setRowSelection((prev) => (typeof updater === "function" ? updater(prev) : updater));
    }, []);

    const selectedRows = useMemo(
        () => rows.filter((r) => rowSelection[r._rowId]),
        [rows, rowSelection],
    );

    const filteredMappedColumnData = useMemo(() => {
        const next: MappedColumnData = {};
        for (const header of headers) {
            next[header] = selectedRows.map((row) => row[header] ?? "");
        }
        return next;
    }, [headers, selectedRows]);
    const hasSelectedMappedData = Object.values(filteredMappedColumnData).some((values) => values.length > 0);

    const mapMutation = useMapUploadedFileMutation();
    const canSubmit = hasMappedData && hasSelectedMappedData && typeof fileSeq === "number" && Number.isFinite(fileSeq) && typeof interfaceSeq === "number" && Number.isFinite(interfaceSeq) && interfaceSeq > 0 && !mapMutation.isPending;

    const handleMapClick = () => {
        if (!canSubmit || fileSeq == null || interfaceSeq == null) return;

        mapMutation.mutate(
            { fileSeq, interfaceSeq },
            {
                onSuccess: () => {
                    navigate("/");
                },
            },
        );
    };

    return (
        <div className="flex flex-1 flex-col min-h-0 min-w-0 bg-gray-50">
            <div className="px-4 flex flex-col gap-2">
                <p className="font-medium text-lg text-black">{t("reviewPage.header")}</p>
                <p className="font-medium text-sm text-black/70">{t("reviewPage.subheader")}</p>
            </div>

            <div className="px-4 py-4 flex-1 min-h-0 flex flex-col gap-4 min-w-0">
                {headers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center rounded-lg border border-gray-200 bg-white">
                        <p className="text-sm text-black/50">{t("reviewPage.noData")}</p>
                    </div>
                ) : (
                    <div className="flex-1 min-h-0">
                        <DataTable
                            data={rows}
                            headers={headers}
                            enableRowSelection
                            rowSelection={rowSelection}
                            onRowSelectionChange={handleRowSelectionChange}
                        />
                    </div>
                )}
            </div>

            <div className="w-full h-13 flex items-center gap-2 px-2.5 justify-between shrink-0">
                <p className="mx-2 px-3 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black font-medium text-sm">
                    {t("reviewPage.tableSummary", { count: rowCount, rows: rowCount, columns: columnCount})}
                </p>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(-1)} className="w-[176px] h-8 flex items-center justify-center gap-2 px-2 rounded-sm bg-white border border-neutral-200 font-medium text-sm text-black cursor-pointer hover:bg-neutral-50 transition">
                        {t("mappingPage.backButton")}
                    </Button>
                    <Button onClick={handleMapClick} disabled={!canSubmit} className="w-[176px] h-8 flex items-center justify-center gap-2 px-2 rounded-sm bg-[#1B1B1B] font-medium text-sm text-white cursor-pointer hover:bg-[#1B1B1B]/90 transition disabled:cursor-not-allowed disabled:bg-[#1B1B1B]/50">
                        {mapMutation.isPending ? t("reviewPage.mappingButton") : t("dashboard.mapButton")}
                    </Button>
                </div>
            </div>
        </div>
    )
}