import { useState } from "react";
import { useEffect } from "react";
import AuthService from "../services/Auth";

export const useCurrentUser = () => {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AuthService.getSession()
            .then((res) => {
                setIsLoading(false);
                setSession(res);
                setError(false);
                return res;
            })
            .catch((err) => {
                setIsLoading(false);
                setError(true);
                console.log(err);
            });
    }, []);
    return { session, error, isLoading };
};
