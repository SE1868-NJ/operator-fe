import { instance } from "../lib/axios";

const ShipperServices = {
    async getAllShippers(offset, limit) {
        const shippers = await instance
            .get("/shippers", {
                params: { offset, limit },
            })
            .then(({ data }) => data);

        return shippers;
    },

    async getOneShipper(id) {
        const shippers = await instance.get(`/shippers/${id}`).then(({ data }) => {
            return data;
        });

        return shippers;
    },
    async getAllPendingShippers() {
        const shippers = await instance.get("/shippers/pending").then(({ data }) => {
            return data;
        });

        return shippers;
    },
    async getOnePendingShipper(id) {
        const shippers = await instance.get(`/shippers/pending/${id}`).then(({ data }) => {
            return data;
        });

        return shippers;
    },
};

export default ShipperServices;
