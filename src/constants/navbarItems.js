import { IconSettings } from "@tabler/icons-react";
import { IconReport } from "@tabler/icons-react";
import {
    IconCalendarStats,
    IconGauge,
    IconNotes,
    IconPresentationAnalytics,
} from "@tabler/icons-react";

export const NAVBAR_ITEMS = [
    { label: "Trang chủ", icon: IconGauge, link: "/main" },
    {
        label: "Cửa hàng",
        icon: IconNotes,
        links: [
            { label: "Danh sách tất cả cửa hàng", link: "/main/shops" },
            { label: "Cửa hàng đang duyệt", link: "/main/pendingshops/" },
            { label: "Thống kê doanh thu", link: "/main/shops-revenue" },
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
        link: "/main/ordermanagement",
    },
    { label: "Người dùng", icon: IconPresentationAnalytics, link: "/main/users" },

    {
        label: "Khiếu nại",
        icon: IconReport,
        links: [
            { label: "Tất cả khiếu nại", link: "/main/reports" },
            { label: "Danh mục khiếu nại", link: "/main/report-categories" },
        ],
    },
    {
        label: "Cài đặt",
        icon: IconSettings,
        links: [
            { label: "Phương thức vận chuyển", link: "/main/shipping-methods" },
        ],
    },
    {
        label: "Quản lý banner",
        icon: IconNotes,
        links: [
            { label: "Danh sách tất cả banner", link: "/main/banners" }
        ],
    }
];
