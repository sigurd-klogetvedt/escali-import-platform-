import { api } from "@/api/apiClient";
import type { DataType } from "@/types/dataTypes";
import { useQuery } from "@tanstack/react-query";

type ApiDataType = {
    DataTypeSeq?: number;
    dataTypeSeq?: number;
    Type?: string;
    type?: string;
}

export function useDataTypesQuery() {
    return useQuery({
        queryKey: ["dataTypes"],
        queryFn: async () => {
            const res = await api.get("/api/datatypes").json<ApiDataType[]>();
            return (res ?? []).map((i) => ({
                DataTypeSeq: i.DataTypeSeq ?? i.dataTypeSeq ?? 0,
                Type: i.Type ?? i.type ?? "",
            })) as DataType[];
        },
        staleTime: 5 * 60 * 1000,
    });
}