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
};

export default ShopService;
