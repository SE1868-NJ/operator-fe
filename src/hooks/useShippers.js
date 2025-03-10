//./components/hooks/useShipper.js
import { useQuery } from "@tanstack/react-query";
import ShipperServices from "../services/ShipperServices";

export const useShippers = (offset, limit, search, status) => {
    //     console.log("Offset: ", offset);
    //     console.log("Search:", search);
    // console.log("Filter Status:", status);

    return useQuery({
        queryKey: ["shippers", offset, limit, search, status],
        queryFn: () => ShipperServices.getAllShippers(offset, limit, search, status),
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

export const useTotalShippingFeeAllShippers = (offset, limit, search, filterStatus, filterDate) => {
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
    });
};

export const useOrdersOfShipper = (id) => {
    return useQuery({
        queryKey: ["ordersOfShipper", id],
        queryFn: () => ShipperServices.getOrdersOfShipper(id),
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
