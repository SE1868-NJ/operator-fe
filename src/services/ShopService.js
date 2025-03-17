import { instance } from "../lib/axios";

const ShopService = {
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

    async getOrderByShopId(id, offset = 0, limit = 5) {
        const data = await instance
            .get(`/shops/${id}/orders`, {
                params: { offset, limit },
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
};

export default ShopService;
