import { instance } from "../lib/axios"; 

const BannerServices = {
    async getAllBanners({ page = 1, size = 10, status = 'all', search = '' }) {
        try {
            const response = await instance.get("/banners", {
                params: {
                    page,
                    size,
                    status,
                    search
                }
            });
            return response.data;  
        } catch (error) {
            console.error("Error fetching banners:", error);
            throw error; 
        }
    },

    // Lấy banner theo ID
    async getBanner(id) {
        try {
            const response = await instance.get(`/banners/${id}`); 
            return response.data;  
        } catch (error) {
            console.error("Error fetching banner by ID:", error);
            throw error;  
        }
    },

    // Thêm mới banner
    async createBanner(data) {
        try {
            const response = await instance.post("/banners", data); 
            return response.data; 
        } catch (error) {
            console.error("Error creating banner:", error);
            throw error;  
        }
    },

    
    async updateBanner(id, data) {
        try {
            const response = await instance.put(`/banners/${id}`, data); 
            return response.data;  
        } catch (error) {
            console.error("Error updating banner:", error);
            throw error;  
        }
    },

    // Xóa banner theo ID
    async deleteBanner(id) {
        try {
            const response = await instance.delete(`/banners/${id}`); 
            return response.data;  
        } catch (error) {
            console.error("Error deleting banner:", error);
            throw error;  
        }
    },

    // Thay đổi trạng thái của banner
    async changeStatus(id, status) {
        try {
            const response = await instance.put(`/banners/${id}/status`, { status: status }); // API để thay đổi trạng thái của banner
            return response.data;  
        } catch (error) {
            console.error("Error changing status of banner:", error);
            throw error;  
        }
    },
};

export default BannerServices;
