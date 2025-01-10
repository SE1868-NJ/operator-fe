import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="p-5">
            <Outlet />
        </div>
    );
};

export default Layout;
