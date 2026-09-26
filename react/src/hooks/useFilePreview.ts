import { useQuery } from "@tanstack/react-query";
import type { FilePreviewResponse } from "../components/table/tableUtils";
import { api } from "@/api/apiClient";

type UseFilePreviewParams = {
    fileSeq: number;
    localStorage?: boolean;
    enabled?: boolean;
};

export const useFilePreview = ({ fileSeq, localStorage = false, enabled = true }: UseFilePreviewParams) => {
    const query = useQuery({
        queryKey: ["file-preview", fileSeq, localStorage],
        queryFn: async () => {
            const previewEndpoint = localStorage
                ? `/api/LocalUploadFiles/${fileSeq}/preview`
                : `/api/UploadFiles/${fileSeq}/preview`;
            const d = await api.get(previewEndpoint).json<FilePreviewResponse & { Headers?: string[]; Rows?: string[][] }>()
            return { headers: d.headers ?? d.Headers ?? [], rows: d.rows ?? d.Rows ?? [] };
        },
        enabled: enabled && !!fileSeq,
    });

    return {
        data: query.data ?? null,
        loading: query.isPending,
        error: query.isError ? query.error : null,
        refetch: query.refetch,
    };
};