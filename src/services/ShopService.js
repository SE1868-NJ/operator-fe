import instance from "../lib/axios";

const ShopService = {
    async getAllShops() {
        const shops = await instance.get("/shops").then(({ data }) => {
            return data?.shops;
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
};

export default ShopService;
