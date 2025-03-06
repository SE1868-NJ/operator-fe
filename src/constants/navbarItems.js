import { IconReport } from "@tabler/icons-react";
import {
    IconCalendarStats,
    IconGauge,
    IconLock,
    IconNotes,
    IconPresentationAnalytics,
} from "@tabler/icons-react";

export const NAVBAR_ITEMS = [
    { label: "Trang chủ", icon: IconGauge, link: "/main" },
    {
        label: "Cửa hàng",
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: "Danh sách tất cả cửa hàng", link: "/main/shops" },
            { label: "Cửa hàng đang duyệt", link: "/main/pendingshops/" },
        ],
    },
    {
        label: "Người giao hàng",
        icon: IconCalendarStats,
        links: [
            { label: "Danh sách tất cả người giao hàng", link: "/main/shipperslist" },
            { label: "Người giao hàng đang duyệt", link: "/main/pendding-shippers" },
        ],
    },
    {
        label: "Quản lý đơn hàng",
        icon: IconNotes,
        links: [{ label: "Danh sách tất cả các đơn hàng", link: "/main/ordermanagement" }],
    },
    { label: "Người dùng", icon: IconPresentationAnalytics, link: "/main/users" },
    { label: "Khiếu nại", icon: IconReport, link: "/main/reports" },
    {
        label: "Security",
        icon: IconLock,
        links: [
            { label: "Enable 2FA", link: "/" },
            { label: "Change password", link: "/" },
            { label: "Recovery codes", link: "/" },
        ],
    },
];
