import { useState, useEffect } from "react";
import OrderServices from "../../services/OrderServices";
import ShipperServices from "../../services/ShipperServices";

export default function Statistics() {
  const [statistics, setStatistics] = useState([]);

  const [completedOrder, setCompletedOrder] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const completedOrders = await OrderServices.completedOrdersComparsion();
      const cancelRate = await ShipperServices.getCancelOrderRate();
      const deliveryTime = await ShipperServices.getDeliveryTime();
      const totalRevenue = await OrderServices.getTotalRevenueChange();

      setStatistics([
        {
          title: "Tổng doanh thu tháng này",
          value: `${totalRevenue?.currentRevenue?.toLocaleString("vi-VN")} vnđ`,
          change: totalRevenue?.percentChange,
        },
        {
          title: "Số lượng đơn hàng hoàn thành",
          value: `${completedOrders?.lastMonth} đơn`,
          change: `${completedOrders?.changePercentage} %`,
        },
        {
          title: "Tỷ lệ hủy đơn hàng",
          value: cancelRate?.cancelRateNow,
          change: cancelRate?.percentageChange,
        },
        {
          title: "Thời gian giao hàng trung bình",
          value: `${(Math.ceil(deliveryTime?.avgDeliveryDaysNow * 10) / 10).toFixed(1)} ngày`,
          change: `${deliveryTime?.timeChange} ngày`,
        },
      ]);
    };

    fetchData(); // Gọi lần đầu tiên

    const intervalId = setInterval(fetchData, 60000); // Lặp lại mỗi 10s

    return () => clearInterval(intervalId); // Dọn dẹp interval khi unmount
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {statistics.map((stat, index) => (
        <div key={index} className="p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-gray-700 font-semibold">{stat.title}</h3>
          <p className="text-xl font-bold">{stat.value}</p>
          <p
            className={`text-sm ${
              stat.change?.startsWith("-") ? "text-red-500" : "text-green-500"
            }`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
