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
    { name: "16/01/2025", order: 7, income: 423000 },
    { name: "23/01/2025", order: 9, income: 398000 },
    { name: "30/01/2025", order: 8, income: 410500 },
    { name: "06/02/2025", order: 4, income: 287400 },
    { name: "13/02/2025", order: 5, income: 320600 },
    { name: "20/02/2025", order: 7, income: 470300 },
    { name: "27/02/2025", order: 9, income: 450900 },
    { name: "06/03/2025", order: 6, income: 399200 },
    { name: "13/03/2025", order: 4, income: 280100 },
    { name: "20/03/2025", order: 5, income: 310800 },
    { name: "25/03/2025", order: 7, income: 445600 },
];


export default function SummaryChart() {
    const [chartType, setChartType] = useState("line");

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-700 font-semibold">Tổng quan theo tuần</h3>
                <div>
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
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={60} // Tăng chiều cao trục X để tránh chữ bị cắt
                        />
                        <YAxis yAxisId="left" />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => value.toLocaleString("vi-VN")}
                        />
                        <Tooltip
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toLocaleString("vi-VN")
                                    : value
                            }
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="order"
                            stroke="#8884d8"
                            strokeWidth={2}
                            name="Số đơn hàng"
                            yAxisId="left"
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            name="Doanh thu"
                            yAxisId="right"
                        />
                    </LineChart>
                ) : (
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis yAxisId="left" />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => value.toLocaleString("vi-VN")}
                        />
                        <Tooltip
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toLocaleString("vi-VN")
                                    : value
                            }
                        />
                        <Legend />
                        <Bar dataKey="order" fill="#8884d8" name="Số đơn hàng" yAxisId="left" />
                        <Bar dataKey="income" fill="#82ca9d" name="Doanh thu" yAxisId="right" />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
