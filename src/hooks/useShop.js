//import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// export const useUpdateShopStatus = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ id, status }) => ShopService.updateShopStatus(id, status),
//         onSuccess: () => {
//             queryClient.invalidateQueries(["shop"]);
//         },
//     });
// };
