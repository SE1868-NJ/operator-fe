import { useQuery } from "@tanstack/react-query";
import OperatorService from "../services/OperatorService.js";

export const useAccountProfile = () => {
    return useQuery({
        queryKey: ["accountProfile"],
        queryFn: () => OperatorService.getAccountProfile(),
    });
};
