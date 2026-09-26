import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";

export const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="flex flex-col items-center gap-4 text-center">
                <h1 className="text-2xl font-semibold text-gray-800">404</h1>
                <p className="text-gray-600">{t("notFound.message")}</p>
                <Link to="/" className="text-blue-600 hover:underline font-medium">
                    {t("notFound.backHome")}
                </Link>
            </div>
        </div>
    );
};