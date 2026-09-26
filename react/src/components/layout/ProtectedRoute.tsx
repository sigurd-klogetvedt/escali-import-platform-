import { useIsAuthenticated } from "@azure/msal-react";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: React.ReactNode };

export const ProtectedRoute = ({ children }: Props) => {
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />
    }
    
    return <>{children}</>
};