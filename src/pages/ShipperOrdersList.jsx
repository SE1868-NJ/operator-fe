import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrdersOfShipper } from "../hooks/useShippers";

const ShipperOrdersList = () => {
    const { id } = useParams();
    const [statusFilter, setStatusFilter] = useState("");
    const [shippingStatusFilter, setShippingStatusFilter] = useState("");

    const { data: orders, isLoading, error } = useOrdersOfShipper(id, statusFilter, shippingStatusFilter);

    if (isLoading) return <p className="text-lg font-semibold text-center">Đang tải đơn hàng...</p>;
    if (error) return <p className="font-semibold text-center text-red-500">Lỗi: {error.message}</p>;
    if (!orders || orders.Orders.length === 0) return <p className="text-center text-gray-500">Không có đơn hàng nào.</p>;

    const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount);

    return (
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-center text-gray-800">Các đơn hàng của shipper</h2>

            {/* Bộ lọc */}
            <div className="mb-4">
                <div className="flex justify-between">
                    <div>
                        <label className="block text-gray-700"><strong>Trạng thái đơn hàng:</strong></label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-48 px-3 py-2 mt-1 border rounded-md"
                        >
                            <option value="">Tất cả</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700"><strong>Trạng thái giao hàng:</strong></label>
                        <select
                            value={shippingStatusFilter}
                            onChange={(e) => setShippingStatusFilter(e.target.value)}
                            className="w-48 px-3 py-2 mt-1 border rounded-md"
                        >
                            <option value="">Tất cả</option>
                            <option value="shipped">Đã giao</option>
                            <option value="shipping">Đang giao</option>
                            <option value="not_yet_shipped">Chưa giao</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setStatusFilter("");
                            setShippingStatusFilter("");
                        }}
                        className="self-end px-4 py-2 mt-6 text-white bg-gray-500 rounded-md hover:bg-gray-600"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>

            {/* Bảng danh sách đơn hàng */}
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
                        {orders.Orders.map((order) => (
                            <tr key={order.id} className="text-center hover:bg-gray-50">
                                <td className="p-2 border">{order.id}</td>
                                <td className="p-2 border">{formatCurrency(order.shippingFee)}</td>
                                <td className="p-2 border">
                                    <span className={`p-1 rounded ${getStatusClass(order.status).className}`}>
                                        {getStatusClass(order.status).text}
                                    </span>
                                </td>
                                <td className="p-2 border">
                                    <span className={`p-1 rounded ${getShippingStatusClass(order.shipping_status).className}`}>
                                        {getShippingStatusClass(order.shipping_status).text}
                                    </span>
                                </td>
                                <td className="p-2 border">{order.note || "Không có ghi chú"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const getStatusClass = (status) => {
    const statusClasses = {
        completed: { text: "Hoàn thành", className: "text-green-700 bg-green-100" },
        processing: { text: "Đang xử lý", className: "text-yellow-700 bg-yellow-100" },
        pending: { text: "Chờ xử lý", className: "text-orange-700 bg-orange-100" },
        cancelled: { text: "Đã hủy", className: "text-red-700 bg-red-100" },
    };
    return statusClasses[status] || { text: "Không xác định", className: "text-gray-700 bg-gray-100" };
};

const getShippingStatusClass = (shippingStatus) => {
    const shippingClasses = {
        shipped: { text: "Đã giao", className: "text-green-700 bg-green-100" },
        shipping: { text: "Đang giao", className: "text-yellow-700 bg-yellow-100" },
        not_yet_shipped: { text: "Chưa giao", className: "text-red-700 bg-red-100" },
    };
    return shippingClasses[shippingStatus] || { text: "Không xác định", className: "text-gray-700 bg-gray-100" };
};

export default ShipperOrdersList;
