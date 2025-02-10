import { useQuery } from "@tanstack/react-query";
import ShopService from "../services/ShopService";

export const useShops = () => {
    return useQuery({
        queryKey: ["shops"],
        queryFn: () => ShopService.getAllShops(),
    });
};

export const usePendingShops = () => {
    return useQuery({
        queryKey: ["pendingShops"],
        queryFn: () => ShopService.getPendingShops(),
    });
};

export const useOnePendingShop = (id) => {
    return useQuery({
        queryKey: ["onePendingShop", id],
        queryFn: () => ShopService.getOnePendingShop(id),
    });
};
