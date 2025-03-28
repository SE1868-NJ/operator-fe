import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import UserService from "../../services/UserService";

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

export default function NewCustomerChartPage() {
  const [timeGroup, setTimeGroup] = useState("day");
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserService.customerChart(timeGroup);
        const formatData = Array.from({ length: 7 }, (_, index) => ({
          date: data?.[index]?.date || "",
          count: data?.[index]?.count || 0,
        }))
        setChartData(formatData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
      }
    };

    fetchData();
  }, [timeGroup]);
  /*
    const chartData = Array.from({ length: 4 }, (_, index) => ({
      name: order?.[index]?.name || "",
      orders: order?.[index]?.orders || 0,
  }));
  */

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label className="mr-2 font-semibold text-gray-700">
          Chọn khoảng thời gian:
        </label>
        <select
          value={timeGroup}
          onChange={(e) => setTimeGroup(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 cursor-pointer transition"
        >
          <option value="day">Ngày</option>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Khách hàng mới" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center">Không có dữ liệu</p>
      )}
    </div>
  );
}
