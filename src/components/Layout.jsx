import { AppShell } from "@mantine/core";
import { People } from "iconsax-react";
import { UserEdit } from "iconsax-react";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const navItems = [
    { link: "/main/users", label: "Users management", icon: UserEdit },
    { link: "/main/roles", label: "Roles management", icon: People },
];

const Layout = () => {
    const [active, setActive] = useState("Users management");

    const links = navItems.map((item) => (
        <Link
            className={`flex items-center p-3 space-x-2 active:bg-blue-200/80 text-sm rounded transition-all  mb-2 ${item.label === active ? "text-blue-500 bg-blue-100" : "hover:bg-gray-100"}`}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={""} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <AppShell
            padding="md"
            navbar={{
                width: 300,
                breakpoint: "sm",
            }}
        >
            <AppShell.Navbar className="h-screen p-2">
                <div className={""}>{links}</div>
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
};

export default Layout;
