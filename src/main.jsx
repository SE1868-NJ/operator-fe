import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import BanPage from "./pages/BanPage.jsx";
import ChangePassPage from "./pages/ChangePassPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OTPPage from "./pages/OTPPage.jsx";
import PendingShopDetail from "./pages/PendingShopDetailPage.jsx";
import PendingShopListPage from "./pages/PendingShopListPage.jsx";
import ReportCategoriesPage from "./pages/ReportCategories.jsx";
import ShipperDetails from "./pages/ShipperDetails.jsx";
import ShipperList from "./pages/ShipperList.jsx";
import ShipperPendingPage from "./pages/ShipperPendingPage.jsx";
import ShipperViewPage from "./pages/ShipperViewPage.jsx";
import ShopProfileDetail from "./pages/ShopProfileDetail.jsx";
import ShopsPage from "./pages/ShopsPage.jsx";
import UserDetailPage from "./pages/UserDetailPage.jsx";

import ReportDetailPage from "./pages/ReportDetailPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
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
                element: <ShipperPendingPage />,
            },
            {
                path: "/main/pendding-shippers/:id",
                element: <ShipperViewPage />,
            },
            {
                path: "/main/reports",
                element: <ReportsPage />,
            },
            {
                path: "/main/reports/:id",
                element: <ReportDetailPage />,
            },
            {
                path: "/main/report-categories",
                element: <ReportCategoriesPage />,
            },
            {
                path: "/main/ban_account",
                element: <BanPage />,
            },

            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
]);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* khong can quan tam */}
        <QueryClientProvider client={queryClient}>
            {/* provider cua thu vien ui */}
            <MantineProvider theme={theme} defaultColorScheme="light">
                <NavigationProgress />
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
