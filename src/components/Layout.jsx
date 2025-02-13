import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useNavbarStore } from "../stores/NavbarStore";
import AuthWrapper from "./AuthWrapper";
import { NavbarNested } from "./layout/NavbarNested/NavbarNested";

const Layout = () => {
    const { isOpen } = useNavbarStore();

    return (
        <AuthWrapper>
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
        </AuthWrapper>
    );
};

export default Layout;
