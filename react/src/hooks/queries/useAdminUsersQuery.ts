import { api } from "@/api/apiClient";
import type { AdminUser } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

type Options = {
    enabled?: boolean;
}

export function useAdminUsersQuery(options?: Options) {

    const enabled = options?.enabled ?? true;

    return useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const data = await api.get("/api/UserAdmin/users").json<AdminUser[]>();
            return (data ?? []).filter((user) => user.IsActive);
        },
        enabled,
        retry: false,
    })
}