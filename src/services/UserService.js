import { instance } from "../lib/axios.js";
const UserService = {
    async getAllUsers(page = 1, whereCondition = "", limit = 10) {
        console.log(whereCondition);

        const query = `page=${page}&limit=${limit}&${whereCondition}`;

        const users = await instance.get(`/user?${query}`).then(({ data }) => data.data);

        console.log(users);

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
};

export default UserService;
