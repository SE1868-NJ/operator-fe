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
    async getOrderList(id) {
        const orders = await instance
            .get(`users/orders/${id}`)
            .then(({ data }) => data.data)
            .catch((err) => console.log(err));
        return orders;
    },
};

export default UserService;
