import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNavbarStore } from "../stores/NavbarStore";
import { NavbarNested } from "./layout/NavbarNested/NavbarNested";

const Layout = () => {
    const { isOpen } = useNavbarStore();
    // get session using useCurrentUser hook
    const { session, isLoading } = useCurrentUser();

    // useNavigate hook to navigate page
    const navigate = useNavigate();

    useEffect(() => {
        // If session is null, navigate to login page
        if (!isLoading && !session) navigate("/");
    }, [session, navigate, isLoading]);

    return (
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
    );
};

export default Layout;
