import { api } from "@/api/apiClient";
import type { FilterState } from "@/components/DashboardHeader";
import type { UploadedFile, UploadedFileAPIResponse } from "@/types/files";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type UploadedFilesResult = {
    count?: number;
    items?: UploadedFileAPIResponse[];
}

function buildSearchParams(filters: FilterState) {
    const params = new URLSearchParams();
    params.append("includeCompanyFiles", String(filters.companyFiles));

    for (const id of filters.statusIds) {
        params.append("statusSeq", String(id));
    }

    for (const id of filters.typeIds) {
        params.append("interfaceSeq", String(id))
    }

    return params;
}

function mapFile(f: UploadedFileAPIResponse): UploadedFile {
    return {
        FileSeq: f.FileSeq ?? f.fileSeq ?? 0,
        OriginalFileName: f.OriginalFileName ?? f.originalFileName ?? "",
        FileStorageHash: "",
        FileType: f.FileType ?? f.fileType ?? "",
        FileSize: ((f.FileSize ?? f.fileSize) ?? 0) / (1024 * 1024),
        UploadedByUserSeq: 0,
        IsMapped: f.IsMapped ?? f.isMapped ?? false,
        InterfaceSeq: f.InterfaceSeq ?? f.interfaceSeq ?? null,
        StatusSeq: f.StatusSeq ?? f.statusSeq ?? null,
        CompanySeq: 0,
        FileUploadedAt: f.FileUploadedAt ?? f.fileUploadedAt ?? "",
        LocalStorage: f.LocalStorage ?? f.localStorage ?? false,
    }
}

export function useUploadedFilesQuery(filters: FilterState) {
    return useQuery({
        queryKey: ["uploaded-files", filters],
        queryFn: async () => {
            const res = await api
                .get("/api/UploadFiles", { searchParams: buildSearchParams(filters) })
                .json<UploadedFilesResult>()
            const payload = res ?? {};
            const items = payload.items ?? [];
            return {
                files: items.map(mapFile),
                count: payload.count ?? items.length
            }
        },
        placeholderData: keepPreviousData
    })
}