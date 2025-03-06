import { instance } from "../lib/axios.js";
const UserService = {
    async getAllUsers(page = 1, whereCondition = "", limit = 10) {
        const query = `page=${page}&limit=${limit}&${whereCondition}`;

        console.log(query);

        const users = await instance.get(`/user?${query}`).then(({ data }) => data.data);

        return users;
    },
    async getUserById(id) {
        const user = await instance
            .get(`/user/${id}`)
            .then(({ data }) => {
                return data.data;
            })
            .catch((err) => {
                console.error(err);
            });

        return user;
    },
    async updateUserStatus(id, newStatus) {
        const user = await instance
            .put(`/user/${id}/status`, {
                status: newStatus,
            })
            .then(({ data }) => data.data);

        return user;
    },
    async filterUser(query) {
        const users = await instance.get(`user/${query}`).then(({ data }) => data.data);
        return users;
    },

    async getOrderList(id, page = 1, limit = 5) {
        const data = await instance
            .get(`/user/orders?id=${id}&page=${page}&limit=${limit}`)
            .then(({ data }) => data.data)
            .catch((err) => console.error(err));
        console.log(data);
        return data;
    },

    async getOrderRecent4Months(id) {
        const data = await instance
            .get(`/user/orders/recent4months/${id}`)
            .then(({ data }) => data.data)
            .catch((err) => console.error(err));
        return data;
    },

    async getTop3Customer() {
        const data = await instance.get("/user/top3").then(({ data }) => data.data);
        console.log(data);
        return data;
    },
};
export default UserService;
