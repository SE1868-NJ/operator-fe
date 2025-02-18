//import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import ShopService from "../services/ShopService";

export const useShops = (page, limit, filterData) => {
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["shops", page, limit, filterData],
        queryFn: () => ShopService.getAllShops(offset, limit, filterData),
    });
};

export const useShop = (id) => {
    return useQuery({
        queryKey: ["shop", id],
        queryFn: () => ShopService.getOneShop(id),
    });
};

// export const useUpdateShopStatus = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ id, status }) => ShopService.updateShopStatus(id, status),
//         onSuccess: () => {
//             queryClient.invalidateQueries(["shop"]);
//         },
//     });
// };

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
