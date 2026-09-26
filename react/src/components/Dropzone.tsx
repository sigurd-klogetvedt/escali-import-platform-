import { useRef, useState } from "react";
import { Button } from "@base-ui/react/button";
import { Loader2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type DropzoneProps = {
    onUpload: (file: File, useLocalStorage: boolean) => Promise<void>;
    useLocalStorage: boolean;
    onUseLocalStorageChange: (value: boolean) => void;
    onError?: (error: string) => void;
    maxFileSizeMB?: number;
    acceptedFileTypes?: string[];
    disabled?: boolean;
};

const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
};

const getFileIcon = (name: string): string => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "csv") return "/assets/svg/csv.svg";
    return "/assets/svg/excel.svg";
};

export const Dropzone = ({
    onUpload,
    useLocalStorage,
    onUseLocalStorageChange,
    onError,
    maxFileSizeMB = 10,
    acceptedFileTypes = [".csv", ".xlsx"],
    disabled = false,
}: DropzoneProps) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const dragCounter = useRef(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [stagedFile, setStagedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const acceptString = acceptedFileTypes.join(",");
    const typesLabel = acceptedFileTypes
        .map((ext) => ext.replace(".", "").toUpperCase())
        .join(", ");

    const validateAndStage = (file: File) => {
        const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
        if (!acceptedFileTypes.includes(extension)) {
            onError?.(t("dropzone.errorFileType", { name: file.name }));
            return;
        }
        if (file.size > maxFileSizeMB * 1024 * 1024) {
            onError?.(t("dropzone.errorFileSize", { name: file.name, max: maxFileSizeMB }));
            return;
        }
        setStagedFile(file);
    };

    const handleUploadClick = async () => {
        if (!stagedFile || isUploading) return;
        setIsUploading(true);
        try {
            await onUpload(stagedFile, useLocalStorage);
            setStagedFile(null);
        } catch {
            throw new Error("Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (dragCounter.current === 1) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) {
            validateAndStage(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndStage(e.target.files[0]);
            e.target.value = "";
        }
    };

    const openFilePicker = () => inputRef.current?.click();

    const interactionDisabled = disabled || isUploading;

    return (
        <div className={`mb-14 justify-center mx-auto flex flex-col items-center gap-6 max-w-lg max-h-47 w-full ${interactionDisabled ? "opacity-50 pointer-events-none" : ""}`}>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={acceptString}
                onChange={handleFileChange}
                disabled={interactionDisabled}
            />

            <div
                role="button"
                tabIndex={interactionDisabled ? -1 : 0}
                onClick={openFilePicker}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openFilePicker();
                    }
                }}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`hover:bg-neutral-100 flex flex-col items-center justify-center w-full border border-dashed border-neutral-300 rounded-sm p-16 cursor-pointer transition-colors ${isDragOver ? "bg-neutral-100" : "bg-white"}`}
            >
                <div className="flex flex-col items-center gap-1">
                    <p className="font-medium text-base text-black">
                        {t("dropzone.prompt")}
                    </p>
                    <p className="font-medium text-base text-black/50">
                        {t("dropzone.maxSize", { size: maxFileSizeMB, types: typesLabel })}
                    </p>
                </div>
            </div>

            {stagedFile && (
                <div className="flex items-center justify-between px-3 py-2 w-full bg-white border border-gray-200 rounded-sm">
                    <div className="flex items-center gap-2">
                        <img src={getFileIcon(stagedFile.name)} className="h-5" alt="" />
                        <span className="font-medium text-sm text-black">{stagedFile.name}</span>
                        <span className="font-medium text-sm text-black/50">{formatFileSize(stagedFile.size)}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setStagedFile(null)}
                        className="flex items-center justify-center h-6 w-6 rounded-sm hover:bg-gray-100 transition cursor-pointer"
                        aria-label={t("dropzone.removeFile")}
                    >
                        <X className="w-4 h-4 text-black/50" />
                    </button>
                </div>
            )}

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-black">
                    <input type="checkbox" checked={useLocalStorage} onChange={(e) => onUseLocalStorageChange(e.target.checked)} disabled={interactionDisabled} className="h-4 w-4" />
                    Local storage
                </label>

                <Button
                    disabled={interactionDisabled || !stagedFile}
                    onClick={handleUploadClick}
                    className="disabled:cursor-not-allowed disabled:bg-[#1b1b1b]/50 cursor-pointer flex items-center justify-center gap-1 h-8 px-2 py-2.5 rounded-sm bg-[#1b1b1b] hover:bg-[#1b1b1b]/80 transition text-white font-medium text-sm"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t("dropzone.uploading")}
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            {t("dropzone.uploadButton")}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
