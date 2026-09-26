import { useState } from "react";
import { Button } from "@base-ui/react/button";
import { useAuth } from "../hooks/useAuth";
import { Trans, useTranslation } from "react-i18next";

export const Login = () => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handleLogin = async () => {
        setIsLoading(true);

        try {
            await login();
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="w-[520px] flex flex-col items-start gap-6">
                <div className="flex flex-col gap-2">
                    <img src="/logo.svg" className="h-12 w-12" alt="Turbo Barnacle" />
                    <p className="font-medium text-2xl text-black">Turbo Barnacle</p>
                    <p className="font-medium text-black/50 text-base">{t("login.signIn")}</p>
                </div>
                <div className="w-full flex gap-4 h-12">
                    <Button onClick={handleLogin} disabled={isLoading} focusableWhenDisabled className="flex w-full cursor-pointer items-center justify-center gap-2 h-full p-2.5 rounded-sm bg-white border border-[#E2E2E2] hover:bg-white/50 font-medium text-base text-[#222222] active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition">
                        {isLoading ? t("login.signingIn") : 
                        <>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" width="20" height="20" preserveAspectRatio="xMidYMid"><path fill="#F1511B" d="M121.666 121.666H0V0h121.666z"/><path fill="#80CC28" d="M256 121.666H134.335V0H256z"/><path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z"/><path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z"/></svg>
                        {t("login.button")}
                        </>}
                    </Button>
                </div>
                <p className="font-medium text-sm text-black/50">
                    <Trans i18nKey="login.terms" components={[
                        <span />,
                        <a href="/terms" className="text-black underline hover:opacity-70 transition" />,
                        <span />,
                        <a href="/privacy" className="text-black underline hover:opacity-70 transition" />,
                    ]} />
                </p>
            </div>
        </div>
    )
};