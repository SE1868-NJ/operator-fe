import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";

export default function TopCustomers() {
    const [viewType, setViewType] = useState('orders'); // 'orders' or 'totalValue'
    const [topCustomerBuyOrders, setTopCustomerBuyOrders] = useState([]);
    const [topCustomerBuyTotals, setTopCustomerBuyTotals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTopCustomerInWeek();
    }, [])

    const fetchTopCustomerInWeek = async () => {
        let response = await UserService.getTopCustomerByWeek();
        setTopCustomerBuyOrders(response.topCustomerInWeekByOrder);
        setTopCustomerBuyTotals(response.topCustomerInWeekByTotal);
    }

    

    const topCustomerBuyOrder = [
        {
            name: "David Beckham",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 15,
            totalValue: 2000,
        },
        {
            name: "Emily Green",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 12,
            totalValue: 1300,
        },
        {
            name: "Marks Hoverson",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 10,
            totalValue: 1500,
        },
        {
            name: "Oliver King",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 8,
            totalValue: 950,
        },
        {
            name: "Jhony Peters",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 5,
            totalValue: 800,
        },
    ];

    const topCustomerBuyTotal = [
        {
            name: "David Beckham",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 15,
            totalValue: 2000,
        },
        {
            name: "Marks Hoverson",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 10,
            totalValue: 1500,
        },
        {
            name: "Emily Green",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 12,
            totalValue: 1300,
        },
        {
            name: "Oliver King",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 8,
            totalValue: 950,
        },
        {
            name: "Jhony Peters",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            orderCount: 5,
            totalValue: 800,
        },
    ];

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            {/* Container cho tiêu đề và select */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold">Khách hàng hàng đầu trong tuần</h3>
                <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                    className="px-4 py-2 border border-blue-500 rounded-md"
                >
                    <option value="orders">Top khách hàng theo số lượng đơn hàng</option>
                    <option value="totalValue">Top khách hàng theo giá trị tổng đơn</option>
                </select>
            </div>

            {viewType === 'orders' ? (
                <ul>
                    {topCustomerBuyOrders.map((customer, index) => (
                        <li key={index} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <img
                                    src={customer?.Customer.avatar}
                                    alt={customer?.Customer.fullName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{customer?.Customer.fullName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-green-500">{customer.totalOrders} đơn</span>
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md"
                                    onClick={() =>
                                        navigate(`/main/user_detail/${customer.customer_id}`)
                                    }
                                >
                                    Xem
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul>
                    {topCustomerBuyTotals.map((customer, index) => (
                        <li key={index} className="flex items-center justify-between py-2 border-b">
                            <div className="flex items-center gap-3">
                                <img
                                    src={customer?.Customer.avatar}
                                    alt={customer?.Customer.fullName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{customer?.Customer.fullName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-red-500">{Number(customer.totalMoney).toLocaleString("vi-VN")} VNĐ</span>
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md"
                                    onClick={() =>
                                        navigate(`/main/user_detail/${customer.customer_id}`)
                                    }
                                >
                                    Xem
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
