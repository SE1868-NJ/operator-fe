import PropTypes from "prop-types";
import { memo } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

const AuthWrapper = ({ children }) => {
    // get session using useCurrentUser hook
    const { session, isLoading } = useCurrentUser();

    // useNavigate hook to navigate page
    const navigate = useNavigate();

    useEffect(() => {
        // If session is null, navigate to login page
        if (!isLoading && !session) navigate("/");
    }, [session, navigate, isLoading]);

    // Render children only if session exists
    if (!session) navigate("/");

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
