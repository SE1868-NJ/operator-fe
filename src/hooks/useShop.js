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

export const useExportShops = (page, limit, filterData) => {
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["shops", page, limit, filterData],
        queryFn: () => ShopService.getAllShops(offset, limit, filterData),
    });
};

export const useShop = (id) => {
    return useQuery({
        queryKey: ["shop", id], // Thay đổi queryKey
        queryFn: () => ShopService.getOneShop(id), // Thay đổi queryFn
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useShopOrders = (id, offset, limit) => {
    return useQuery({
        queryKey: ["shopOrders", id, offset, limit],
        queryFn: () => ShopService.getOrderByShopId(id, offset, limit),
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useExportShopOrders = (id, offset, limit) => {
    return useQuery({
        queryKey: ["shopOrders", id, offset, limit],
        queryFn: () => ShopService.getOrderByShopId(id, offset, limit),
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useShopProducts = (id, offset, limit, filterData) => {
    return useQuery({
        queryKey: ["shopProducts", id, offset, limit, filterData],
        queryFn: () => ShopService.getProductsByShopId(id, offset, limit, filterData),
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useExportShopProducts = (id, offset, limit, filterData) => {
    return useQuery({
        queryKey: ["shopProducts", id, offset, limit, filterData],
        queryFn: () => ShopService.getProductsByShopId(id, offset, limit, filterData),
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
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

export const getTopShippers = () => {
    return useQuery({
        queryKey: ["topShippers"],
        queryFn: () => ShopService.getTopShippers(),
    });
};
