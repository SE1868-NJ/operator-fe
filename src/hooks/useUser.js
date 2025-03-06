import { useQuery } from "@tanstack/react-query";
import { User } from "iconsax-react";
import UserService from "../services/UserService";

export const useUsers = (page, whereCondition) => {
    return useQuery({
        queryKey: ["users", page, whereCondition],
        queryFn: () => UserService.getAllUsers(page, whereCondition),
    });
};

export const useUserById = (id) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => UserService.getUserById(id),
    });
};

export const useExportUsers = (page, whereCondition) => {
    return useQuery({
        queryKey: ["exportUsers", page, whereCondition],
        queryFn: () => UserService.getAllUsers(page, whereCondition, 9999),
    });
};

export const useUserOrder = (id, page) => {
    return useQuery({
        queryKey: ["orderList", page],
        queryFn: () => UserService.getOrderList(id, page),
    });
};

export const useUserOrderRecent4Month = (id) => {
    return useQuery({
        queryKey: ["orderBar"],
        queryFn: () => UserService.getOrderRecent4Months(id),
    });
};

export const useGetTop3Customer = () => {
    return useQuery({
        queryKey: ["top3"],
        queryFn: () => UserService.getTop3Customer(),
    });
};
