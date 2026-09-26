import { Menu } from "@base-ui/react/menu";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { ChevronDown, LogOut, SlidersHorizontal } from "lucide-react";
import { LanguageDropdown } from "./LanguageDropdown";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "./Breadcrumb";
import { AdminDialog } from "./AdminDialog";
import { useCurrentUser } from "../hooks/useCurrentUser";

export const Header = () => {
    const { logout } = useAuth();
    const { accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const { t } = useTranslation();
    const { currentUser } = useCurrentUser({ enabled: isAuthenticated });

    const [scrolled, setScrolled] = useState(false);
    const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 32);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const userName = accounts[0]?.name ?? "User";
    const userInitials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <header className={`top-0 flex items-center justify-end px-6 py-4 bg-gray-50 gap-2 border-b transition-colors duration-300 ease-out ${scrolled ? "border-gray-200" : "border-transparent"}`}>
            {isAuthenticated && (
            <>
            <div className="flex gap-4 mr-auto items-center justify-center">
                <Link to="/">
                    <img src="/logo.svg" alt="Turbo Barnacle" className="h-12 w-12" />
                </Link>
                <Breadcrumb />
            </div>
            <Menu.Root>
                <Menu.Trigger className="flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-popup-open:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 h-9">
                    <span className="flex h-6 w-6 items-center justify-center rounded-xs bg-[#C361B9] text-[10px] font-medium text-white">
                        {userInitials}
                    </span>

                    <span>{userName}</span>

                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </Menu.Trigger>

                <Menu.Portal>
                    <Menu.Positioner side="bottom" align="end" sideOffset={8}>
                        <Menu.Popup className="base-ui-popup-animation min-w-[160px] rounded-md border border-gray-200 bg-white p-1 shadow-lg outline-none gap-0.5">
                            <Menu.Item
                                onClick={() => setIsAdminDialogOpen(true)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 h-8 text-sm outline-none transition hover:bg-gray-100 focus-visible:bg-gray-50"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {t("header.settings")}
                            </Menu.Item>
                            <Menu.Item onClick={logout} className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 h-8 text-sm text-black outline-none transition hover:bg-gray-100 focus-visible:bg-gray-100">
                                <LogOut className="w-4 h-4" />
                                {t("header.signOut")}
                            </Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
            <AdminDialog
                open={isAdminDialogOpen}
                onOpenChange={setIsAdminDialogOpen}
                currentUserId={currentUser?.userId ?? null}
            />
            </>
            )}

            <LanguageDropdown />
        </header>
    )
};