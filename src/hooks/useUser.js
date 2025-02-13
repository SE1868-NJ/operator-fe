import { useQuery } from "@tanstack/react-query";
import UserService from "../services/UserService";

export const useUsers = (page) => {
    return useQuery({
        queryKey: ["users", page],
        queryFn: () => UserService.getAllUsers(page),
    });
};

export const useUserById = (id) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => UserService.getUserById(id),
    });
};
