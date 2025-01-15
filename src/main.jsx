import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ChangePassPage from "./pages/ChangePassPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OTPPage from "./pages/OTPPage.jsx";
import RolesPage from "./pages/RolesPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

const theme = createTheme({
    /** Put your mantine theme override here */
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignUpPage />,
    },
    {
        path: "/changepassword",
        element: <ChangePassPage />,
    },
    {
        path: "/otp",
        element: <OTPPage />,
    },
    {
        path: "/main/",
        element: <Layout />,
        children: [
            {
                path: "/main/",
                element: <div>Home</div>,
            },
            {
                path: "/main/users",
                element: <UsersPage />,
            },
            {
                path: "/main/roles",
                element: <RolesPage />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* khong can quan tam */}
        <QueryClientProvider client={queryClient}>
            {/* provider cua thu vien ui */}
            <MantineProvider theme={theme}>
                {/* toast thong bao */}
                <Notifications />
                {/* routes */}
                <RouterProvider router={router} />
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>,
);
