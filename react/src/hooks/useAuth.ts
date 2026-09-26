import { useCallback } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { apiRequest } from "../config/authConfig";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { notify } from "@/lib/notify";


export const useAuth = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const { t } = useTranslation();

    const queryClient = useQueryClient();

    const login = () => instance.loginRedirect(apiRequest);
    const logout = () => {
        queryClient.invalidateQueries({ queryKey: ["current-user"] })
        instance.logoutRedirect().catch(() => {
            notify.error(t("toast.auth.logoutErrorTitle"));
        });
    };

    const getAccessToken = useCallback(async (): Promise<string> => {
        const response = await instance.acquireTokenSilent({
            ...apiRequest,
            account: accounts[0],
        });
        return response.accessToken;
    }, [instance, accounts]);

    return { isAuthenticated, login, logout, getAccessToken };
};
