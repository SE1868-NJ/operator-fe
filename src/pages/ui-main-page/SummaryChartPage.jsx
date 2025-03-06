import { useState } from "react";
import {
    Bar,
    BarChart,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const data = [
    { name: "01 Tháng 9", order: 700, income: 800 },
    { name: "02 Tháng 9", order: 900, income: 800 },
    { name: "03 Tháng 9", order: 650, income: 820 },
    { name: "04 Tháng 9", order: 400, income: 430 },
    { name: "05 Tháng 9", order: 500, income: 500 },
    { name: "06 Tháng 9", order: 700, income: 800 },
    { name: "07 Tháng 9", order: 900, income: 850 },
    { name: "08 Tháng 9", order: 600, income: 820 },
    { name: "09 Tháng 9", order: 400, income: 430 },
    { name: "10 Tháng 9", order: 500, income: 500 },
    { name: "11 Tháng 9", order: 700, income: 800 },
    { name: "12 Tháng 9", order: 900, income: 850 },
    { name: "13 Tháng 9", order: 500, income: 200 },
    { name: "14 Tháng 9", order: 400, income: 300 },
    { name: "15 Tháng 9", order: 550, income: 500 },
];

export default function SummaryChart() {
    const [chartType, setChartType] = useState("line");
    const [timeFilter, setTimeFilter] = useState("month");

    // Hàm lọc dữ liệu theo thời gian
    const filterData = (timeFilter) => {
        switch (timeFilter) {
            case "week": {
                return data.slice(-7);
            } // Lấy 7 ngày gần nhất
            case "month": {
                return data.slice(-30);
            } // Lấy 30 ngày gần nhất (giả định có 30 ngày trong tháng)
            case "quarter": {
                return data.slice(-90);
            } // Lấy 90 ngày gần nhất (1 quý)
            case "year": {
                return data.slice(-365);
            } // Lấy 1 năm gần nhất
            default: {
                return data;
            }
        }
    };

    const filteredData = filterData(timeFilter);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-700 font-semibold">Tổng quan</h3>
                <div>
                    {/* Chọn thời gian */}
                    <select
                        className="px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 transition"
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                        <option value="quarter">Quý</option>
                        <option value="year">Năm</option>
                    </select>

                    {/* Nút chọn kiểu biểu đồ */}
                    <button
                        type="button"
                        onClick={() => setChartType("line")}
                        className={`px-4 py-2 rounded-md font-medium ml-2 ${
                            chartType === "line"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Biểu đồ đường
                    </button>
                    <button
                        type="button"
                        onClick={() => setChartType("bar")}
                        className={`px-4 py-2 rounded-md font-medium ml-2 ${
                            chartType === "bar"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        Biểu đồ cột
                    </button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={500}>
                {chartType === "line" ? (
                    <LineChart data={filteredData}>
                        <XAxis dataKey="name" interval={0} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="order"
                            stroke="#8884d8"
                            strokeWidth={2}
                            name="Số đơn hàng"
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            name="Doanh thu"
                        />
                    </LineChart>
                ) : (
                    <BarChart data={filteredData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="order" fill="#8884d8" name="Số đơn hàng" />
                        <Bar dataKey="income" fill="#82ca9d" name="Doanh thu" />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
