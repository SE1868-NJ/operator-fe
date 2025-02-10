import instance from "../lib/axios";

const ShopService = {
    async getAllShops() {
        const shops = await instance
            .get("/shop")
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });
        // const shops = await fetch("https://api.artic.edu/api/v1/artworks", {
        //     method: "GET",
        // })
        //     .then((res) => res.json())
        //     .then(({ data }) => data);

        return shops;
    },
    async getPendingShops() {
        const shops = await instance
            .get("/shop/pendingshops")
            .then(({ data }) => {
                return data;
            })
            .catch((err) => {
                console.error(err);
            });

        return shops;
    },
    async getOnePendingShop(id) {
        const shop = await instance
            .get(`/shop/pendingshop/${id}`)
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
            .patch(`/shop/pendingshop/${data.id}`, data)
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
