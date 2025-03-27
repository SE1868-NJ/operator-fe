import { useState, useEffect } from "react";
import OrderServices from "../../services/OrderServices";



export default function Statistics() {

    const [statistics, setStatistics] = useState([
        { title: "Tổng doanh thu tháng này", value: "1.435.700 vnđ", change: "+0.0%" },
        { title: "Số lượng đơn hàng hoàn thành", value: "39 đơn", change: "-13.3%" },       
        { title: "Tỷ lệ hủy đơn hàng", value: "2.9%", change: "+0.0%" },
        { title: "Thời gian giao hàng trung bình", value: "2.0 ngày", change: "-0.0 ngày" },
    ]);

    const [completedOrder, setCompletedOrder] = useState();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const completedOrdersComparsion = OrderServices.completedOrdersComparsion();
        setCompletedOrder(completedOrdersComparsion)
    }
    
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {statistics.map((stat, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-gray-700 font-semibold">{stat.title}</h3>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p
                        className={`text-sm ${stat.change.startsWith("-") ? "text-red-500" : "text-green-500"}`}
                    >
                        {stat.change}
                    </p>
                </div>
            ))}
        </div>
    );
}
