import { instance } from "../lib/axios";

const ReportCategoriesServices = {
    /**
     * Get all report categories with pagination & filtering
     * @param {Object} params - { page, limit, name }
     */
    async getAllCategories(params = {}) {
        const categories = await instance
            .get("/report_categories", { params })
            .then(({ data }) => data);
        return categories;
    },

    /**
     * Get a single report category by ID
     * @param {string} id - Category ID
     */
    async getCategoryById(id) {
        const category = await instance
            .get(`/report_categories/${id}`)
            .then(({ data }) => data.data);
        return category;
    },

    /**
     * Create a new report category
     * @param {Object} categoryData - { name, description }
     */
    async createCategory(categoryData) {
        const category = await instance
            .post("/report_categories", categoryData)
            .then(({ data }) => data.data);
        return category;
    },

    /**
     * Update an existing report category
     * @param {string} id - Category ID
     * @param {Object} updateData - Updated category fields
     */
    async updateCategory(id, updateData) {
        const updatedCategory = await instance
            .put(`/report_categories/${id}`, updateData)
            .then(({ data }) => data.data);
        return updatedCategory;
    },

    /**
     * Delete a report category
     * @param {string} id - Category ID
     */
    async deleteCategory(id) {
        const deleted = await instance
            .delete(`/report_categories/${id}`)
            .then(({ data }) => data.success);
        return deleted;
    },
};

export default ReportCategoriesServices;
