import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ChangePassPage from "./pages/ChangePassPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OTPPage from "./pages/OTPPage.jsx";
import PendingShopDetail from "./pages/PendingShopDetailPage.jsx";
import PendingShopListPage from "./pages/PendingShopListPage.jsx";
import ShipperDetails from "./pages/ShipperDetails.jsx";
import ShipperList from "./pages/ShipperList.jsx";
import ShipperManagementPage from "./pages/ShipperManagementPage.jsx";
import ShipperViewPage from "./pages/ShipperViewPage.jsx";
import ShopProfileDetail from "./pages/ShopProfileDetail.jsx";
import ShopsPage from "./pages/ShopsPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import UserDetailPage from "./pages/UserDetailPage.jsx";

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
        path: "/changepassword",
        element: <ChangePassPage />,
    },
    {
        path: "/otp",
        element: <OTPPage />,
    },
    {
        path: "/forgotpass",
        element: <ForgotPassPage />,
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
                path: "/main/shops",
                element: <ShopsPage />,
            },
            {
                path: "/main/shipperslist",
                element: <ShipperList />,
            },
            {
                path: "/main/shipperslist/:id",
                element: <ShipperDetails />,
            },
            {
                path: "/main/shop/:id",
                element: <ShopProfileDetail />,
            },
            {
                path: "/main/users",
                element: <UsersPage />,
            },
            {
                path: "/main/user_detail/:id",
                element: <UserDetailPage />,
            },
            {
                path: "/main/pendingshops/",
                element: <PendingShopListPage />,
            },
            {
                path: "/main/pendingshop/:id",
                element: <PendingShopDetail />,
            },
            {
                path: "/main/pendding-shippers",
                element: <ShipperManagementPage />,
            },
            {
                path: "/main/pendding-shippers/:id",
                element: <ShipperViewPage />,
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
                <DatesProvider
                    settings={{
                        locale: "vn",
                        firstDayOfWeek: 1,
                        timezone: "Asia/Ho_Chi_Minh",
                    }}
                >
                    <RouterProvider router={router} />
                </DatesProvider>
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>,
);
