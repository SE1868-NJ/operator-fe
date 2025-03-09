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

export const usePendingShops = (limit = 10, page = 1, filterData = {}) => {
    return useQuery({
        queryKey: ["pendingShops", limit, page, filterData],
        queryFn: () => ShopService.getPendingShops(limit, page, filterData),
    });
};

export const useOnePendingShop = (id) => {
    return useQuery({
        queryKey: ["onePendingShop", id],
        queryFn: () => ShopService.getOnePendingShop(id),
    });
};

export const useApprovedShops = (limit = 10, page = 1, filterData = {}) => {
    return useQuery({
        queryKey: ["approvedShops", limit, page, filterData],
        queryFn: () => ShopService.getApprovedShops(limit, page, filterData),
    });
};

export const useAllShopRevenues = (
    day,
    month,
    year = 2025,
    limit = 10,
    page = 1,
    filterData = {},
) => {
    return useQuery({
        queryKey: ["allShopRevenues", year, month, day, limit, page, filterData],
        queryFn: () => ShopService.getAllShopsRevenues(day, month, year, limit, page, filterData),
    });
};

export const useOneShopRevenue = (
    id,
    day,
    month,
    year = 2025,
    limit = 10,
    page = 1,
    filterData = {},
) => {
    return useQuery({
        queryKey: ["oneShopRevenue", id, year, month, day, limit, page, filterData],
        queryFn: () => ShopService.getOneShopRevenue(id, day, month, limit, year, page, filterData),
    });
};

export const useRevenuesAllShopLastTime = (distanceTime) => {
    return useQuery({
        queryKey: ["revenuesAllShopLastTime", distanceTime],
        queryFn: () => ShopService.getRevenuesAllShopLastTime(distanceTime),
    });
};

export const useRevenuesOneShopLastTime = (id, distanceTime) => {
    return useQuery({
        queryKey: ["revenuesOneShopLastTime", id, distanceTime],
        queryFn: () => ShopService.getRevenuesOneShopLastTime(id, distanceTime),
    });
};

export const useOneOrder = (id) => {
    return useQuery({
        queryKey: ["oneOrder", id],
        queryFn: () => ShopService.getOneOrder(id),
    });
};

export const useAllShopsChart = (rangeTime) => {
    return useQuery({
        queryKey: ["allShopsChart", rangeTime],
        queryFn: () => ShopService.getAllShopsChartData(rangeTime),
    });
};
