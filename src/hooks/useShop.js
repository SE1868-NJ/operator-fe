//import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import ShopService from "../services/ShopService";

export const useShops = (page, limit, filterData) => {
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["shops", page, limit, filterData],
        queryFn: () => ShopService.getAllShops(offset, limit, filterData),
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useExportShops = (page, limit, filterData) => {
    const offset = (page - 1) * limit;
    return useQuery({
        queryKey: ["shops", page, limit, filterData],
        queryFn: () => ShopService.getAllShops(offset, limit, filterData),
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useShop = (id) => {
    return useQuery({
        queryKey: ["shop", id], // Thay đổi queryKey
        queryFn: () => ShopService.getOneShop(id), // Thay đổi queryFn
        keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang (tránh flickering)
    });
};

export const useShopOrders = (id, offset, limit, status) => {
    return useQuery({
        queryKey: ["shopOrders", id, offset, limit, status],
        queryFn: () => ShopService.getOrderByShopId(id, offset, limit, status),
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

export const useProduct = (id, pid) => {
    return useQuery({
        queryKey: ["product", id, pid],
        queryFn: () => ShopService.getProductById(id, pid),
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

export const useApprovedShops = (operatorID, limit = 10, page = 1, filterData = {}) => {
    return useQuery({
        queryKey: ["approvedShops", operatorID, limit, page, filterData],
        queryFn: () => ShopService.getApprovedShops(operatorID, limit, page, filterData),
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
        queryFn: () => ShopService.getOneShopRevenue(id, day, month, year, limit, page, filterData),
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

export const useOneShopInfor = (id) => {
    return useQuery({
        queryKey: ["oneShopInfor", id],
        queryFn: () => ShopService.getOneShopInfor(id),
    });
};

export const useGetDraftShop = (id) => {
    return useQuery({
        queryKey: ["getDraftShop", id],
        queryFn: () => ShopService.getPendingShopdraft(id),
    });
};

export const useIndexReasonItem = (id, index) => {
    return useQuery({
        queryKey: ["indexReasonItem", id, index],
        queryFn: () => ShopService.getIndexReasonItem(id, index),
    });
};
