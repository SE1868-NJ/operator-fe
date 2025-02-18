import { instance } from "../lib/axios";
const ReportServices = {
    async getReports({ page = 0, limit, search, report_type, status }) {
        status = status === "all" ? "" : status;
        report_type = report_type === "all" ? "" : report_type;

        const reports = await instance
            .get("/reports", {
                params: {
                    page,
                    limit,
                    search,
                    report_type,
                    status,
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
