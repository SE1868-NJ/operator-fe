import { data } from "autoprefixer";
import { instance } from "../lib/axios";

const ShipperServices = {
    async getAllShippers(offset, limit, search, status, date) {
        const params = { offset, limit, search, status, date };

        const shippers = await instance
            .get("/shippers", { 
                params: params 
            })
            .then(({ data }) => data);

        console.log("--", shippers);

        return shippers;
    },

    async getOneShipper(id) {
        const shipper = await instance.get(`/shippers/${id}`).then(({ data }) => data.shipper);
        return shipper;
    },

    async getAllPendingShippers(limit = 10, page = 1) {
        const offset = limit * (page - 1);
        const shippers = await instance
            .get("/shippers/pendingShippers", { params: { offset, limit } })
            .then(({ data }) => data?.data);

        return shippers;
    },

    async getOnePendingShipper(id) {
        const shipper = await instance.get(`/shippers/pendingShipper/${id}`).then(({ data }) => data);
        return shipper;
    },

    async getSumShippingFeeAllShippers(offset, limit, search, filterStatus, filterDate) {
        const sumShippingFee = await instance
            .get("/shippers/sumShippingFee", {
                params: { offset, limit, search, filterStatus, filterDate },
            })
            .then(({ data }) => data?.data);

        return sumShippingFee;
    },

    async getOrdersOfShipper(id, filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `/shippers/ordersOfShipper/${id}?${queryParams}`;
        const orders = await instance.get(url).then(({ data }) => data?.data);

        return orders;
    },

    async getTopShippers() {
        const topShippers = await instance.get("/shippers/topShippers").then(({ data }) => data?.data);
        return topShippers;
    },

    async getTop10Shippers() {
        const topShippers = await instance.get("/shippers/top10Shippers").then(({ data }) => data?.data);
        return topShippers;
    },

    async getPendingShipperDraft(id) {
        const draftInfo = await instance.get(`/shippers/shipperdraft/${id}`).then(({ data }) => data?.shipperDraft);
        return draftInfo;
    },

    async updatePendingShipperDraft(id, data) {
        const updatedDraft = await instance
            .patch(`/shippers/shipperdraft/${id}`, data, {
                headers: { "Content-Type": "application/json" },
            })
            .then(({ data }) => data)
            .catch((err) => console.error(err));

        return updatedDraft;
    },

    async updatePendingShipper(data) {
        const updatedShipper = await instance
            .patch(`/shippers/pendingShipper/${data.id}`, data)
            .then(({ data }) => data)
            .catch((err) => console.error(err));

        return updatedShipper;
    },

    async getActiveShipperCount() {
        const count = await instance.get("/shippers/countActive").then(({ data }) => data?.totalActiveShippers);
        return count;
    },

    async getShippersJoinedToday() {
        const count = await instance.get("/shippers/countJoinedToday").then(({ data }) => data?.totalShippersJoinedToday);
        return count;
    },
    async top5ShipperInMonth(){
        const data = await instance.get("/shippers/top5ShipperInMonth").then(({data}) => data.data).catch((err) => console.error(err.message));
        return data;
    },
    async getDeliveryTime(){
            const data = await instance.get("/shippers/avgDeliveryTime").then(({data}) => data.data).catch((err) => console.error(err));
            return data;
    },
    async getCancelOrderRate(){
        const data = await instance.get("/shippers/cancellationRate").then(({data}) => data.data).catch((err) => console.error(err));
        return data;
    }
};

export default ShipperServices;
