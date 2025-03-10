import { instance } from "../lib/axios";

const ShippingMethodService = {
    async create(data) {
        await instance.post("/shipping-methods/create", data);
    },
    async getAll() {
        const shippingMethods = await instance
            .get("/shipping-methods")
            .then(({ data: { data } }) => {
                return data;
            });

        return shippingMethods;
    },
    async updateStatus(id, status) {
        await instance.patch(`/shipping-methods/${id}`, {
            status,
        });
    },
    async delete(id) {
        await instance.delete(`/shipping-methods/${id}`);
    },
    async getById(id, city = "Hanoi") {
        const method = await instance
            .get(`/shipping-methods/${id}?city=${city}`)
            .then(({ data: { data } }) => data);
        return method;
    },
};

export default ShippingMethodService;
