import { useEffect, useMemo, useRef } from "react";
import { useQueries } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api } from "@/api/apiClient";
import { useMappingStore } from "@/stores/mappingStore";
import { notify } from "@/lib/notify";
import {
    approvedValueSetAllLanguages,
    type ApprovedColumnValuesResponse,
    type InvalidCellLookup,
} from "@/pages/MappingPage/utils/mappedColumnDataUtils";
import {
    buildInvalidCellLookup,
    buildInvalidColumnSeqLookup,
    getMappedColumnsRequiringApprovedValues,
} from "@/pages/MappingPage/utils/mappingLookupBuilders";
import type { PreviewRowWithId } from "@/components/table/tableUtils";

export function useApprovedValuesValidation(params: {
    headers: string[];
    effectiveTableData: PreviewRowWithId[];
    selectedRowIds: Set<string>;
    t: TFunction;
}) {
    const { headers, effectiveTableData, selectedRowIds, t } = params;
    const columnMappings = useMappingStore((s) => s.columnMappings);

    const mappedColumnsRequiringApprovedValues = useMemo(
        () => getMappedColumnsRequiringApprovedValues(columnMappings),
        [columnMappings],
    );

    const approvedValueQueries = useQueries({
        queries: mappedColumnsRequiringApprovedValues.map(({ columnSeq }) => ({
            queryKey: ["approved-column-values", columnSeq],
            queryFn: async () => {
                return api
                    .get(`/api/approvedcolumnvalues/column/${columnSeq}`)
                    .json<ApprovedColumnValuesResponse>();
            },
            enabled: columnSeq > 0,
        })),
    });

    // Track which columns we've already toasted about so we don't spam on every re-render.
    const toastedApprovedValueColumnsRef = useRef<Set<number>>(new Set());
    useEffect(() => {
        const activeColumnSeqs = new Set(
            mappedColumnsRequiringApprovedValues.map((m) => m.columnSeq),
        );
        for (const seq of toastedApprovedValueColumnsRef.current) {
            if (!activeColumnSeqs.has(seq)) {
                toastedApprovedValueColumnsRef.current.delete(seq);
            }
        }
        approvedValueQueries.forEach((query, index) => {
            const mapping = mappedColumnsRequiringApprovedValues[index];
            if (!mapping) return;
            if (!query.isError) return;
            if (toastedApprovedValueColumnsRef.current.has(mapping.columnSeq)) return;
            toastedApprovedValueColumnsRef.current.add(mapping.columnSeq);
            notify.error(t("toast.mapping.approvedValuesErrorTitle"), {
                id: `approved-values-${mapping.columnSeq}`,
                description: t("toast.mapping.approvedValuesErrorDescription", {
                    column: mapping.fileHeader,
                }),
            });
        });
    }, [approvedValueQueries, mappedColumnsRequiringApprovedValues, t]);

    const approvedValueSetsByColumnSeq = useMemo(() => {
        const out = new Map<number, Set<string>>();
        mappedColumnsRequiringApprovedValues.forEach(({ columnSeq }, i) => {
            out.set(columnSeq, approvedValueSetAllLanguages(approvedValueQueries[i]?.data));
        });
        return out;
    }, [mappedColumnsRequiringApprovedValues, approvedValueQueries]);

    const invalidCellLookup = useMemo<InvalidCellLookup>(
        () =>
            buildInvalidCellLookup({
                headers,
                columnMappings,
                mappedColumnsRequiringApprovedValues,
                approvedValueSetsByColumnSeq,
                effectiveTableData,
                selectedRowIds,
            }),
        [
            headers,
            columnMappings,
            mappedColumnsRequiringApprovedValues,
            approvedValueSetsByColumnSeq,
            effectiveTableData,
            selectedRowIds,
        ],
    );

    const invalidColumnSeqLookup = useMemo(
        () =>
            buildInvalidColumnSeqLookup({
                headers,
                columnMappings,
                mappedColumnsRequiringApprovedValues,
                invalidCellLookup,
            }),
        [headers, columnMappings, mappedColumnsRequiringApprovedValues, invalidCellLookup],
    );

    const hasValidationErrors = useMemo(
        () => Object.keys(invalidCellLookup).length > 0,
        [invalidCellLookup],
    );

    const invalidCellCount = useMemo(
        () =>
            Object.values(invalidCellLookup).reduce(
                (acc, cells) => acc + Object.keys(cells).length,
                0,
            ),
        [invalidCellLookup],
    );

    return {
        invalidCellLookup,
        invalidColumnSeqLookup,
        hasValidationErrors,
        invalidCellCount,
    };
}
