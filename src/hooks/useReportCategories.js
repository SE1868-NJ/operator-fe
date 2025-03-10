import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReportCategoriesServices from "../services/ReportCategoryServices";

/**
 * Get all report categories with pagination & filtering
 * @param {Object} params - { page, limit, name }
 */
export const useReportCategories = (params) => {
    return useQuery({
        queryKey: ["reportCategories", params],
        queryFn: () => ReportCategoriesServices.getAllCategories(params),
        keepPreviousData: true, // Useful for pagination
    });
};

/**
 * Get a single report category by ID
 * @param {string} id - Category ID
 */
export const useReportCategory = (id) => {
    return useQuery({
        queryKey: ["reportCategory", id],
        queryFn: () => ReportCategoriesServices.getCategoryById(id),
        enabled: !!id, // Prevents unnecessary queries
    });
};

// 🔽 Mutations 🔽
const useMutationOptions = (queryClient) => ({
    onSuccess: () => {
        queryClient.invalidateQueries(["reportCategories"]); // Refresh list after mutation
    },
});

/**
 * Create a new report category
 */
export const useCreateReportCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ReportCategoriesServices.createCategory,
        ...useMutationOptions(queryClient),
    });
};

/**
 * Update an existing report category
 */
export const useUpdateReportCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => ReportCategoriesServices.updateCategory(id, data),
        ...useMutationOptions(queryClient),
    });
};

/**
 * Delete a report category
 */
export const useDeleteReportCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ReportCategoriesServices.deleteCategory,
        ...useMutationOptions(queryClient),
    });
};
