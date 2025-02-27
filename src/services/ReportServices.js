import { instance } from "../lib/axios";
const ReportServices = {
    async getReports({ page = 0, limit, search, report_type, status, category_id, priority }) {
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
                },
            })
            .then(({ data }) => data);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        return reports;
    },
    async getReport(id) {
        console.log(id);
        const report = await instance.get(`/reports/${id}`).then(({ data }) => data);
        console.log(report);
        return report;
    },
};

export default ReportServices;
