import { instance } from "../lib/axios";

const ShopService = {
    async getAllShops() {
        const shops = await instance.get("/shops").then(({ data }) => {
            return data?.shops;
        });
        return shops;
    },
    async getPendingShops() {
        const shops = await instance
            .get("/shops/pendingshops")
            .then(({ data }) => {
                return data;
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
};

export default ShopService;
