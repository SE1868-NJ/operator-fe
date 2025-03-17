import { Button, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders.js";
import OrderServices from "../services/OrderServices.js";

export default function OrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryclient = useQueryClient();

    const { data: order, isLoading, error } = useOrder(id);
    const [opened, { open, close }] = useDisclosure(false);
    const [cancellationReason, setCancellationReason] = useState(""); // Lý do hủy đơn hàng

    const handleCancelOrder = async () => {
        if (!cancellationReason.trim()) {
            alert("Vui lòng nhập lý do hủy đơn hàng!");
            return;
        }

        try {
            // Gọi dịch vụ hủy đơn hàng, truyền lý do hủy
            if (order.status === "cancelled") {
                await OrderServices.reopenOrder(id, cancellationReason);
            } else {
                await OrderServices.cancelOrder(id, cancellationReason);
            }

            // Invalidating queries để cập nhật dữ liệu
            queryclient.invalidateQueries({ queryKey: ["order"] });
            queryclient.invalidateQueries({ queryKey: ["orders"] });

            // Điều hướng về trang quản lý đơn hàng sau khi hủy thành công
            navigate("/main/ordermanagement");

            // Hiển thị thông báo thành công
            notifications.show({
                color: "green",
                title: "Đơn hàng đã được hủy",
                message: "Đơn hàng của bạn đã được hủy thành công.",
            });
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi hủy đơn hàng:", error);
            alert(`Có lỗi xảy ra khi hủy đơn hàng: ${error.message}`);

            // Hiển thị thông báo lỗi
            notifications.show({
                color: "red",
                title: "Lỗi khi hủy đơn hàng",
                message: "Đơn hàng của bạn chưa được hủy thành công. Hãy thử lại.",
            });
        }
    };

    const handleOpenModal = () => {
        open(); // Mở modal khi nhấn hủy đơn hàng
    };

    const handleCloseModal = () => {
        setCancellationReason(""); // Đặt lại lý do khi đóng modal
        close(); // Đóng modal
    };

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
            </div>

            {/* Thông tin đơn hàng */}
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

            {/* Các sản phẩm trong đơn hàng */}
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

            {/* Tổng giá trị đơn hàng */}
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

            {/* Nút quay lại và hủy đơn hàng */}
            <div className="flex justify-between space-x-4 mt-6">
                <Button
                    type="button"
                    onClick={() => navigate("/main/ordermanagement")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
                >
                    Quay lại
                </Button>
                <Button
                    color={order.status === "cancelled" ? "green" : "red"}
                    onClick={handleOpenModal} // Mở modal khi nhấn Hủy đơn hàng
                    className="px-6 py-3 font-medium text-white bg-red-600 rounded-lg transition duration-200 hover:bg-red-500 w-full sm:w-auto"
                >
                    {order.status === "cancelled" ? "Mở đơn hàng" : "Hủy đơn hàng"}
                </Button>
            </div>

            {/* Modal nhập lý do hủy đơn hàng */}
            <Modal
                opened={opened}
                onClose={handleCloseModal} // Đóng modal khi nhấn ngoài modal
                withCloseButton={false}
                centered
                classNames={{
                    modal: "max-w-lg w-full p-6 rounded-lg shadow-xl bg-white",
                    title: "text-2xl font-semibold text-gray-800 mb-4",
                }}
            >
                <p className="font-semibold text-xl text-gray-800 mb-6">
                    {order.status === "cancelled" ? "Lý do mở đơn hàng" : "Lý do hủy đơn hàng"}
                </p>
                <Textarea
                    className="w-full border border-gray-300 rounded-lg p-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    minRows={4}
                />
                <div className="flex justify-end mt-4">
                    <Button
                        variant="light"
                        onClick={handleCloseModal}
                        className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    >
                        Quay lại
                    </Button>
                    <Button
                        color={order.status === "cancelled" ? "green" : "red"}
                        onClick={handleCancelOrder} // Thực hiện hủy đơn hàng
                        className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    >
                        Duyệt
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
