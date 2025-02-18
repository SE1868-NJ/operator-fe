import { useQuery } from "@tanstack/react-query";
import ShipperServices from "../services/ShipperServices";

export const useShippers = (offset, limit, search, status) => {
    console.log("Offset: ", offset);
    return useQuery({
        queryKey: ["shippers", offset, limit, search, status],
        queryFn: () => ShipperServices.getAllShippers(offset, limit, search, status),
    });
};

export const useShipper = (id) => {
    return useQuery({
        queryKey: ["shippers", id],
        queryFn: () => ShipperServices.getOneShipper(id),
    });
};

export const usePendingShippers = () => {
    return useQuery({
        queryKey: ["shippers", "pending"],
        queryFn: () => ShipperServices.getAllPendingShippers(),
    });
};

export const usePendingShipper = (id) => {
    return useQuery({
        queryKey: ["shippers", "pending", id],
        queryFn: () => ShipperServices.getOnePendingShipper(id),
    });
};
