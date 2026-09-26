import { api } from "@/api/apiClient";
import { type Status, type StatusDto } from "@/types/statuses";
import { useQuery } from "@tanstack/react-query";

export function useStatusesQuery() {
    return useQuery({
        queryKey: ["statuses"],
        queryFn: async () => {
            const res = await api.get("/api/statuses").json<StatusDto[]>();
            return (res ?? []).map(
                (i): Status => ({
                    StatusSeq: i.statusSeq ?? 0,
                    StatusName: i.statusName ?? "",
                }),
            );
        },
        staleTime: 5 * 60 * 1000, // 5 minutes stale time
    });
}