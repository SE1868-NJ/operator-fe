import instance from "../lib/axios.js";

const UserService = {
    async getAllUsers(page = 1, limit = 10) {
        const users = await instance
            .get(`/user?page=${page}&limit=${limit}`)
            .then(({ data }) => data.data);
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
};

export default UserService;
