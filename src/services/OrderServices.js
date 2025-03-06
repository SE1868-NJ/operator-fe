import { instance } from "../lib/axios";

const OrderServices = {
    async getOrderStatistic(timeRange, interval) {
        const data = await instance
            .get("/orders/statistic", {
                params: { timeRange, interval },
            })
            .then(({ data }) => data);
        return data;
    },

    async getAllOrders(offset, limit) {
        const data = await instance
            .get("/orders", {
                params: {
                    offset,
                    limit,
                },
            })
            .then(({ data }) => data?.data);

        return data;
    },

    async getOneOrder(id) {
        const data = await instance.get(`/orders/${id}`).then(({ data }) => data?.data);

        return data;
    },
};

export default OrderServices;
