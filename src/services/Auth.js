import { jwtDecode } from "jwt-decode";
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
    async logout() {
        localStorage.removeItem("token");
    },
    async changePassword(userId, password, newPassword) {
        const data = authInstance.post("/users/changePassword/operator").then(({ data }) => {
            return data;
        });
        return data;
    },
    async getAccountInfo() {
        const token = localStorage.getItem("token");
        console.log(token);
        const operatorData = jwtDecode(token);
        const { email } = operatorData.email;

        console.log(email);

        const accontInfo = authInstance.get("/users/getUserByEmail", { email }).then(({ data }) => {
            return data;
        });

        console.log(accontInfo);
    },
};

export default AuthService;

//AuthService.getAccountInfo()
