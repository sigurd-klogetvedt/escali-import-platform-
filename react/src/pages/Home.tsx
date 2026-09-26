import { useIsAuthenticated } from "@azure/msal-react"
import { Dashboard } from "./Dashboard";
import { Login } from "./Login";

export const Home = () => {
    const isAuthenticated = useIsAuthenticated();

    return isAuthenticated ? <Dashboard /> : <Login />;
};