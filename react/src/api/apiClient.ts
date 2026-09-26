import { apiRequest } from "@/config/authConfig";
import type { IPublicClientApplication } from "@azure/msal-browser"
import ky from "ky"
import axios from "axios";

let msalInstance: IPublicClientApplication;

export function setMsalInstance(instance: IPublicClientApplication) {
    msalInstance = instance;
}

/**
 * Tiny Ky wrapper that automatically attaches a Bearer token
 * via MSAL's {@link IPublicClientApplication.acquireTokenSilent}
 */
export const api = ky.create({
    baseUrl: import.meta.env.VITE_API_URL,
    hooks: {
        beforeRequest: [
            async ({ request }) => {
                const accounts = msalInstance.getAllAccounts();
                const { accessToken } = await msalInstance.acquireTokenSilent({
                    ...apiRequest,
                    account: accounts[0]
                })
                request.headers.set("Authorization", `Bearer ${accessToken}`)
            }
        ]
    }
})

export const createApiClient = (getAccessToken: () => Promise<string>) => {
    const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

    client.interceptors.request.use(async (config) => {
        const token = await getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    return client;
};