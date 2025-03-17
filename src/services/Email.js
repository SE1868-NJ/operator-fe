import { instance } from "../lib/axios";

const EmailService = {
    async sendEmail(id, subject, message) {
        try {
            const response = await instance.post("email/send-email", {
                id,
                subject,
                message,
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi gửi email:", error.response?.data || error.message);
            throw error;
        }
    },
    async sendEmailToAll(subject, message) {
        try {
            const response = await instance.post("email/send-bulk-email", {
                subject,
                message,
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi gửi email:", error.response?.data || error.message);
            throw error;
        }
    },
};

export default EmailService;
