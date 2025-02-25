import { useQuery } from "@tanstack/react-query";
import ReportServices from "../services/ReportServices";

export const useReports = (params) => {
    return useQuery({
        queryKey: ["reports", params],
        queryFn: () => ReportServices.getReports(params),
        keepPreviousData: true, // Useful for pagination
    });
};

export const useReport = (id) => {
    return useQuery({
        queryKey: ["report", id],
        queryFn: () => ReportServices.getReport(id),
    });
};
