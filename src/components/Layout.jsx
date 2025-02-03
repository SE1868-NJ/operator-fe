import { AppShell } from "@mantine/core";
import { People } from "iconsax-react";
import { UserEdit } from "iconsax-react";
import { ArrowLeft } from "iconsax-react";
import { ArrowRight } from "iconsax-react";
import { Logout } from "iconsax-react";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useNavbarStore } from "../stores/NavbarStore";
import AuthWrapper from "./AuthWrapper";

const navItems = [
    { link: "/main/users", label: "Users management", icon: UserEdit },
    { link: "/main/roles", label: "Roles management", icon: People },
    { link: "/main/operators", label: "Operators management", icon: People },
    { link: "/pendingshoplist", label: "Pending shop list", icon: People },
];

const Layout = () => {
    const { isOpen, toggle } = useNavbarStore();
    const [active, setActive] = useState("Users management");
    const navigate = useNavigate();

    const links = navItems.map((item) => {
        return (
            <Link
                className={`flex items-center p-3 space-x-2 active:bg-blue-200/80 text-sm rounded transition-all  mb-2 ${item.label === active ? "text-blue-500 bg-blue-100" : "hover:bg-gray-100"}`}
                to={item.link}
                key={item.label}
                onClick={() => {
                    setActive(item.label);
                }}
            >
                <item.icon className={""} stroke={1.5} />
                {isOpen && <span>{item.label}</span>}
            </Link>
        );
    });

    return (
        <AuthWrapper>
            <AppShell
                padding="md"
                navbar={{
                    breakpoint: "sm",
                    width: isOpen ? 300 : 80,
                }}
            >
                {/* Navbar */}
                <AppShell.Navbar className="h-screen p-2 relative">
                    {/* list link */}
                    <div className={""}>{links}</div>

                    {/* button toogle navbar */}
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.clear("token");
                            navigate("/");
                        }}
                        className="absolute bottom-0 flex items-center justify-center right-0 left-0 py-4 hover:bg-blue-200 space-x-3"
                    >
                        {/* {isOpen ? <ArrowLeft /> : <ArrowRight />} */}
                        <Logout /> <span>Đăng xuất</span>
                    </button>
                </AppShell.Navbar>

                {/* Main App */}
                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>
            </AppShell>
        </AuthWrapper>
    );
};

export default Layout;
