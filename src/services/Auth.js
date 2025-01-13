import instance from "../lib/axios";

const AuthService = {
    async login(email, password) {
        await instance
            .post("/auth/login", {
                email,
                password,
            })
            .then(({ data }) => {
                localStorage.setItem("token", data.token);
                return data;
            });
    },
};

export default AuthService;
