import { LogLevel, type Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID || "",
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage", // Eller "localStorage", men sessionStorage er meir sikkert
        //storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (message, containsPii) => {
                if (!containsPii) console.log(message);
            },
            logLevel: LogLevel.Warning,
        },
    },
};

// Scopes for .NET API
export const apiRequest = {
    scopes: [`api://${import.meta.env.VITE_APPLICATION_ID}/access_as_user`],
};