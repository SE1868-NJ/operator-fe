import instance from "../lib/axios";

const ShipperServices = {
    async getAllShippers() {
        const shippers = await instance.get("/shippers").then(({ data }) => {
            return data;
        });

        return shippers;
    },
};

export default ShipperServices;
