import { instance } from "../lib/axios";

const ShipperServices = {
    async getAllShippers(offset, limit, search, status) {
        const params = { offset, limit };
        if (search) params.search = search;
        if (status) params.status = status;

        const shippers = await instance.get("/shippers", { params }).then(({ data }) => data);

        return shippers;
    },

    async getOneShipper(id) {
        const shippers = await instance.get(`/shippers/${id}`).then(({ data }) => {
            return data;
        });

        return shippers;
    },
    async getAllPendingShippers(limit = 10, page = 1) {
        const offset = limit * (page - 1);
        const shippers = await instance
            .get("/shippers/pendingShippers", { params: { offset, limit } })
            .then((data) => {
                return data?.data?.data;
            });

        return shippers;
    },
    async getOnePendingShipper(id) {
        const shippers = await instance.get(`/shippers/pendingShipper/${id}`).then(({ data }) => {
            return data;
        });

        return shippers;
    },
};

export default ShipperServices;
