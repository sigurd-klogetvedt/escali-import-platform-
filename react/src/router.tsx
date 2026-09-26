import { createBrowserRouter, Outlet } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { MappingPage } from "@/pages/MappingPage";
import { ReviewPage } from "@/pages/ReviewPage";
import { NotFound } from "@/pages/NotFound";

export const appRouter = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { index: true, element: <Home />},
            {
                element: (
                    <ProtectedRoute>
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: "mapping",
                        children: [
                            { index: true, element: <MappingPage /> },
                            { path: ":fileSeq", element: <MappingPage /> },
                            { path: "review", element: <ReviewPage /> },
                        ],
                    },
                ],
            },
            {
                path: "*",
                element: <NotFound />
            },
        ],
    },
]);