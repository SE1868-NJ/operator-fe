//.services/ShipperService.js
import { instance } from "../lib/axios";

const ShipperServices = {
    async getAllShippers(offset, limit, search, status) {
        const params = { offset, limit };
        if (search) params.search = search;
        if (status) params.status = status;

        const shippers = await instance
            .get("/shippers", { params })
            .then(({ data }) => data.shippers);

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

    async getSumShippingFeeAllShippers(offset, limit) {
        const sumShippingFee = await instance
            .get("/shippers/sumShippingFee", { params: { offset, limit } })
            .then(({ data }) => {
                return data?.data;
            });
        return sumShippingFee;
    },

    async getOrdersOfShipper(id) {
        const orders = await instance.get(`/shippers/ordersOfShipper/${id}`).then(({ data }) => {
            return data?.data;
        });
        return orders;
    },

    async getTopShippers() {
        const topShippers = await instance
            .get("/shippers/topShippers")
            .then(({ data }) => data?.data);
        return topShippers;
    },
};

export default ShipperServices;
