import instance from "../lib/axios";

const ShipperServices = {
    async getAllShippers() {
        const shippers = await instance.get("/shippers").then(({ data }) => {
            return data;
        });

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
