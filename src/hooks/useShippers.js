//./components/hooks/useShipper.js
import { useQuery } from "@tanstack/react-query";
import ShipperServices from "../services/ShipperServices";

export const useShippers = (offset, limit, filterData) => {
    const { search, filterStatus, filterDate } = filterData;

    return useQuery({
        queryKey: ["shippers", offset, limit, search, filterStatus, filterDate],
        queryFn: () => ShipperServices.getAllShippers(offset, limit, search, filterStatus, filterDate),
        keepPreviousData: true,
    });
};

export const useShippersExport = (offset, limit, filterData) => {
    const { search, filterStatus, filterDate } = filterData;

    return useQuery({
        queryKey: ["shippers", offset, limit, search, filterStatus, filterDate],
        queryFn: () => ShipperServices.getAllShippers(offset, limit, search, filterStatus, filterDate),
        keepPreviousData: true,
    });
};

export const useShipper = (id) => {
    return useQuery({
        queryKey: ["shipper", id],
        queryFn: () => ShipperServices.getOneShipper(id),
    });
};

export const usePendingShippers = (limit, page) => {
    return useQuery({
        queryKey: ["shippers", limit, page],
        queryFn: () => ShipperServices.getAllPendingShippers(limit, page),
    });
};

export const usePendingShipper = (id) => {
    return useQuery({
        queryKey: ["pendingShippers", id],
        queryFn: () => ShipperServices.getOnePendingShipper(id),
    });
};

export const useTotalShippingFeeAllShippers = (offset, limit, filterData) => {
    const { search, filterStatus, filterDate } = filterData;
    return useQuery({
        queryKey: ["totalShippingFee", offset, limit, search, filterStatus, filterDate],
        queryFn: () =>
            ShipperServices.getSumShippingFeeAllShippers(
                offset,
                limit,
                search,
                filterStatus,
                filterDate,
            ),
        keepPreviousData: true,
    });
};

export const useOrdersOfShipper = (id, statusFilter, shippingStatusFilter) => {
    return useQuery({
        queryKey: ["ordersOfShipper", id, statusFilter, shippingStatusFilter],
        queryFn: () => ShipperServices.getOrdersOfShipper(id, { status: statusFilter, shipping_status: shippingStatusFilter }),
        keepPreviousData: true,
    });
};

export const useGetTopShippers = () => {
    return useQuery({
        queryKey: ["topShippers"],
        queryFn: () => ShipperServices.getTopShippers(),
    });
};

export const useGetTop10Shippers = () => {
    return useQuery({
        queryKey: ["top10Shippers"],
        queryFn: () => ShipperServices.getTop10Shippers(),
    });
};

export const useGetDraftShipper = (id) => {
    return useQuery({
        queryKey: ["getDraftShipper", id],
        queryFn: () => ShipperServices.getPendingShipperDraft(id),
    });
};

export const useGetActiveShipperCount = () => {
    return useQuery({
        queryKey: ["countActive"],
        queryFn: () => ShipperServices.getActiveShipperCount(),
    });
};

export const useGetShippersJoinedToday = () => {
    return useQuery({
        queryKey: ["countJoinedToday"],
        queryFn: () => ShipperServices.getShippersJoinedToday(),
    });
};
