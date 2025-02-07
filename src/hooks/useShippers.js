import { useQuery } from "@tanstack/react-query";
import ShipperServices from "../services/ShipperServices";

export const useShippers = () => {
    return useQuery({
        queryKey: ["shippers"],
        queryFn: () => ShipperServices.getAllShippers(),
    });
};
