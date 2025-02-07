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
    { label: "Dashboard", icon: IconGauge, link: "/products/test" },
    {
        label: "Market news",
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: "Overview", link: "/a" },
            { label: "Forecasts", link: "/b" },
            { label: "Outlook", link: "/c" },
            { label: "Real time", link: "/d" },
        ],
    },
    {
        label: "Releases",
        icon: IconCalendarStats,
        links: [
            { label: "Upcoming releases", link: "/" },
            { label: "Previous releases", link: "/" },
            { label: "Releases schedule", link: "/" },
        ],
    },
    { label: "Analytics", icon: IconPresentationAnalytics },
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
];
