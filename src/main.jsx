import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "dayjs/locale/ru";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import { ModalsProvider } from '@mantine/modals';
import { MantineProvider, createTheme } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AccountProfile from "./pages/AccountProfile.jsx";
import BanPage from "./pages/BanPage.jsx";
import ChangePassPage from "./pages/ChangePassPage.jsx";
import DemoShippingMethod from "./pages/DemoShippingMethod.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import NewShippingMethod from "./pages/NewShippingMethod.jsx";
import OTPPage from "./pages/OTPPage.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import OrderManagement from "./pages/OrderManagement.jsx";
import PendingShopDetail from "./pages/PendingShopDetailPage.jsx";
import PendingShopListPage from "./pages/PendingShopListPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ReportCategoriesPage from "./pages/ReportCategories.jsx";
import ReportDetailPage from "./pages/ReportDetailPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ShipperDetails from "./pages/ShipperDetails.jsx";
import ShipperList from "./pages/ShipperList.jsx";
import ShipperPendingPage from "./pages/ShipperPendingPage.jsx";
import ShipperViewPage from "./pages/ShipperViewPage.jsx";
import ShippingMethodDetail from "./pages/ShippingMethodDetail.jsx";
import ShippingMethods from "./pages/ShippingMethods.jsx";
import ShopProfileDetail from "./pages/ShopProfileDetail.jsx";
import ShopsPage from "./pages/ShopsPage.jsx";

import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import ShopDetailStatistic from "./pages/ShopDetailStatistic.jsx";
import ShopRevenueDetail from "./pages/ShopRevenueDetail.jsx";
import ShopsRevenuePage from "./pages/ShopsRevenuePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import UserDetailPage from "./pages/ui-customer-detail/UserDetailPage.jsx";
import { Button } from "@mantine/core";
import BannerList from "./pages/BannerList.jsx";
import BannerDetail from "./pages/BannerDetail.jsx";

const theme = createTheme({
    colors: {
        // cGreen = custom green
        cGreen: [
            "#e8f5e9",
            "#c8e6c9",
            "#a5d6a7",
            "#81c784",
            "#4caf50",
            "#1DB954",
            "#18a74d",
            "#12813a",
            "#0c5b27",
            "#063214",
        ],
    },
    primaryColor: "cGreen",
    components: {
        Button: Button.extend({
            defaultProps: {
                radius: "xl",
            },
        }),
    },
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
                element: <MainPage />,
            },
            {
                path: "/main/shops",
                element: <ShopsPage />,
            },
            {
                path: "/main/shops-revenue",
                element: <ShopsRevenuePage />,
            },
            {
                path: "/main/shops-revenue/:id",
                element: <ShopRevenueDetail />,
            },
            {
                path: "/main/shops-revenue/:id/:id",
                element: <OrderDetailPage />,
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
                path: "/main/shop/:id/statistic",
                element: <ShopDetailStatistic />,
            },
            {
                path: "/main/shop/:id/product/:pid",
                element: <ProductDetailPage />,
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
                path: "/main/ordermanagement",
                element: <OrderManagement />,
            },
            {
                path: "/main/orderdetail/:id",
                element: <OrderDetail />,
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
                path: "/main/profile",
                element: <AccountProfile />,
            },
            {
                path: "/main/shipping-methods",
                element: <ShippingMethods />,
            },
            {
                path: "/main/shipping-methods/:id",
                element: <ShippingMethodDetail />,
            },
            {
                path: "/main/shipping-methods/new",
                element: <NewShippingMethod />,
            },
            {
                path: "/main/shipping-methods/demo",
                element: <DemoShippingMethod />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
            {
                path: "/main/banners",
                element: <BannerList />,
            },
            {
                path: "/main/banners/:id",
                element: <BannerDetail />,
            }
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
                <ModalsProvider>

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
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    </StrictMode>,
);