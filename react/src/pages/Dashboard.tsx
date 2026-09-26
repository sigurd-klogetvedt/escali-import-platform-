import { useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import { FileRow } from "@/components/FileRow";
import { DashboardHeader, type FilterState } from "@/components/DashboardHeader";
import { type SheetType } from "@/types/sheet-types";
import { useTranslation } from "react-i18next";
import {
    useInterfacesQuery,
    useStatusesQuery,
    useUploadedFilesQuery
} from "@/hooks/queries";
import { useUploadFileMutation } from "@/hooks/mutations";
import { notify } from "@/lib/notify";

export const Dashboard = () => {
    const { t } = useTranslation();

    const [selectedByFileSeq, setSelectedByFileSeq] = useState<Record<number, SheetType | null>>({});
    const [useLocalStorage, setUseLocalStorage] = useState(false);

    const [filters, setFilters] = useState<FilterState>({
        typeIds: [],
        statusIds: [],
        companyFiles: false,
    });

    const fileQuery = useUploadedFilesQuery(filters);
    const interfacesQuery = useInterfacesQuery();
    const statusesQuery = useStatusesQuery();
    const uploadMutation = useUploadFileMutation();

    const files = fileQuery.data?.files ?? [];
    const fileCount = fileQuery.data?.count ?? 0;
    const sheetTypes = interfacesQuery.data ?? [];
    const statuses = statusesQuery.data ?? [];
    const loading = fileQuery.isPending;

    const handleSelectSheetType = (fileSeq: number) => (type: SheetType | null) => {
        setSelectedByFileSeq((prev) => ({ ...prev, [fileSeq]: type }));
    };

    const handleUpload = async (file: File, uploadToLocal: boolean) => {
        await uploadMutation.mutateAsync({ file, uploadToLocal });
    }

    const handleDropzoneError = (reason: string) => {
        notify.warning(t("toast.dropzone.invalidFileTitle"), { description: reason });
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 w-5xl max-w-full mx-auto pt-24 gap-4">
                <Dropzone onUpload={handleUpload} onError={handleDropzoneError} useLocalStorage={useLocalStorage} onUseLocalStorageChange={setUseLocalStorage} />

                <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3">
                    <DashboardHeader sheetTypes={sheetTypes} statuses={statuses} loading={loading} count={fileCount} filters={filters} onFiltersChange={setFilters} />

                    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pb-4">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, idx) => (
                                <FileRow key={idx} isLoading sheetTypes={[]} selectedSheetType={null} onSelectSheetType={() => { }} />
                            ))
                        ) : files.length === 0 ? (
                            <div className="w-full flex items-center justify-center shrink-0 pt-24">
                                <p className="font-medium text-base text-black">{t("common.nofiles")}</p>
                            </div>
                        ) : (
                            files.map((file) => (
                                <FileRow key={file.FileSeq} file={file} sheetTypes={sheetTypes} selectedSheetType={selectedByFileSeq[file.FileSeq] ?? null} onSelectSheetType={handleSelectSheetType(file.FileSeq)} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};