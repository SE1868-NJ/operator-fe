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
                const res = await ShopService.getOrdersStatistic(id, timeRange).then(
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

                    // Match fetched data
                    for (const { date, count } of res) {
                        const orderTime = new Date(date);
                        const hourIndex = formattedData.findIndex(
                            (h) => h.timestamp === `${orderTime.getHours()}:00`,
                        );
                        if (hourIndex !== -1) {
                            formattedData[hourIndex].value = count;
                        }
                    }
                } else if (timeRange === "7d") {
                    // Generate last 7 days
                    formattedData = new Array(7).fill(0).map((_, i) => {
                        const date = new Date(now);
                        date.setDate(now.getDate() - 6 + i);
                        return { timestamp: date.toLocaleDateString("en-GB"), value: 0 };
                    });

                    // Match fetched data
                    for (const { date, count } of res) {
                        const orderTime = new Date(date).toLocaleDateString("en-GB");
                        const dayIndex = formattedData.findIndex((d) => d.timestamp === orderTime);
                        if (dayIndex !== -1) {
                            formattedData[dayIndex].value = count;
                        }
                    }
                } else if (timeRange === "1m") {
                    // Generate last 30 days
                    formattedData = new Array(30).fill(0).map((_, i) => {
                        const date = new Date(now);
                        date.setDate(now.getDate() - 29 + i);
                        return { timestamp: date.toLocaleDateString("en-GB"), value: 0 };
                    });

                    // Match fetched data
                    for (const { date, count } of res) {
                        const orderTime = new Date(date).toLocaleDateString("en-GB");
                        const dayIndex = formattedData.findIndex((d) => d.timestamp === orderTime);
                        if (dayIndex !== -1) {
                            formattedData[dayIndex].value = count;
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
    // console.log("Order report data:", data);
    return (
        <div className="p-5 bg-gray-100 rounded-md shadow mb-10 space-y-10">
            <Select
                value={timeRange}
                onChange={setTimeRange}
                data={[
                    { value: "24h", label: "Last 24 Hours" },
                    { value: "7d", label: "Last 7 Days" },
                    { value: "1m", label: "Last 30 Days" },
                ]}
                label="Chọn khoảng thời gian"
            />
            <LineChart
                h={300}
                data={data}
                series={[{ name: "value", label: "Orders Data" }]}
                dataKey="timestamp"
                yAxisProps={{ domain: [0, Math.ceil((10 + maxCount) / 10) * 10] }}
                valueFormatter={(value) => `${value}`}
                className="transition-all duration-300"
            />
        </div>
    );
};

export default OrderChart;
