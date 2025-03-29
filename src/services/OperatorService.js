import { notifications } from "@mantine/notifications";
import { jwtDecode } from "jwt-decode";
import { authInstance, instance } from "../lib/axios";

const OperatorService = {
    async getAccountProfile() {
        const email = this.decodeToken();
        const data = await instance
            .get("/operator/profile", {
                params: { email },
            })
            .then(({ data }) => data.data)
            .catch((err) => console.error(err));

        return data.data;
    },

    async updateAccountProfile(formData) {
        const data = await instance
            .post("/operator/profile/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(({ data }) => data)
            .catch((err) => {
                console.error(err);
                notifications.show({
                    title: "Lỗi!",
                    message: err.message,
                    color: "red",
                });
                return null;
            });

        return data;
    },

    decodeToken() {
        try {
            const token = localStorage.getItem("token");

            const data = jwtDecode(token);

            const { email } = data;

            return email;
        } catch (error) {
            console.error(error);
        }
    },
    async changePassword(password, newPassword) {
        const accountInfo = await this.getAccountProfile();
        console.log("accountInfo: ", accountInfo);

        const data = authInstance
            .post("/users/changePassword/operator", {
                userId: accountInfo.operatorID,
                password,
                newPassword,
            })
            .then(({ data }) => {
                return data;
            })
            .catch((err) => console.error(err));
        return data;
    },
};

export default OperatorService;
