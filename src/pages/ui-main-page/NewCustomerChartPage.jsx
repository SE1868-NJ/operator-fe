import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fullData = [
    { date: "2025-03-15", newCustomers: 5 },
    { date: "2025-03-16", newCustomers: 4 },
    { date: "2025-03-17", newCustomers: 7 },
    { date: "2025-03-18", newCustomers: 6 },
    { date: "2025-03-19", newCustomers: 4 },
    { date: "2025-03-20", newCustomers: 5 },
    { date: "2025-03-21", newCustomers: 7 },
    { date: "2025-03-22", newCustomers: 3 },
    { date: "2025-03-23", newCustomers: 5 },
    { date: "2025-03-24", newCustomers: 4 },
    { date: "2025-03-25", newCustomers: 5 },
    { date: "2025-03-26", newCustomers: 2 },
];

const filterDataByTime = (timeFilter) => {
    const now = new Date();
    let filtered = fullData;

    switch (timeFilter) {
        case "week": {
            const lastWeek = new Date();
            lastWeek.setDate(now.getDate() - 7);
            filtered = fullData.filter((d) => new Date(d.date) >= lastWeek);
            break;
        }
        case "month": {
            const lastMonth = new Date();
            lastMonth.setMonth(now.getMonth() - 1);
            filtered = fullData.filter((d) => new Date(d.date) >= lastMonth);
            break;
        }
        case "quarter": {
            const lastQuarter = new Date();
            lastQuarter.setMonth(now.getMonth() - 3);
            filtered = fullData.filter((d) => new Date(d.date) >= lastQuarter);
            break;
        }
        case "year": {
            const lastYear = new Date();
            lastYear.setFullYear(now.getFullYear() - 1);
            filtered = fullData.filter((d) => new Date(d.date) >= lastYear);
            break;
        }
        default: {
            filtered = fullData;
        }
    }

    return filtered.map((d) => ({
        name: new Date(d.date).toLocaleDateString("vi-VN"),
        newCustomers: d.newCustomers,
    }));
};

export default function NewCustomerChartPage() {
    const [timeFilter, setTimeFilter] = useState("month");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(filterDataByTime(timeFilter));
    }, [timeFilter]);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            
            {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={filteredData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="newCustomers" fill="#8884d8" name="Khách hàng mới" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center">Không có dữ liệu</p>
            )}
        </div>
    );
}
