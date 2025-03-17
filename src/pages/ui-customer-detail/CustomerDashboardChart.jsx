import { useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useUserOrderRecent4Month } from "../../hooks/useUser.js";

const CustomerDashboardChart = ({ id }) => {
    // Dữ liệu tĩnh cho 4 tháng gần nhất

    const { data: order, isLoading, error } = useUserOrderRecent4Month(id);

    if (isLoading) return <p className="text-lg font-semibold text-center">Đang tải đơn hàng...</p>;
    console.log(order);

    const chartData = Array.from({ length: 4 }, (_, index) => ({
        name: order?.[index]?.name || "",
        orders: order?.[index]?.orders || 0,
    }));

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-blue-500">
                Số lượng đặt hàng (4 tháng gần nhất)
            </h3>

            {/* Biểu đồ */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#4A90E2" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomerDashboardChart;
