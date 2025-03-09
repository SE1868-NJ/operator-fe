import { instance } from "../lib/axios";

const ShopService = {
    async getAllShops(offset, limit, filterData = {}) {
        const { shopName, ownerName, shopEmail, shopPhone, shopStatus } = filterData;
        const shops = await instance
            .get("/shops", {
                params: {
                    offset,
                    limit,
                    shopName,
                    ownerName,
                    shopEmail,
                    shopPhone,
                    shopStatus,
                }, // Sử dụng params để truyền query params
            })
            .then(({ data }) => {
                console.log(data?.data);
                return data?.data;
            });
        return shops;
    },
    async getPendingShops(limit = 10, page = 1, filterData = {}) {
        const offset = (page - 1) * limit;
        const { shopName, ownerName, shopEmail, shopPhone } = filterData;

        const shops = await instance
            .get("/shops/pendingshops", {
                params: {
                    offset,
                    limit,
                    shopName,
                    ownerName,
                    shopEmail,
                    shopPhone,
                },
            })
            .then(({ data }) => {
                return data.data;
            })
            .catch((err) => {
                console.error(err);
            });

        return shops;
    },
    async getOneShop(id) {
        const shop = await instance.get(`/shops/${id}`).then(({ data }) => {
            return data?.shop;
        });
        return shop;
    },
    // async updateShopStatus(id, status) {
    //     const updatedShop = await instance.put(`/shops/${id}/status`, { status }).then(({ data }) => {
    //         return data?.shop;
    //     });
    //     return updatedShop;
    // },
    async getOnePendingShop(id) {
        const shop = await instance
            .get(`/shops/pendingshop/${id}`)
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
        return shop;
    },
    async updatePendingShop(data) {
        const shop = await instance
            .patch(`/shops/pendingshop/${data.id}`, data)
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
        return shop;
    },
    async updateShopStatus(data) {
        const shop = await instance
            .patch(`/shops/${data.id}`, data)
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
        return shop;
    },
    async getApprovedShops(limit = 10, page = 1, filterData = {}) {
        const offset = (page - 1) * limit;
        const { shopName, ownerName, shopEmail, shopPhone } = filterData;
        const data = {
            params: {
                offset,
                limit,
                shopName,
                ownerName,
                shopEmail,
                shopPhone,
            },
        };
        const approvedShops = await instance.get("/shops/approvedshops", data).then(({ data }) => {
            return data?.data;
        });
        return approvedShops;
    },

    async getAllShopsRevenues(day, month, year = 2025, limit = 10, page = 1, filterData = {}) {
        const offset = (page - 1) * limit;
        const { shopName, ownerName, shopEmail, shopPhone } = filterData;
        const data = {
            params: {
                year,
                month,
                day,
                offset,
                limit,
                shopName,
                ownerName,
                shopEmail,
                shopPhone,
            },
        };
        const approvedShops = await instance.get("/shops/revenues", data).then(({ data }) => {
            return data?.data;
        });
        return approvedShops;
    },

    async getOneShopRevenue(id, day, month, year = 2025, limit = 10, page = 1, filterData = {}) {
        const offset = (page - 1) * limit;
        const { shipperName, customerName } = filterData;
        const data = {
            params: {
                id,
                year,
                month,
                day,
                offset,
                limit,
                shipperName,
                customerName,
            },
        };
        const shopOrders = await instance.get(`/shops/revenues/:${id}`, data).then(({ data }) => {
            return data?.revenue;
        });
        return shopOrders;
    },

    async getRevenuesAllShopLastTime(distanceTime = "day") {
        const data = {
            params: {
                distanceTime,
            },
        };
        const revenues = await instance
            .get("/shops/totalrevenues", data)
            .then(({ data }) => {
                return data?.totalRevenues;
            })
            .catch((err) => {
                console.error(err);
            });
        return revenues;
    },

    async getRevenuesOneShopLastTime(id, distanceTime = "day") {
        const data = {
            params: {
                id,
                distanceTime,
            },
        };
        const revenues = await instance
            .get(`/shops/totalrevenues/${id}`, data)
            .then(({ data }) => {
                return data?.totalRevenues;
            })
            .catch((err) => {
                console.error(err);
            });
        return revenues;
    },

    async getOneOrder(id) {
        const order = await instance
            .get(`/shops/orders/${id}`)
            .then(({ data }) => {
                return data?.order;
            })
            .catch((err) => {
                console.error(err);
            });
        return order;
    },

    async getAllShopsChartData(rangeTime = "DAY") {
        const data = {
            params: { distanceTime: rangeTime },
        };
        const dataForChart = await instance
            .get("/shops/shopstatistic", data)
            .then(({ data }) => {
                return data?.revenues?.revenues;
            })
            .catch((err) => {
                console.log(err);
            });
        return dataForChart;
    },
};

export default ShopService;
