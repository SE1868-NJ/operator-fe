import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNavbarStore } from "../stores/NavbarStore";
import Header from "./layout/Header";
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
            transitionDuration={500}
            transitionTimingFunction="ease"
        >
            <AppShell.Navbar>
                <NavbarNested />
            </AppShell.Navbar>
            <AppShell.Header>
                <Header />
            </AppShell.Header>
            {/* Main App */}
            <AppShell.Main bg={"gray.0"}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default Layout;
