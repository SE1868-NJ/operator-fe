import React from "react";
import { useParams } from "react-router-dom";
import { useOrdersOfShipper } from "../hooks/useShippers";

const ShipperOrdersList = ({ shipperId }) => {
    const { id } = useParams(); // Lấy id từ URL
    console.log("Shipper ID from useParams:", id);

    const { data: orders, isLoading, error } = useOrdersOfShipper(shipperId);

    if (isLoading) return <p className="text-lg font-semibold text-center">Đang tải đơn hàng...</p>;
    if (error)
        return <p className="font-semibold text-center text-red-500">Lỗi: {error.message}</p>;
    if (!orders || orders.length === 0)
        return <p className="text-center text-gray-500">Không có đơn hàng nào.</p>;

    // Định dạng tiền VND nhưng không có ký hiệu ₫
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    // Chuyển trạng thái đơn hàng sang tiếng Việt
    const getStatusClass = (status) => {
        switch (status) {
            case "completed":
                return { text: "Hoàn thành", className: "text-green-700 bg-green-100 p-1 rounded" };
            case "processing":
                return {
                    text: "Đang xử lý",
                    className: "text-yellow-700 bg-yellow-100 p-1 rounded",
                };
            case "pending":
                return {
                    text: "Chờ xử lý",
                    className: "text-orange-700 bg-orange-100 p-1 rounded",
                };
            case "cancelled":
                return { text: "Đã hủy", className: "text-red-700 bg-red-100 p-1 rounded" };
            default:
                return {
                    text: "Không xác định",
                    className: "text-gray-700 bg-gray-100 p-1 rounded",
                };
        }
    };

    // Chuyển trạng thái giao hàng sang tiếng Việt
    const getShippingStatusClass = (shippingStatus) => {
        switch (shippingStatus) {
            case "shipped":
                return { text: "Đã giao", className: "text-green-700 bg-green-100 p-1 rounded" };
            case "shipping":
                return {
                    text: "Đang giao",
                    className: "text-yellow-700 bg-yellow-100 p-1 rounded",
                };
            case "not_yet_shipped":
                return { text: "Chưa giao", className: "text-red-700 bg-red-100 p-1 rounded" };
            default:
                return {
                    text: "Không xác định",
                    className: "text-gray-700 bg-gray-100 p-1 rounded",
                };
        }
    };

    return (
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">
                Các đơn hàng của người giao hàng
            </h2>
            <div className="overflow-scroll overflow-x-auto max-h-[55vh]">
                <table className="w-full border border-collapse border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Mã đơn hàng</th>
                            <th className="p-2 border">Phí vận chuyển (VND)</th>
                            <th className="p-2 border">Trạng thái đơn hàng</th>
                            <th className="p-2 border">Trạng thái giao hàng</th>
                            <th className="p-2 border">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.Orders.map((order) => {
                            const status = getStatusClass(order.status);
                            const shippingStatus = getShippingStatusClass(order.shipping_status);

                            return (
                                <tr key={order.id} className="text-center hover:bg-gray-50">
                                    <td className="p-2 border">{order.id}</td>
                                    <td className="p-2 border">
                                        {formatCurrency(order.shippingFee)}
                                    </td>
                                    <td className="p-2 border">
                                        <span className={status.className}>{status.text}</span>
                                    </td>
                                    <td className="p-2 border">
                                        <span className={shippingStatus.className}>
                                            {shippingStatus.text}
                                        </span>
                                    </td>
                                    <td className="p-2 border">
                                        {order.note || "Không có ghi chú"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShipperOrdersList;
