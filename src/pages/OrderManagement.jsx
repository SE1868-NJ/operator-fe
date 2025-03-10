import { useDebouncedState } from "@mantine/hooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderChart from "../components/OrderChart.jsx";
import { useOrders } from "../hooks/useOrders.js";

export default function OrderManagement() {
    const navigate = useNavigate();
    const limit = 10;
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;

    // Lọc đơn hàng
    const timeOut = 200;
    const [searchStatus, setSearchStatusName] = useDebouncedState("", timeOut);
    const [searchPaymentStatus, setSearchPaymentStatus] = useDebouncedState("", timeOut);
    const [searchShippingStatus, setSearchShippingStatus] = useDebouncedState("", timeOut);

    const filterData = useMemo(
        () => ({
            Status: searchStatus,
            PaymentStatus: searchPaymentStatus,
            ShippingStatus: searchShippingStatus,
        }),
        [searchStatus, searchPaymentStatus, searchShippingStatus],
    );

    const { data, isLoading, error } = useOrders(offset, limit, filterData);
    const filteredOrdersData = data || [];
    const filteredOrders = filteredOrdersData?.orders || [];
    const totalPages = Math.ceil((filteredOrdersData?.total || 0) / limit);

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
            </div>
            <OrderChart />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                    <label
                        htmlFor="searchStatus"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Tìm trạng thái đơn hàng:
                    </label>
                    <input
                        type="text"
                        id="searchStatus"
                        placeholder="Trạng thái đơn hàng"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue={searchStatus}
                        onChange={(e) => {
                            setSearchStatusName(e.currentTarget.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <label
                        htmlFor="searchShippingStatus"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Tìm trạng thái vận chuyển:
                    </label>
                    <input
                        type="text"
                        id="searchShippingStatus"
                        placeholder="Trạng thái vận chuyển"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue={searchShippingStatus}
                        onChange={(e) => {
                            setSearchShippingStatus(e.currentTarget.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div>
                    <label
                        htmlFor="searchPaymentStatus"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Tìm trạng thái thanh toán:
                    </label>
                    <input
                        type="text"
                        id="searchPaymentStatus"
                        placeholder="Trạng thái thanh toán"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue={searchPaymentStatus}
                        onChange={(e) => {
                            setSearchPaymentStatus(e.currentTarget.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>
            <div className="rounded-lg shadow-md bg-white overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                            {[
                                "Mã đơn hàng",
                                "Mã cửa hàng",
                                "Mã khách hàng",
                                "Mã người giao hàng",
                                "Trạng thái đơn hàng",
                                "Tổng cộng",
                                "Ghi chú",
                                "Trạng thái thanh toán",
                                "Trạng thái vận chuyển",
                                "Chi tiết",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 font-semibold text-sm uppercase tracking-wide"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-6 text-gray-600">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="text-center py-6 text-red-500 font-medium"
                                >
                                    Có lỗi xảy ra: {error.message}
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-6 text-gray-500">
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100`}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {order.id}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{order.shop_id}</td>
                                    <td className="px-6 py-4 text-gray-700">{order.customer_id}</td>
                                    <td className="px-6 py-4 text-gray-700">{order.shipper_id}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-green-600">
                                        {Number.parseInt(order.total).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 max-w-[150px] truncate">
                                        {order.note}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {order.payment_status}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {order.shipping_status}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(`/main/orderdetail/${order.id}`)
                                            }
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1 || isLoading}
                >
                    Trước
                </button>
                <span className="self-center">
                    Trang {page} của {totalPages}
                </span>
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages || isLoading}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}
