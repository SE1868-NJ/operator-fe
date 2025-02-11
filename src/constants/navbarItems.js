import {
    IconAdjustments,
    IconCalendarStats,
    IconFileAnalytics,
    IconGauge,
    IconLock,
    IconNotes,
    IconPresentationAnalytics,
} from "@tabler/icons-react";

export const NAVBAR_ITEMS = [
    { label: "Trang chủ", icon: IconGauge, link: "/products/test" },
    {
        label: "Cửa hàng",
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: "Danh sách tất cả cửa hàng", link: "/main/shops" },
            { label: "Cửa hàng đang duyệt", link: "/main/pendingshoplist/" },
            // { label: "Outlook", link: "/c" },
            // { label: "Real time", link: "/d" },
        ],
    },
    {
        label: "Người giao hàng",
        icon: IconCalendarStats,
        links: [
            { label: "Danh sách tất cả người giao hàng", link: "/main/shipperslist" },
            { label: "Người giao hàng đang duyệt", link: "/main/pendding-shippers" },
            // { label: "Releases schedule", link: "/" },
        ],
    },
    { label: "Người dùng", icon: IconPresentationAnalytics, link: "/main/users" },
    { label: "Contracts", icon: IconFileAnalytics },
    { label: "Settings", icon: IconAdjustments },
    {
        label: "Security",
        icon: IconLock,
        links: [
            { label: "Enable 2FA", link: "/" },
            { label: "Change password", link: "/" },
            { label: "Recovery codes", link: "/" },
        ],
    },
    { label: "PendingShop", icon: IconNotes, link: "pendingshops" },
];
