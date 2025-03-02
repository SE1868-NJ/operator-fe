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

export const useShop = (id, offset, limit) => {
    return useQuery({
        queryKey: ["shop", id, offset, limit], // ✅ Cập nhật key để cache dữ liệu từng trang
        queryFn: () => ShopService.getOneShop(id, offset, limit),
        keepPreviousData: true, // ✅ Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

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
