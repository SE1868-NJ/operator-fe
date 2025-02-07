import instance from "../lib/axios";

const ShopService = {
    async getAllShops() {
        const shops = await instance.get("/shops").then(({ data }) => {
            return data;
        });

        return shops;
    },
    async getOneShop(id) {
        const shop = await instance.get(`/shops/${id}`).then(({ data }) => {
            return data;
        });
        return shop;
    },
};

export default ShopService;
