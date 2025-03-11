import { BarChart } from "@mantine/charts";
import { Card, Loader, Select, Text, Title } from "@mantine/core";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useGetTop10Shippers } from "../hooks/useShippers";

export default function ShipperDashboardChart() {
    const [data, setData] = useState([]);
    const [months, setMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [loading, setLoading] = useState(true);

    const TARGET_FEE = 250000;

    // Wrap formatMonth in useCallback to avoid unnecessary re-renders
    const formatMonth = useCallback((dateString) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString; // Kiểm tra nếu không phải ngày hợp lệ
        return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:3050/shippers/top10Shippers")
            .then((response) => {
                console.log("🚀 Data fetched:", response.data.data);
                const fetchedData = response.data.data;

                if (!fetchedData || fetchedData.length === 0) {
                    console.warn("⚠ API trả về mảng rỗng!");
                }

                // Chuyển đổi định dạng tháng
                const uniqueMonths = [
                    ...new Set(fetchedData.map((item) => formatMonth(item.order_month))),
                ];

                setMonths(uniqueMonths);
                setSelectedMonth(uniqueMonths[0] || "");
                setData(
                    fetchedData.map((item) => ({
                        ...item,
                        order_month: formatMonth(item.order_month),
                    })),
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error("❌ Error fetching shippers:", error);
                setLoading(false);
            });
    }, [formatMonth]); // Add formatMonth to the dependency array

    const { data: chartData, isLoading } = useGetTop10Shippers();

    if (isLoading || !chartData) return <div>Loading...</div>;

    const filteredData = data.filter((item) => item.order_month === selectedMonth);

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} align="center" mb="md">
                Top 10 Người giao hàng có doanh thu cao nhất ({selectedMonth || "Chưa có dữ liệu"})
            </Title>

            {months.length > 0 ? (
                <Select
                    label="Chọn tháng"
                    data={months.map((month) => ({ value: month, label: month }))}
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    mb="md"
                />
            ) : (
                <Text align="center" color="red">
                    Không có dữ liệu
                </Text>
            )}

            {loading ? (
                <Loader size="md" mt="md" />
            ) : filteredData.length > 0 ? (
                <BarChart
                    h={300}
                    data={chartData}
                    dataKey="shipper_name"
                    series={[{ name: "total_shipping_fee", color: "#FFB8E0" }]}
                    tickLine="y"
                    cursorFill="#F6F0F0"
                    referenceLines={[
                        {
                            y: TARGET_FEE,
                            label: "Target 250,000",
                            color: "red",
                            strokeDasharray: "5 5",
                        },
                    ]}
                />
            ) : (
                <Text align="center" color="gray">
                    Không có dữ liệu cho tháng này
                </Text>
            )}
        </Card>
    );
}
