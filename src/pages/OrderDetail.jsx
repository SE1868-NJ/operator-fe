import { useNavigate, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders.js";

export default function OrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: order, isLoading, error } = useOrder(id);
    console.log("order: ", order);

    if (isLoading) {
        return <div className="text-center text-lg font-semibold mt-10">Đang tải...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-lg font-semibold mt-10 text-red-500">
                Lỗi: {error.message}
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center text-lg font-semibold mt-10 text-red-500">
                Không tìm thấy đơn hàng
            </div>
        );
    }

    const orderItems = order.OrderItems || [];
    const totalOrderItemAmount = orderItems.reduce(
        (total, item) => total + Number.parseInt(item.total),
        0,
    );

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
                <button
                    type="button"
                    onClick={() => navigate("/main/ordermanagement")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Quay lại
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                    <p>
                        <strong>Mã cửa hàng:</strong> {order.shop_id}
                    </p>
                    <p>
                        <strong>Mã khách hàng:</strong> {order.customer_id}
                    </p>
                    <p>
                        <strong>Trạng thái thanh toán:</strong>
                        <span
                            className={`ml-2 px-2 py-1 rounded ${
                                order.payment_status === "Chưa thanh toán"
                                    ? "bg-red-200 text-red-700"
                                    : "bg-green-200 text-green-700"
                            }`}
                        >
                            {order.payment_status}
                        </span>
                    </p>
                    <p>
                        <strong>Trạng thái vận chuyển:</strong>
                        <span
                            className={`ml-2 px-2 py-1 rounded ${
                                order.shipping_status === "Đang vận chuyển"
                                    ? "bg-yellow-200 text-yellow-700"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                        >
                            {order.shipping_status}
                        </span>
                    </p>
                    <p>
                        <strong>Phương thức thanh toán:</strong> {order.payment_method}
                    </p>
                    <p>
                        <strong>Ngày tạo:</strong> {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Ghi chú:</strong> {order.note}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Sản phẩm trong đơn hàng</h2>
                {orderItems.length === 0 ? (
                    <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                {[
                                    "Mã sản phẩm",
                                    "Tên sản phẩm",
                                    "Số lượng",
                                    "Đơn giá",
                                    "Tổng cộng",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="border border-gray-300 px-4 py-2 text-center"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item?.id} className="border border-gray-300">
                                    <td className="px-4 py-2 text-center">{item?.id}</td>
                                    <td className="px-4 py-2 text-center">
                                        {item?.Product?.product_name}
                                    </td>
                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                    <td className="px-4 py-2 text-center">
                                        {Number.parseInt(item?.Product?.price).toLocaleString()} VND
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {Number.parseInt(item.total).toLocaleString()} VND
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow text-gray-700">
                <div className="grid gap-2">
                    <div className="flex justify-between">
                        <span className="w-2/3 text-left">Tổng giá trị sản phẩm :</span>
                        <span
                            className={`w-1/3 text-right font-semibold ${
                                totalOrderItemAmount === order.productFee
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {totalOrderItemAmount.toLocaleString()} VND
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="w-2/3 text-left">Phí vận chuyển :</span>
                        <span className="w-1/3 text-right">
                            {Number.parseInt(order.shippingFee).toLocaleString()} VND
                        </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 text-lg font-bold text-red-600">
                        <span className="w-2/3 text-left">Tổng cộng :</span>
                        <span className="w-1/3 text-right">
                            {(
                                Number(totalOrderItemAmount) + Number(order?.shippingFee || 0)
                            ).toLocaleString()}{" "}
                            VND
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
