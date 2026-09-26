import { useQuery } from "@tanstack/react-query";
import type { Column } from "../../components/InterfaceColumnsPills";
import { api } from "@/api/apiClient";

export function useInterfaceColumnsQuery(interfaceSeq: number) {

    return useQuery({
        queryKey: ["interface-columns", interfaceSeq],
        queryFn: async () => {
            return api.get(`/api/interfaces/${interfaceSeq}/columns`).json<Column[]>();
        },
        enabled: interfaceSeq > 0,
    })
}