import { api } from "@/api/apiClient";
import type { SheetType } from "@/types/sheet-types";
import { useQuery } from "@tanstack/react-query";

type ApiInterface = {
    InterfaceSeq?: number;
    interfaceSeq?: number;
    InterfaceName?: string;
    interfaceName?: string;
};

export function useInterfacesQuery() {
    return useQuery({
        queryKey: ["interfaces"],
        queryFn: async () => {
            const res = await api.get("/api/interfaces").json<ApiInterface[]>();

            return (res ?? []).map((i) => ({
                InterfaceSeq: i.InterfaceSeq ?? i.interfaceSeq ?? 0,
                InterfaceName: i.InterfaceName ?? i.interfaceName ?? "",
            })) as SheetType[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes stale time
    })
}