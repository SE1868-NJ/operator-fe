import { useQuery } from "@tanstack/react-query";
import NotifServices from "../services/NotifServices";

export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: () => NotifServices.getNotifications(),
    });
};
