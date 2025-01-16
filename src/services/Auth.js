import instance from "../lib/axios";

const AuthService = {
    async login(email, password) {
        const token = await instance
            .post("/auth/login", {
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
        const payload = instance.get("/auth/session").then(({ data }) => {
            return data;
        });
        return payload;
    },
};

export default AuthService;
