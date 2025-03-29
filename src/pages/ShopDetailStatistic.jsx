import { Avatar, Badge, Button, Card, Grid, Image, Table } from "@mantine/core";
import { Group, NumberInput, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks"; // keep useDebouncedState
import { IconRobot } from "@tabler/icons-react";
import { IconCurrencyDollar, IconSearch } from "@tabler/icons-react";
import { IconAlertCircle } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackChat from "../components/FeedbackChat";
import FeedbackList from "../components/ShopFeedback";
import OrderChart from "../components/ShopOrderChart";
import RevenueChart from "../components/ShopRevenueChart";
import {
    useExportShopOrders,
    useExportShopProducts,
    useShop,
    useShopOrders,
    useShopProducts,
} from "../hooks/useShop";
import ExportExcelButton from "./ExportExcelButton";

const ShopDetailStatistic = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    //AI nhan xet
    const [showReview, setShowReview] = useState(false);

    // Pagination for product
    const [page, setPage] = useState(1);
    const limit = 5; // Số lượng sản phẩm mỗi trang
    const offset = (page - 1) * limit;

    //pagination for orders
    const [page2, setPage2] = useState(1);
    const limit2 = 5;
    const offset2 = (page2 - 1) * limit2;

    //filter for products
    const timeOut = 100;

    //Filter cho product
    const [searchProductName, setSearchProductName] = useDebouncedState("", timeOut);
    const [searchMinPrice, setSearchMinPrice] = useDebouncedState("", timeOut);
    const [searchMaxPrice, setSearchMaxPrice] = useDebouncedState("", timeOut);

    const filterData = useMemo(
        () => ({
            productName: searchProductName,
            minPrice: searchMinPrice,
            maxPrice: searchMaxPrice,
        }),
        [searchProductName, searchMinPrice, searchMaxPrice],
    );

    //Lay thong tin shop, feedback
    const { data, isLoading, error } = useShop(id);
    const shop = data?.shop;
    const feedbacks = data?.feedbacks || [];

    //Lay thong tin order
    const { data: dataOrders, isLoading2, error2 } = useShopOrders(id, offset2, limit2);
    const orders = dataOrders?.orders || [];
    const totalPages2 = dataOrders?.totalPages || 1;

    //Lay thong tin order export
    const { data: dataExportOrders } = useExportShopOrders(id, offset2, 99999);
    const excelData = (dataExportOrders?.orders || []).map((order) => ({
        id: order.id,
        shop_id: order.shop_id,
        customer_id: order.customer_id,
        shipper_id: order.shipper_id,
        address_id: order.address_id,
        productFee: order.productFee,
        shippingFee: order.shippingFee,
        status: order.status,
        total: order.total,
        note: order.note,
        payment_status: order.payment_status,
        shipping_status: order.shipping_status,
        payment_method: order.payment_method,
        created_at: order.created_at,
        // Thông tin của Customer
        customerFullName: order.Customer?.fullName || "",
        customerDateOfBirth: order.Customer?.dateOfBirth || "",
        customerGender: order.Customer?.gender || "",
        customerEmail: order.Customer?.userEmail || "",
        customerPhone: order.Customer?.userPhone || "",
        customerCitizenID: order.Customer?.userCitizenID || "",
        customerAddress: order.Customer?.userAddress || "",
        customerIdentificationNumber: order.Customer?.identificationNumber || "",
        customerIdCardFrontFile: order.Customer?.idCardFrontFile || "",
        customerIdCardBackFile: order.Customer?.idCardBackFile || "",
        customerAvatar: order.Customer?.avatar || "",
    }));

    //lay thong tin product
    const {
        data: dataProducts,
        isLoading3,
        error3,
    } = useShopProducts(id, offset, limit, filterData);
    const { data: dataExportProducts } = useExportShopProducts(id, offset, 99999, filterData);
    const excelDataProduct = dataExportProducts?.products || [];
    const products = dataProducts?.products || [];
    const totalPages = dataProducts?.totalPages || 1;

    // Hàm xử lý scroll xuống phần feedback
    const scrollToFeedback = () => {
        document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error || !shop) {
        return <div className="flex justify-center items-center h-screen">Shop not found</div>;
    }

    return (
        <div className="flex w-full bg-white-100 min-h-screen">
            <div className="w-full mx-auto p-8 bg-white mt-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">{shop.shopName}</h1>

                <div className="flex flex-col lg:flex-row gap-12 mb-8 items-start">
                    <Card className="bg-white p-6 w-full lg:w-1/2">
                        <div className="flex gap-6">
                            {/* Ảnh shop */}
                            <Avatar
                                src={shop.shopAvatar}
                                alt={shop.shopName}
                                size={160}
                                radius="100%"
                                className="shadow-lg border-4 border-gray-200 hover:border-blue-400 transition-all duration-300"
                            />

                            {/* Thông tin chính */}
                            <div>
                                <p className="text-2xl font-bold text-gray-800">Mô tả cửa hàng</p>
                                <p className="text-gray-700 mt-2 text-lg">{shop.shopDescription}</p>

                                <p className="text-2xl font-bold text-gray-800 mt-4 flex items-center gap-2">
                                    Đánh giá cửa hàng
                                </p>
                                <p className="text-yellow-500 mt-2 text-lg font-semibold">
                                    ⭐ {shop.shopRating}/5
                                </p>
                            </div>
                        </div>
                    </Card>
                    <div>
                        <FeedbackChat shopId={id} />
                    </div>
                </div>

                {/* Biểu đồ */}
                <div className="border border-gray-200 mt-8 pt-1 rounded-lg">
                    {/* <div className="w-full flex flex-col lg:flex-row gap-6 px-4"> */}
                    <div className="w-full flex">
                        <div className="rounded-2xl p-6 w-1/2">
                            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase tracking-wider mb-8 ">
                                📊 Thống kê số đơn hàng thành công
                            </h2>
                            <div>
                                <OrderChart id={id} />
                            </div>
                        </div>
                        <div className="rounded-2xl p-6 w-1/2">
                            <h2 className="text-2xl font-bold text-center text-gray-800 uppercase tracking-wider mb-8 ">
                                💰 Thống kê doanh thu
                            </h2>
                            <div>
                                <RevenueChart id={id} />
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <h2 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wider mb-10">
                            📦 Danh sách đơn hàng gần nhất
                        </h2>
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 border">🆔 Mã đơn</th>
                                    <th className="p-3 border">👤 Khách hàng</th>
                                    <th className="p-3 border">📞 SĐT</th>
                                    <th className="p-3 border">💰 Tổng tiền (VND)</th>
                                    <th className="p-3 border">📦 Trạng thái</th>
                                    <th className="p-3 border">📝 Ghi chú</th>
                                    <th className="p-3 border text-center">🔍 Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.map((order) => (
                                    <tr key={order.id} className="border hover:bg-gray-50">
                                        <td className="p-3 border text-center">{order.id}</td>
                                        <td className="p-3 border font-semibold">
                                            {order.Customer.fullName}
                                        </td>
                                        <td className="p-3 border text-gray-600">
                                            {order.Customer.userPhone}
                                        </td>
                                        <td className="p-3 border text-center font-semibold">
                                            {Number(order.total).toLocaleString()} VND
                                        </td>
                                        <td className="p-3 border text-center font-semibold">
                                            {order.status === "completed" && (
                                                <Badge color="green" variant="light">
                                                    ✅ Hoàn thành
                                                </Badge>
                                            )}
                                            {order.status === "cancelled" && (
                                                <Badge color="red" variant="light">
                                                    ❌ Đã hủy
                                                </Badge>
                                            )}
                                            {order.status === "processing" && (
                                                <Badge color="blue" variant="light">
                                                    🔄 Đang xử lý
                                                </Badge>
                                            )}
                                            {order.status === "pending" && (
                                                <Badge color="yellow" variant="light">
                                                    ⏳ Chờ xử lý
                                                </Badge>
                                            )}
                                        </td>{" "}
                                        <td className="p-3 border text-gray-500">
                                            {order.note || "Không có ghi chú"}
                                        </td>
                                        <td className="p-3 border text-center">
                                            <button
                                                type="button"
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                                onClick={() =>
                                                    navigate(`/main/orderdetail/${order.id}`)
                                                }
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Phân trang */}
                        <div className="flex justify-center mt-6 gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                                disabled={page2 === 1}
                                onClick={() => setPage2((prev) => Math.max(prev - 1, 1))}
                            >
                                ⬅ Trang trước
                            </button>
                            <span className="text-lg font-semibold">
                                Trang {page2} / {totalPages2}
                            </span>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                                disabled={page2 >= totalPages2}
                                onClick={() => setPage2((prev) => Math.min(prev + 1, totalPages2))}
                            >
                                Trang sau ➡
                            </button>
                        </div>
                        <div className="flex justify-end mt-6 gap-4">
                            <ExportExcelButton data={excelData} fileName="OrderList" />
                        </div>
                        {/* </div> */}
                    </div>
                    {/* Nút Xem feedback */}
                    <div className="flex justify-center mb-6">
                        <Button
                            onClick={scrollToFeedback}
                            radius="lg"
                            size="md"
                            color="blue"
                            variant="outline"
                        >
                            Xem feedback
                        </Button>
                    </div>
                </div>
                {/* <div className="w-full mx-auto p-8 bg-white mt-8"></div> */}
                <div className="container mx-auto p-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wider my-6">
                        🛍 Danh sách sản phẩm
                    </h2>

                    <Group align="center" justify="center" spacing="md" mb="md">
                        <TextInput
                            label="🔍 Tên sản phẩm"
                            placeholder="Nhập tên sản phẩm..."
                            value={searchProductName}
                            onChange={(e) => setSearchProductName(e.target.value)}
                            icon={<IconSearch size={18} />}
                            radius="md"
                            size="md"
                        />
                        <NumberInput
                            label="💰 Giá thấp nhất"
                            placeholder="Nhập giá thấp nhất..."
                            value={searchMinPrice}
                            onChange={setSearchMinPrice}
                            icon={<IconCurrencyDollar size={18} />}
                            radius="md"
                            size="md"
                        />
                        <NumberInput
                            label="💰 Giá cao nhất"
                            placeholder="Nhập giá cao nhất..."
                            value={searchMaxPrice}
                            onChange={setSearchMaxPrice}
                            icon={<IconCurrencyDollar size={18} />}
                            radius="md"
                            size="md"
                        />
                    </Group>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="p-3 border-b">📸 Hình ảnh</th>
                                    <th className="p-3 border-b">🛒 Tên sản phẩm</th>
                                    <th className="p-3 border-b">📜 Mô tả</th>
                                    <th className="p-3 border-b text-center">💰 Giá (VND)</th>
                                    <th className="p-3 border-b text-center">📦 Đã bán</th>
                                    <th className="p-3 border-b text-center">⭐ Đánh giá</th>
                                    <th className="p-3 border-b text-center">🔍 Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => {
                                    const totalSold =
                                        product.OrderItems?.reduce(
                                            (sum, item) => item.quantity,
                                            0,
                                        ) || 0;
                                    const feedbacks = product.OrderItems?.map(
                                        (item) => item.Feedbacks?.star,
                                    ).filter((star) => star !== undefined && star !== null);
                                    const averageStars = feedbacks.length
                                        ? (
                                              feedbacks.reduce((sum, star) => sum + star, 0) /
                                              feedbacks.length
                                          ).toFixed(1)
                                        : "Chưa có đánh giá";

                                    return (
                                        <tr
                                            key={product.product_id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3">
                                                <img
                                                    src={product.main_image}
                                                    alt={product.product_name}
                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                />
                                            </td>
                                            <td className="p-3 font-semibold">
                                                {product.product_name}
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                {product.description}
                                            </td>
                                            <td className="p-3 text-center font-semibold">
                                                {Number(product.price).toLocaleString()}
                                            </td>
                                            <td className="p-3 text-center text-blue-600">
                                                {totalSold}
                                            </td>
                                            <td className="p-3 text-center text-yellow-500">
                                                {averageStars} ⭐
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                                    onClick={() =>
                                                        navigate(
                                                            `/main/shop/${id}/product/${product.product_id}`,
                                                        )
                                                    }
                                                >
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {/* Phân trang */}
                        <div className="flex justify-center mt-6 gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                ⬅ Trang trước
                            </button>
                            <span className="text-lg font-semibold">
                                Trang {page} / {totalPages}
                            </span>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Trang sau ➡
                            </button>
                        </div>
                        <div className="flex justify-end mt-6 gap-4">
                            <ExportExcelButton data={excelDataProduct} fileName="ProductList" />
                        </div>
                    </div>
                </div>

                <div className="w-full flex items-center justify-center border-t border-gray-300 relative">
                    {/* Icon AI bên trái */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712037.png"
                        alt="AI Icon Left"
                        className="w-16 h-16 absolute left-5 lg:left-20"
                    />

                    <div className="w-full lg:w-1/2 flex flex-col justify-center text-center">
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2 tracking-wider justify-center uppercase my-8">
                            <IconRobot size={35} className="text-blue-500" />
                            Đánh giá tổng quan từ AI
                        </h2>
                        {/* Nút hiển thị đánh giá */}
                        {!showReview && (
                            <button
                                type="button"
                                onClick={() => setShowReview(true)}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition duration-300"
                            >
                                Bạn có muốn xem nhận xét về shop từ AI?
                            </button>
                        )}

                        {/* Đánh giá từ AI - chỉ hiển thị khi showReview = true */}
                        {showReview && (
                            <div className="mt-1 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg text-white text-lg italic relative mb-6">
                                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 blur-lg rounded-xl" />
                                {feedbacks.aiReview === undefined ? (
                                    <p>Tạm thời cửa hàng chưa có đánh giá nào!!!</p>
                                ) : (
                                    <p>“{feedbacks.aiReview}”</p>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Icon AI bên phải */}
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712005.png"
                        alt="AI Icon Right"
                        className="w-16 h-16 absolute right-5 lg:right-20"
                    />
                </div>

                <div id="feedback-section" className="mt-6 border-t border-gray-200 pt-6">
                    {data.feedbacks.feedbacks && data.feedbacks.feedbacks.length > 0 ? (
                        <FeedbackList feedbacks={data.feedbacks.feedbacks} />
                    ) : (
                        <p className="text-gray-500 italic">Chưa có feedback nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopDetailStatistic;
