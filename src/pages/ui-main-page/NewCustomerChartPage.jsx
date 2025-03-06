import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const fullData = [
    { date: "2024-01-01", order: 500, income: 600 },
    { date: "2024-02-01", order: 400, income: 430 },
    { date: "2024-03-01", order: 700, income: 800 },
    { date: "2024-04-01", order: 600, income: 820 },
    { date: "2024-05-01", order: 400, income: 430 },
    { date: "2024-06-01", order: 500, income: 500 },
    { date: "2024-07-01", order: 700, income: 800 },
    { date: "2024-08-01", order: 900, income: 850 },
    { date: "2024-09-01", order: 500, income: 200 },
    { date: "2024-10-01", order: 400, income: 300 },
    { date: "2024-11-01", order: 550, income: 500 },
    { date: "2024-12-01", order: 750, income: 700 },
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
        order: d.order,
        income: d.income,
    }));
};

export default function SummaryChart() {
    const [timeFilter, setTimeFilter] = useState("month");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(filterDataByTime(timeFilter));
    }, [timeFilter]);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-700 font-semibold">Tổng quan</h3>
                <select
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm text-gray-700 focus:outline-none"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                >
                    <option value="week">Tuần</option>
                    <option value="month">Tháng</option>
                    <option value="quarter">Quý</option>
                    <option value="year">Năm</option>
                </select>
            </div>
            {filteredData.length > 0 ? (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={filteredData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="order" fill="#8884d8" name="Số đơn hàng" />
                        <Bar dataKey="income" fill="#82ca9d" name="Doanh thu" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-gray-500 text-center">Không có dữ liệu</p>
            )}
        </div>
    );
}
