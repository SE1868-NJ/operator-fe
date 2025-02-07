import { AppShell } from "@mantine/core";
import { People } from "iconsax-react";
import { Outlet } from "react-router-dom";
import { useNavbarStore } from "../stores/NavbarStore";
import { NavbarNested } from "./layout/NavbarNested/NavbarNested";

const navItems = [
    { link: "/main/pendingshoplist", label: "Cửa hàng chờ duyệt", icon: People },
    { link: "/main/shopmanagement", label: "Quản lý tất cả cửa hàng", icon: People },
    { link: "/main/shipperslist", label: "Quản lý shippers", icon: People },
    { link: "/main/pendding-shippers", label: "Shippers chờ duyệt", icon: People },
];

const Layout = () => {
    const { isOpen, toggle } = useNavbarStore();

    return (
        // <AuthWrapper>
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !isOpen } }}
            padding="md"
            transitionDuration={500}
            transitionTimingFunction="ease"
        >
            <AppShell.Navbar>
                <NavbarNested />
            </AppShell.Navbar>
            <AppShell.Header>
                <div className="h-full flex items-center px-4">
                    <p className="text-2xl font-bold text-primary">eCMarket</p>
                </div>
            </AppShell.Header>
            {/* Main App */}
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
        // </AuthWrapper>
    );
};

export default Layout;
