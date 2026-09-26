import { Button } from "@base-ui/react/button";
import { Menu } from "@base-ui/react/menu";
import { Tooltip } from "@base-ui/react/tooltip";
import { ChevronDown, Ellipsis } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UploadedFile } from "../types/files";
import { DeleteDialog } from "./DeleteDialog";
import { useNavigate } from "react-router-dom";
import type { SheetType } from "@/types/sheet-types";
import { useDeleteFileMutation, useDownloadFileMutation } from "@/hooks/mutations";

type FileRowProps = {
    file?: UploadedFile | null;
    sheetTypes: SheetType[];
    selectedSheetType: SheetType | null;
    onSelectSheetType: (type: SheetType | null) => void;
    isLoading?: boolean;
};

export const FileRow = ({ file, sheetTypes, selectedSheetType, onSelectSheetType, isLoading = false }: FileRowProps) => {
    const { t } = useTranslation();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const deleteFile = useDeleteFileMutation();
    const downloadFile = useDownloadFileMutation();

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-between w-5xl px-3 py-2 bg-white border border-gray-200 rounded-sm h-14">
                <div className="flex items-center justify-center gap-2">
                    <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
                    <div className="flex flex-col items-start justify-center gap-1">
                        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
                        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-28 rounded-sm bg-gray-200 animate-pulse" />
                    <div className="h-8 w-12 rounded-sm bg-gray-200 animate-pulse" />
                    <div className="h-8 w-8 rounded-sm bg-gray-200 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!file) return null;

    const mappedType = file.IsMapped && file.InterfaceSeq != null ? sheetTypes.find((st) => st.InterfaceSeq === file.InterfaceSeq) : null;

    const mappedTypeLabel = mappedType ? t(`sheetTypes.${mappedType.InterfaceName}`) : null;
    const fileSizeDisplay = file.FileSize >= 1 ? `${(file.FileSize).toFixed(2)} MB`: `${(file.FileSize * 1024).toFixed(0)} KB`;
    const fileIcon = file.FileType.toLowerCase() === "csv" ? "/assets/svg/csv.svg" : "/assets/svg/excel.svg";

    const statusBadge = file.StatusSeq === 1 ? (
        <span className="font-medium text-sm text-green-600 h-8 flex items-center px-3 py-2.5 rounded-full bg-green-100 gap-1">
            {t("statuses.completed")}
        </span>
    ) : file.StatusSeq === 2 ? (
        <span className="font-medium text-sm text-amber-600 h-8 flex items-center px-3 py-2.5 rounded-full bg-amber-100">
            {t("statuses.draft")}
        </span>
    ) : null;

    const storageBadge = (
        <span className={`font-medium text-sm h-8 flex items-center px-3 py-2.5 rounded-full ${
            file.LocalStorage ? "text-blue-700 bg-blue-100" : "text-purple-700 bg-purple-100"
        }`}>
            {file.LocalStorage ? "Local" : "Blob"}
        </span>
    );

    return (
        <div className="flex items-center justify-between w-5xl px-3 py-2 bg-white border border-gray-200 rounded-sm h-14">
            <div className="flex items-center justify-center gap-2">
                <img src={fileIcon} className="h-6" alt="" />
                <div className="flex flex-col items-start justify-center">
                    <p className="font-medium text-base text-black">{file.OriginalFileName}</p>
                    <p className="font-medium text-sm text-black/50">{fileSizeDisplay}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {statusBadge}
                {storageBadge}

                {file.IsMapped ? (
                    <span className="font-medium text-sm text-black h-8 flex items-center px-2 py-2.5 rounded-sm bg-gray-100">
                        {mappedTypeLabel ?? t("dashboard.selectType")}
                    </span>
                ) : (
                    <>
                        <Menu.Root>
                            <Menu.Trigger className={`${selectedSheetType ? "text-black" : "text-black/60"} flex cursor-pointer items-center rounded-sm gap-1 h-8 px-2 py-2.5 bg-white border border-gray-100 hover:bg-gray-100 data-popup-open:bg-gray-100 transition font-medium text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500`}>
                                {selectedSheetType ? t(`sheetTypes.${selectedSheetType.InterfaceName}`) : t("dashboard.selectType")}
                                <ChevronDown className="w-4 h-4 text-black/70" />
                            </Menu.Trigger>

                            <Menu.Portal>
                                <Menu.Positioner side="bottom" align="start" sideOffset={8}>
                                <Menu.Popup className="base-ui-popup-animation rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5">
                                        {sheetTypes.map((type) => (
                                            <Menu.Item
                                                key={type.InterfaceSeq}
                                                onClick={() => onSelectSheetType(type)}
                                                className="flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black"
                                            >
                                                {t(`sheetTypes.${type.InterfaceName}`)}
                                            </Menu.Item>
                                        ))}
                                    </Menu.Popup>
                                </Menu.Positioner>
                            </Menu.Portal>
                        </Menu.Root>

                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger disabled={!!selectedSheetType} render={(props) => <span {...props} className="inline-flex" />}>
                                    <Button
                                        disabled={!selectedSheetType}
                                        aria-label={t("dashboard.mapButtonDisabledHint")}
                                        className="disabled:cursor-not-allowed disabled:bg-black/50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-1 h-8 px-2 py-2.5 rounded-sm bg-black hover:bg-black/80 transition text-white font-medium text-sm"
                                        onClick={() =>
                                            selectedSheetType &&
                                            navigate(`/mapping/${file.FileSeq}?interface=${selectedSheetType.InterfaceSeq}`, {
                                                state: {
                                                    interfaceSeq: selectedSheetType.InterfaceSeq,
                                                    interfaceName: selectedSheetType.InterfaceName,
                                                    fileName: file.OriginalFileName,
                                                    localStorage: file.LocalStorage,
                                                },
                                            })
                                        }
                                    >
                                        {t("dashboard.mapButton")}
                                    </Button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Positioner side="top" sideOffset={8}>
                                        <Tooltip.Popup className="base-ui-tooltip-animation rounded-md border border-gray-200 bg-gray-900 px-3 py-2 text-sm text-white shadow-lg outline-none">
                                            {t("dashboard.mapButtonDisabledHint")}
                                        </Tooltip.Popup>
                                    </Tooltip.Positioner>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </>
                )}

                <Menu.Root>
                    <Menu.Trigger className="flex items-center justify-center h-8 w-8 rounded-sm transition hover:bg-gray-100 data-popup-open:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 cursor-pointer">
                        <Ellipsis className="w-4 h-4 text-black" />
                    </Menu.Trigger>

                    <Menu.Portal>
                        <Menu.Positioner side="bottom" align="start" sideOffset={8}>
                            <Menu.Popup className="base-ui-popup-animation min-w-[140px] rounded-md border border-gray-200 bg-white p-1 outline-none gap-0.5">
                                <Menu.Item className="flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black">
                                    {t("moreButton.buttonPreview")}
                                </Menu.Item>
                                <Menu.Item
                                    disabled={downloadFile.isPending}
                                    onClick={() => downloadFile.mutate({ fileSeq: file.FileSeq, fileName: file.OriginalFileName })}
                                    aria-label={t("moreButton.buttonDownload")}
                                    className="flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-gray-100 text-black/70 transition hover:text-black data-disabled:cursor-not-allowed data-disabled:opacity-60"
                                >
                                    {t("moreButton.buttonDownload")}
                                </Menu.Item>
                                <Menu.Item onClick={() => setIsDeleteOpen(true)} className="flex w-full cursor-pointer items-center px-2 py-2.5 gap-1 rounded-sm font-medium text-sm h-8 hover:bg-red-50 text-red-600 transition focus-visible:bg-red-50">
                                    {t("moreButton.buttonDelete")}
                                </Menu.Item>
                            </Menu.Popup>
                        </Menu.Positioner>
                    </Menu.Portal>
                </Menu.Root>
                <DeleteDialog
                        sheetName={file.OriginalFileName}
                        open={isDeleteOpen}
                        isDeleting={deleteFile.isPending}
                        onOpenChange={(next) => {
                            if (deleteFile.isPending) return;
                            setIsDeleteOpen(next);
                        }}
                        onDelete={() => deleteFile.mutate(
                            { fileSeq: file.FileSeq, fileName: file.OriginalFileName },
                            { onSuccess: () => setIsDeleteOpen(false) }
                        )}
                        onCancel={() => {
                            if (deleteFile.isPending) return;
                            setIsDeleteOpen(false);
                        }} />
            </div>
        </div>
    );
};