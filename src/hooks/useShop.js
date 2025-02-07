import { useQuery } from "@tanstack/react-query";
import ShopService from "../services/ShopService";

export const useShops = () => {
    return useQuery({
        queryKey: ["shops"],
        queryFn: () => ShopService.getAllShops(),
    });
};

export const useShop = (id) => {
    return useQuery({
        queryKey: ["shop", id],
        queryFn: () => ShopService.getOneShop(id),
    });
};
