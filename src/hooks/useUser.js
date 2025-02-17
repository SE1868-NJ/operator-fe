import { useQuery } from "@tanstack/react-query";
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
