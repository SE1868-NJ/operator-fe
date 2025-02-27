import { authInstance } from "../lib/axios";

const AuthService = {
    async login(email, password) {
        const token = await authInstance
            .post("/auth/login/operator", {
                email,
                password,
            })
            .then(({ data }) => {
                localStorage.setItem("token", data.token);
                return data;
            });
        return token;
    },
    async getSession() {
        const payload = authInstance.get("/auth/session").then(({ data }) => {
            return data;
        });
        return payload;
    },
};

export default AuthService;
