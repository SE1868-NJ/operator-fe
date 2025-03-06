import { instance } from "../lib/axios";
const ReportServices = {
    async getReports({
        page = 0,
        limit,
        search,
        report_type,
        status,
        category_id,
        priority,
        orderBy,
    }) {
        status = status === "all" ? "" : status;
        priority = priority === "all" ? "" : priority;
        report_type = report_type === "all" ? "" : report_type;
        category_id = category_id === "all" ? "" : category_id;

        const reports = await instance
            .get("/reports", {
                params: {
                    page,
                    limit,
                    search,
                    report_type,
                    status,
                    category_id,
                    priority,
                    orderBy,
                },
            })
            .then(({ data }) => data);

        return reports;
    },
    async getReport(id) {
        const report = await instance.get(`/reports/${id}`).then(({ data }) => data);
        return report;
    },
    async getReportStatistic(timeRange, interval) {
        const data = await instance
            .get("/reports/statistic", {
                params: { timeRange, interval },
            })
            .then(({ data }) => data);
        return data;
    },
};

export default ReportServices;
