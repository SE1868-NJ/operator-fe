import moment from "moment-timezone";
import { instance } from "../lib/axios";

const BanService = {
    async banUser({ userId, operatorId, userType, reason, banStart, banEnd }) {
        console.log(userId, operatorId, userType, reason, banStart, banEnd);
        const banData = await instance
            .post("/ban/", {
                userId,
                operatorId,
                userType,
                reason,
                banStart,
                banEnd,
            })
            .then(({ data }) => {
                return data.data;
            })
            .catch((err) => {
                console.error(err);
            });

        return banData;
    },

    async unbanAccountManually(userId, userType, reason = "") {
        const unbanData = await instance
            .post("/ban/unban", {
                userId,
                userType,
            })
            .then(({ data }) => data.data)
            .catch((err) => {
                console.error(err);
            });
        return unbanData;
    },
    async cancelBanScheduled(userId, userType, reason = "") {
        const cancelBanScheduledData = await instance
            .post("/ban/unban-scheduled", {
                userId,
                userType,
            })
            .then(({ data }) => data.data)
            .catch((err) => {
                console.error(err);
            });
        return cancelBanScheduledData;
    },
    async getBanAccount(userId, userType) {
        const banAccount = await instance
            .get("/ban/", {
                params: { userId, userType },
            })
            .then(({ data }) => data.data)
            .catch((err) => {
                console.error(err);
            });

        if (banAccount.data) {
            const banStart = banAccount.data.banStart;
            const banEnd = banAccount.data.banEnd;
            banAccount.data.banStart = moment
                .utc(banStart)
                .tz("Asia/Ho_Chi_Minh")
                .format("YYYY-MM-DD HH:mm:ss");
            banAccount.data.banEnd = moment
                .utc(banEnd)
                .tz("Asia/Ho_Chi_Minh")
                .format("YYYY-MM-DD HH:mm:ss");
        }

        return banAccount.data;
    },
};

export default BanService;
