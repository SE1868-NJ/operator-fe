// ./hooks/useOrders.js
import { useQuery } from "@tanstack/react-query";
import OrderServices from "../services/OrderServices";

export const useOrders = (offset, limit) => {
    return useQuery({
        queryKey: ["orders", offset, limit],
        queryFn: () => OrderServices.getAllOrders(offset, limit),
    });
};

export const useOrder = (id) => {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => OrderServices.getOneOrder(id),
    });
};
