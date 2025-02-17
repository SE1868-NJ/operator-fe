import { instance } from "../lib/axios";

const NotifServices = {
    async getNotifications() {
        const notifs = await instance.get("/notification").then(({ data }) => data.data);
        return notifs;
    },
};

export default NotifServices;
