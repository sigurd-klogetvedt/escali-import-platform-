import { useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { InterfaceColumnsPills, type Column } from "@/components/InterfaceColumnsPills";
import {
    useInterfaceColumnsQuery,
    useMappingDragAndDrop,
    useMappingRoute,
    useNavigationLeaveConfirmation,
    useQueryErrorToast,
} from "@/hooks";
import { notify } from "@/lib/notify";
import { useMappingStore } from "@/stores/mappingStore";
import { MappingPageHeader } from "./MappingPageHeader";
import { MappingPageTable } from "./MappingPageTable";
import { MappingToolbar } from "./MappingToolbar";
import {
    InvalidMappingPage,
    MappingDragOverlayContent,
    MappingPageActionBar,
    RuleValidationAlert,
} from "./components";
import {
    useApprovedValuesValidation,
    useConflictNavigation,
    useInterfaceRulesValidation,
    useMappingMutations,
    useMappingSessionReset,
    usePreviewTableState,
} from "./hooks";
import {
    buildDisplayPreviewRows,
    buildMappedColumnDataFromMappings,
} from "./utils/mappedColumnDataUtils";
import { buildChangedCellLookup } from "./utils/mappingLookupBuilders";

const MAPPING_REVIEW_PATH = "/mapping/review";

export function MappingPage() {
    const { fileSeq, fileSeqNum, isValidFile, interfaceSeq, interfaceName, localStorage } = useMappingRoute();
    const sessionKey = `${fileSeqNum}:${localStorage ? "local" : "blob"}`;

    if (!isValidFile) {
        return <InvalidMappingPage fileSeq={fileSeq} />;
    }

    return (
        <MappingPageSession
            key={sessionKey}
            fileSeqNum={fileSeqNum}
            interfaceSeq={interfaceSeq}
            interfaceName={interfaceName}
            localStorage={localStorage}
        />
    );
}

type MappingPageSessionProps = {
    fileSeqNum: number;
    interfaceSeq: number;
    interfaceName: string | undefined;
    localStorage: boolean;
};

function MappingPageSession({
    fileSeqNum,
    interfaceSeq,
    interfaceName,
    localStorage,
}: MappingPageSessionProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const searchQuery = useMappingStore((s) => s.searchQuery);
    const sortBy = useMappingStore((s) => s.sortBy);
    const requiredOnly = useMappingStore((s) => s.requiredOnly);
    const selectedDataTypeSeqs = useMappingStore((s) => s.selectedDataTypeSeqs);
    const partiallyRequiredOnly = useMappingStore((s) => s.partiallyRequiredOnly);
    const columnMappings = useMappingStore((s) => s.columnMappings);
    const setColumnMappings = useMappingStore((s) => s.setColumnMappings);
    const manualValueOverrides = useMappingStore((s) => s.manualValueOverrides);

    useMappingSessionReset({ fileSeqNum, interfaceSeq, localStorage });

    const interfaceColumnsQuery = useInterfaceColumnsQuery(interfaceSeq);
    const interfaceColumns = useMemo(
        () => interfaceColumnsQuery.data ?? [],
        [interfaceColumnsQuery.data],
    );
    const interfaceColumnsError = interfaceColumnsQuery.isError;
    useQueryErrorToast(interfaceColumnsQuery, t("toast.mapping.interfaceColumnsErrorTitle"), {
        id: `interface-columns-${interfaceSeq}`,
    });

    const { sensors, activeColumn, handleDragStart, handleDragEnd } = useMappingDragAndDrop(setColumnMappings);

    const droppedColumns = useMemo(
        () => Object.values(columnMappings).filter((c): c is Column => c != null),
        [columnMappings],
    );
    const availableColumns = useMemo(
        () => interfaceColumns.filter((col) => !droppedColumns.some((d) => d.columnSeq === col.columnSeq)),
        [interfaceColumns, droppedColumns],
    );

    const {
        previewData,
        previewLoading,
        previewError,
        headers,
        effectiveTableData,
        selectedTableData,
        selectedRowIds,
        rowSelection,
        handleRowSelectionChange,
    } = usePreviewTableState({ fileSeqNum, localStorage, t });

    const mappedColumnData = useMemo(
        () => buildMappedColumnDataFromMappings(selectedTableData, columnMappings),
        [selectedTableData, columnMappings],
    );
    const hasMappedData = Object.keys(mappedColumnData).length > 0;

    useNavigationLeaveConfirmation({
        when: hasMappedData,
        shouldAllowNavigation: ({ nextLocation }) => nextLocation.pathname.replace(/\/$/, "") === MAPPING_REVIEW_PATH,
        confirmMessage: t("mappingPage.leaveConfirm"),
    });

    const mappedColumnDataForDisplay = useMemo(
        () => buildMappedColumnDataFromMappings(effectiveTableData, columnMappings),
        [effectiveTableData, columnMappings],
    );
    const displayTableData = useMemo(
        () => buildDisplayPreviewRows(effectiveTableData, headers, columnMappings, mappedColumnDataForDisplay),
        [effectiveTableData, headers, columnMappings, mappedColumnDataForDisplay],
    );

    const {
        invalidCellLookup,
        invalidColumnSeqLookup,
        hasValidationErrors,
        invalidCellCount,
    } = useApprovedValuesValidation({ headers, effectiveTableData, selectedRowIds, t });

    const {
        conflicts,
        currentConflictIndex,
        targetCellId,
        handleNextConflict,
        handlePreviousConflict,
    } = useConflictNavigation({ headers, invalidCellLookup });

    const changedCellLookup = useMemo(
        () => buildChangedCellLookup({ headers, columnMappings, manualValueOverrides }),
        [headers, columnMappings, manualValueOverrides],
    );

    const presentColumns = useMemo(
        () => droppedColumns.map((c) => c.columnSeq),
        [droppedColumns],
    );

    const { failedRuleResults, hasRuleErrors } = useInterfaceRulesValidation({
        interfaceSeq,
        presentColumns,
    });

    const {
        handleSelectApprovedValue,
        handleRevertValue,
        handleRemoveMapping,
    } = useMappingMutations({ headers, effectiveTableData });

    const handleReviewClick = () => {
        if (hasValidationErrors) {
            notify.warning(t("toast.mapping.validationBlockedTitle"), {
                description: t("toast.mapping.validationBlockedDescription", {
                    count: invalidCellCount,
                }),
            });
            return;
        }
        if (hasRuleErrors) return;
        // TODO notify: surface success/error toasts here when the submit API is wired.
        navigate(MAPPING_REVIEW_PATH, { state: { mappedColumnData, fileSeq: fileSeqNum, interfaceSeq } });
    };

    const reviewDisabled = hasValidationErrors || hasRuleErrors || !hasMappedData;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex flex-1 flex-col w-full min-h-[400px] bg-gray-50">
                <MappingPageHeader interfaceName={interfaceName} t={t} />
                <div className="px-4 flex flex-col gap-4 items-start w-full overflow-y-auto">
                    <MappingToolbar
                        interfaceSeq={interfaceSeq}
                        fileHeaders={headers}
                        interfaceColumns={interfaceColumns}
                        interfaceColumnsLoading={interfaceColumnsQuery.isPending}
                    />
                    {interfaceColumnsError ? (
                        <p className="text-sm text-red-600" role="alert">
                            Could not load interface columns.
                        </p>
                    ) : null}
                    {hasRuleErrors ? (
                        <RuleValidationAlert failedRuleResults={failedRuleResults} />
                    ) : null}
                    <InterfaceColumnsPills
                        interfaceSeq={interfaceSeq}
                        searchQuery={searchQuery}
                        sortBy={sortBy}
                        requiredOnly={requiredOnly}
                        dataTypeSeqFilters={selectedDataTypeSeqs}
                        partiallyRequiredOnly={partiallyRequiredOnly}
                        droppedColumns={droppedColumns}
                    />
                </div>

                <div className="flex-1 min-h-0 flex flex-col pt-4">
                    <MappingPageTable
                        previewLoading={previewLoading}
                        previewError={previewError}
                        previewData={previewData}
                        tableData={displayTableData}
                        headers={headers}
                        onRemoveMapping={handleRemoveMapping}
                        invalidCellLookup={invalidCellLookup}
                        invalidColumnSeqLookup={invalidColumnSeqLookup}
                        changedCellLookup={changedCellLookup}
                        availableOptions={availableColumns.map((col) => ({
                            value: String(col.columnSeq),
                            label: col.columnFieldName,
                            data: col,
                        }))}
                        rowSelection={rowSelection}
                        onRowSelectionChange={handleRowSelectionChange}
                        onSelectApprovedValue={handleSelectApprovedValue}
                        onRevertValue={handleRevertValue}
                        targetCellId={targetCellId}
                    />
                </div>

                <MappingPageActionBar
                    t={t}
                    conflicts={conflicts}
                    currentConflictIndex={currentConflictIndex}
                    onNextConflict={handleNextConflict}
                    onPreviousConflict={handlePreviousConflict}
                    onCancel={() => navigate("/")}
                    onReview={handleReviewClick}
                    reviewDisabled={reviewDisabled}
                />
            </div>

            <MappingDragOverlayContent activeColumn={activeColumn} />
        </DndContext>
    );
}
