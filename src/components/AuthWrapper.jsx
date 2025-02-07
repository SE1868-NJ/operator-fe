import PropTypes from "prop-types";
import { useEffect } from "react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

const AuthWrapper = ({ children }) => {
    // get session using useCurrentUser hook
    const { session, isLoading } = useCurrentUser();

    // useNavigate hook to navigate page
    const navigate = useNavigate();

    // Redirect to the home page if user is not authenticated
    // useEffect(() => {
    //     if (!isLoading && !session) {
    //         console.warn("Unauthorized access attempt detected. Redirecting to login page...");
    //         // navigate("/");
    //     }
    // }, [session, isLoading, navigate]);

    // Render children only if session exists
    if (!session) return null;

    return children;
};

// Validate prop types
AuthWrapper.propTypes = {
    children: PropTypes.node, // Accept any renderable node as children
};

// Default props
AuthWrapper.defaultProps = {
    children: null,
};

export default memo(AuthWrapper);
