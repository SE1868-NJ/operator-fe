import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/UserStore";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useUserStore();
    const navigate = useNavigate();
    //  if not auth, navigate to login page
    if (!isAuthenticated) navigate("/");

    return children;
};

export default ProtectedRoute;
