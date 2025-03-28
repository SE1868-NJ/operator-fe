import { LineChart } from "@mantine/charts";
import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import ShopService from "../services/ShopService";

const OrderChart = ({ id }) => {
    const [data, setData] = useState([]);
    const [timeRange, setTimeRange] = useState("7d");

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await ShopService.getShopRevenueStatistic(id, timeRange).then(
                    ({ data }) => data,
                );

                let formattedData = [];
                const now = new Date();

                if (timeRange === "24h") {
                    // Generate last 24 hours
                    formattedData = new Array(24).fill(0).map((_, i) => {
                        const hour = new Date(now);
                        hour.setHours(now.getHours() - 23 + i, 0, 0, 0);
                        return { timestamp: `${hour.getHours()}:00`, value: 0 };
                    });

                    for (const { date, totalRevenue } of res) {
                        const orderTime = new Date(date);
                        const hourIndex = formattedData.findIndex(
                            (h) => h.timestamp === `${orderTime.getHours()}:00`,
                        );
                        if (hourIndex !== -1) {
                            formattedData[hourIndex].value = totalRevenue;
                        }
                    }
                } else if (timeRange === "7d") {
                    // Generate last 7 days
                    formattedData = new Array(7).fill(0).map((_, i) => {
                        const date = new Date(now);
                        date.setDate(now.getDate() - 6 + i);
                        return { timestamp: date.toLocaleDateString("en-GB"), value: 0 };
                    });

                    for (const { date, totalRevenue } of res) {
                        const orderTime = new Date(date).toLocaleDateString("en-GB");
                        const dayIndex = formattedData.findIndex((d) => d.timestamp === orderTime);
                        if (dayIndex !== -1) {
                            formattedData[dayIndex].value = totalRevenue;
                        }
                    }
                } else if (timeRange === "1m") {
                    // Generate last 30 days
                    formattedData = new Array(30).fill(0).map((_, i) => {
                        const date = new Date(now);
                        date.setDate(now.getDate() - 29 + i);
                        return { timestamp: date.toLocaleDateString("en-GB"), value: 0 };
                    });

                    for (const { date, totalRevenue } of res) {
                        const orderTime = new Date(date).toLocaleDateString("en-GB");
                        const dayIndex = formattedData.findIndex((d) => d.timestamp === orderTime);
                        if (dayIndex !== -1) {
                            formattedData[dayIndex].value = totalRevenue;
                        }
                    }
                } else if (timeRange === "1y") {
                    // Generate last 12 months
                    formattedData = new Array(12).fill(0).map((_, i) => {
                        const date = new Date(now);
                        date.setMonth(now.getMonth() - 11 + i);
                        return {
                            timestamp: date.toLocaleDateString("en-GB", {
                                month: "short",
                                year: "numeric",
                            }),
                            value: 0,
                        };
                    });

                    for (const { date, totalRevenue } of res) {
                        const orderTime = new Date(date);
                        const monthIndex = formattedData.findIndex(
                            (d) =>
                                d.timestamp ===
                                orderTime.toLocaleDateString("en-GB", {
                                    month: "short",
                                    year: "numeric",
                                }),
                        );
                        if (monthIndex !== -1) {
                            formattedData[monthIndex].value = totalRevenue;
                        }
                    }
                }

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        }

        fetchData();
    }, [id, timeRange]);

    const maxCount = Math.max(...data.map((d) => d.value), 0);

    const stepSize = maxCount > 10000 ? 10000 : maxCount > 1000 ? 1000 : 100;

    return (
        <div className="p-5 bg-gray-100 rounded-md shadow mb-10 space-y-10">
            <Select
                value={timeRange}
                onChange={setTimeRange}
                data={[
                    { value: "24h", label: "Last 24 Hours" },
                    { value: "7d", label: "Last 7 Days" },
                    { value: "1m", label: "Last 30 Days" },
                    { value: "1y", label: "Last 12 Months" },
                ]}
                label="Chọn khoảng thời gian"
            />

            <LineChart
                h={300}
                data={data}
                series={[{ name: "value", label: "Revenue (VND)" }]}
                dataKey="timestamp"
                yAxisProps={{
                    domain: [0, Math.ceil((stepSize + maxCount) / stepSize) * stepSize],
                    width: 80, // Tăng chiều rộng cho trục y
                }}
                valueFormatter={(value) =>
                    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                }
                className="transition-all duration-300"
            />
        </div>
    );
};

export default OrderChart;
