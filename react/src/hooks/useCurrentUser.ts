import type { CurrentUserResponse } from "../types/users";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";

type UseCurrentUserResult = {
    currentUser: CurrentUserResponse | null;
    isLoading: boolean;
    error: string | null;
};

type UseCurrentUserOptions = {
    enabled?: boolean;
};

export const useCurrentUser = (options?: UseCurrentUserOptions): UseCurrentUserResult => {
    const enabled = options?.enabled ?? true;

    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => api.get("/api/Auth/me").json<CurrentUserResponse>(),
        enabled,
        retry: false,
    })

    return {
        currentUser: enabled ? (query.data ?? null) : null,
        isLoading: enabled ? query.isPending : false,
        error: query.isError ? "Failed to load current user" : null,
    };
};
