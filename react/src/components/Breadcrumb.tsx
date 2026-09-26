import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom"

export const Breadcrumb = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const rawSegments = location.pathname.split("/").filter(Boolean);

    const state = location.state as { fileName?: string } | null;

    const validRoots = new Set(["dashboard", "mapping"]);

    const isHome = rawSegments.length === 0;
    const root = rawSegments[0] ?? "";
    const isUnknownRoute = !isHome && !validRoots.has(root);

    if (isHome || isUnknownRoute) {
        return (
            <nav aria-label="Breadcrumb" className="text-sm flex items-center gap-1">
                <span className="text-black transition px-2 font-medium">
                    {t("breadcrumb.home")}
                </span>
            </nav>
        );
    }

    const segments = root === "mapping" ? rawSegments.slice(1) : rawSegments;

    const labelMap: Record<string, string> = {
        dashboard: "Dashboard",
        mappings: "Mappings",
    };

    const parts = segments.map((seg, index) => {
        const path = "/" + rawSegments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        let label = labelMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);

        if (root === "mapping" && isLast && state?.fileName) {
            label = state.fileName;
        }

        if (isLast) {
            return (
                <span key={path} className="text-black font-medium">
                    {label}
                </span>
            );
        }

        return (
            <Link key={path} to={path} className="text-black hover:text-black/70 transition font-medium">
                {label}
            </Link>
        );
    });

    if (parts.length === 0) {
        return <span className="text-sm text-black/70 px-2 font-medium">{t("breadcrumb.home")}</span>;
    };

    return (
        <nav aria-label="Breadcrumb" className="text-sm flex items-center gap-1">
            <Link to="/" className="text-black/50 hover:text-black transition px-2 font-medium">
            {t("breadcrumb.home")}
            </Link>
            {parts.map((part, index) => (
                <span key={index} className="flex items-center gap-1">
                    <span className="text-black/70 font-medium">/</span>
                    <span className="px-2 font-medium">{part}</span>
                </span>
            ))}
        </nav>
    );
};