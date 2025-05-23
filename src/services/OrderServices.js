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

    // async getAllOrders(offset, limit) {
    //     const data = await instance
    //         .get("/orders", {
    //             params: {
    //                 offset,
    //                 limit,
    //             },
    //         })
    //         .then(({ data }) => data?.data);

    //     return data;
    // },

    async getAllOrders(offset, limit, filterData = {}) {
        const { Status, PaymentStatus, ShippingStatus } = filterData;
        const data = await instance
            .get("/orders", {
                params: {
                    offset,
                    limit,
                    Status,
                    PaymentStatus,
                    ShippingStatus,
                }, // Sử dụng params để truyền query params
            })
            .then(({ data }) => {
                console.log(data?.data);
                return data?.data;
            });
        return data;
    },

    async getOneOrder(id) {
        const data = await instance.get(`/orders/${id}`).then(({ data }) => data?.data);

        return data;
    },

    async cancelOrder(id) {
        const data = await instance.patch(`/orders/cancelorder/${id}`).then(({ data }) => data);
        return data;
    },

    async reopenOrder(id) {
        const data = await instance.patch(`/orders/reopenorder/${id}`).then(({ data }) => data);
        return data;
    },
    async completedOrdersComparsion(){
        const data = await instance.get("/orders/completedOrders").then(({data}) => data.data).catch((err) => console.error(err));
        return data;
    },
    async getTotalRevenueChange(){
        const data = await instance.get("/orders/totalRevenueChange").then(({data})=> data.data).catch((err) => console.error(err));
        return data;
    },
    async getTotalSummaryChart(interval = "month"){
        const data = await instance.get(`/orders/totalChart/${interval}`).then(({data})=> data.data).catch((err) => console.error(err));
        return data;
    }
    
};

export default OrderServices;
