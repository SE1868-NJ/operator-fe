import { useState, useEffect } from "react";
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
import OrderServices from "../../services/OrderServices";

export default function SummaryChart() {
    const [chartType, setChartType] = useState("line");
    const [timeGroup, setTimeGroup] = useState("month");
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataFetch = await OrderServices.getTotalSummaryChart(timeGroup);

                // Format lại dữ liệu để đảm bảo chuẩn xác
                const formattedData = dataFetch.map(item => ({
                    date: item.date, 
                    order: item.order,
                    income: Number(item.income) // Chuyển về số để đảm bảo tính toán đúng
                }));

                setData(formattedData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
            }
        };

        fetchData();
    }, [timeGroup]);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="mb-4">
                    <label htmlFor="timeGroup" className="mr-2 font-semibold text-gray-700">Tổng quan theo</label>
                    <select
                        id="timeGroup"
                        value={timeGroup}
                        onChange={(e) => setTimeGroup(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 cursor-pointer transition"
                    >
                        <option value="month">Tháng</option>
                        <option value="year">Năm</option>
                    </select>
                </div>

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
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                        <YAxis yAxisId="left" />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                                    : value
                            }
                        />
                        <Legend />
                        <Line type="monotone" dataKey="order" stroke="#8884d8" strokeWidth={2} name="Số đơn hàng" yAxisId="left" />
                        <Line type="monotone" dataKey="income" stroke="#82ca9d" strokeWidth={2} name="Doanh thu" yAxisId="right" />
                    </LineChart>
                ) : (
                    <BarChart data={data}>
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                        <YAxis yAxisId="left" />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
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
