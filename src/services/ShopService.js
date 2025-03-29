import { instance } from "../lib/axios";

const ShopService = {
    async generateAIReview(shopId, prompt) {
        try {
            const { data } = await instance.post("/shops/process-prompt", {
                id: shopId,
                prompt,
            });
            return data.aiReview; // Trả về nhận xét từ AI
        } catch (error) {
            console.error("Lỗi khi tạo nhận xét từ AI:", error);
            return "Đã có lỗi xảy ra, vui lòng thử lại.";
        }
    },
    async getProductById(id, pid) {
        const product = await instance
            .get(`/shops/${id}/products/${pid}`, {
                params: {
                    id,
                    pid,
                },
            })
            .then(({ data }) => data);
        return product;
    },
    async getProductsByShopId(id, offset, limit, filterData) {
        const products = await instance
            .get(`/shops/${id}/products`, {
                params: {
                    offset,
                    limit,
                    productName: filterData.productName || undefined, // Tìm theo tên sản phẩm
                    minPrice: filterData.minPrice || undefined, // Lọc giá thấp nhất
                    maxPrice: filterData.maxPrice || undefined, // Lọc giá cao nhất
                },
            })
            .then(({ data }) => data);
        return products;
    },

    //Lay thong tin shop va feedback
    async getOneShop(id) {
        const shop = await instance.get(`/shops/${id}`).then(({ data }) => data);
        return shop;
    },

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

    async getOrderByShopId(id, offset = 0, limit = 5, status) {
        const data = await instance
            .get(`/shops/${id}/orders`, {
                params: { offset, limit, status },
            })
            .then(({ data }) => data);
        return data;
    },

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
    async getApprovedShops(operatorID, limit = 10, page = 1, filterData = {}) {
        const offset = (page - 1) * limit;
        const { shopName, ownerName, shopEmail, shopPhone } = filterData;
        const data = {
            params: {
                operatorID,
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
    async getOrdersStatistic(id, timeRange, interval) {
        try {
            const data = await instance
                .get(`/shops/${id}/chart`, {
                    params: { timeRange, interval },
                })
                .then(({ data }) => data);
            return data;
        } catch (error) {
            console.error("Error fetching order statistics:", error);
            return null; // Hoặc throw error nếu muốn xử lý bên ngoài
        }
    },
    async getShopRevenueStatistic(id, timeRange, interval) {
        try {
            const data = await instance
                .get(`/shops/${id}/chartRevenue`, {
                    params: { timeRange, interval },
                })
                .then(({ data }) => data);
            return data;
        } catch (error) {
            console.error("Error fetching revenue statistics:", error);
            return null; // Hoặc throw error nếu muốn xử lý bên ngoài
        }
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

    async getOneShopInfor(id) {
        const shop = await instance.get(`/shops/getinfor/${id}`).then(({ data }) => data?.shop);
        return shop;
    },

    async getPendingShopdraft(id) {
        const draftInfor = await instance
            .get(`/shops/shopdraft/${id}`)
            .then(({ data }) => data?.shopInfor);
        return draftInfor;
    },

    async updatePendingShopDraft(id, data) {
        const updatedShopDraft = await instance
            .patch(`/shops/shopdraft/${id}`, data, {
                headers: {
                    "Content-Type": "application/json", // đảm bảo đúng format
                },
            })
            .then(({ data }) => data)
            .catch((err) => {
                console.error(err);
            });
        return updatedShopDraft;
    },

    async getIndexReasonItem(id, index) {
        const reasonItems = await instance
            .get(`/shops/reasonitems/${id}`, { params: { index } })
            .then(({ data }) => data?.listItems || []);
        return reasonItems;
    },

    async updateIndexReasonItem(operator_id, id, index, reason, status) {
        const data = {
            operator_id,
            index,
            reason,
            status: status === "v" ? "accept" : "reject",
        };
        const updatedReasonItems = await instance
            .post(`/shops/reasonitems/${id}`, data)
            .then(({ data }) => data)
            .catch((err) => {
                console.error(err);
            });
        return updatedReasonItems;
    },
};

export default ShopService;
