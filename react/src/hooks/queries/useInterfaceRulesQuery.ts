import { api } from "@/api/apiClient";
import type { InterfaceRule } from "@/types/rules";
import { useQuery } from "@tanstack/react-query";

export function useInterfaceRulesQuery(interfaceSeq: number) {
    return useQuery({
        queryKey: ["interface-rules", interfaceSeq],
        queryFn: async () => {
            return api.get(`/api/InterfaceRules/${interfaceSeq}`).json<InterfaceRule[]>();
        },
        enabled: interfaceSeq > 0,
    });
}