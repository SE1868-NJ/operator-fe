import { jwtDecode } from "jwt-decode";
import { instance } from "../lib/axios";

const OperatorService = {
    async getAccountProfile() {
        const email = this.decodeToken();
        console.log("email in getAccountProfile function ", email);
        const data = await instance
            .get("/operator/profile", {
                params: { email },
            })
            .then(({ data }) => data.data)
            .catch((err) => console.error(err));

        return data.data;
    },

    async updateAccountProfile(dataUpdate) {
        const data = await instance
            .post("/operator/profile/update", {
                dataUpdate,
            })
            .then(({ data }) => data)
            .catch((err) => console.log(err));

        return data;
    },
    decodeToken() {
        try {
            const token = localStorage.getItem("token");
            console.log("Token: ", token);
            const data = jwtDecode(token);
            console.log("Data ", data);
            const { email } = data;
            console.log("Email after decode: ", email);
            return email;
        } catch (error) {
            console.error(error);
        }
    },
};

export default OperatorService;
