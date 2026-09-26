import { Outlet } from "react-router-dom";
import { Header } from "../Header";

export const Layout = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
            <Header />
            <main className="flex-1 flex min-h-0 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}