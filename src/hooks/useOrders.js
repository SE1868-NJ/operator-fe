// ./hooks/useOrders.js
import { useQuery } from "@tanstack/react-query";
import OrderServices from "../services/OrderServices";

export const useOrders = (offset, limit, filterData) => {
    return useQuery({
        queryKey: ["orders", offset, limit, filterData],
        queryFn: () => OrderServices.getAllOrders(offset, limit, filterData),
    });
};

export const useOrder = (id) => {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => OrderServices.getOneOrder(id),
    });
};
