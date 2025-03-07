import { useQuery } from "@tanstack/react-query";
import ShippingMethodService from "../services/ShippingMethodService";

export const useShippingMethods = () => {
    return useQuery({
        queryFn: () => ShippingMethodService.getAll(),
        queryKey: ["shipping-methods"],
    });
};

export const useShippingMethod = (id) => {
    return useQuery({
        queryFn: () => ShippingMethodService.getById(id),
        queryKey: ["shipping-methods", id],
    });
};
