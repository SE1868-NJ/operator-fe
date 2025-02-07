const ShopService = {
    async getAllShops() {
        // const shops = await instance.get("/shops").then(({ data }) => {
        //     return data
        // })
        const shops = await fetch("https://api.artic.edu/api/v1/artworks", {
            method: "GET",
        })
            .then((res) => res.json())
            .then(({ data }) => data);

        return shops;
    },
};

export default ShopService;
