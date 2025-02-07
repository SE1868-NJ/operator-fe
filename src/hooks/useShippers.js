import { useQuery } from "@tanstack/react-query";
import ShipperServices from "../services/ShipperServices";

export const useShippers = () => {
    return useQuery({
        queryKey: ["shippers"],
        queryFn: () => ShipperServices.getAllShippers(),
    });
};

export const useShipper = (id) => {
    return useQuery({
        queryKey: ["shippers", id],
        queryFn: () => ShipperServices.getOneShipper(id),
    });
};
