import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { createApiClient } from "../api/apiClient";

export const useApiClient = () => {
    const { getAccessToken } = useAuth();
    return useMemo(() => createApiClient(getAccessToken), [getAccessToken]);
};