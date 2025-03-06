import { Avatar, Badge, Button, Card, Grid, Image, Table } from "@mantine/core";
import { Group, NumberInput, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks"; // keep useDebouncedState
import { IconRobot } from "@tabler/icons-react";
import { IconCurrencyDollar, IconSearch } from "@tabler/icons-react";
import { IconAlertCircle } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackList from "../components/ShopFeedback";
import OrderChart from "../components/ShopOrderChart";
import { useShop, useShopOrders, useShopProducts } from "../hooks/useShop";
import BanService from "../services/BanService";

const ShopProfileDetail = () => {
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
    const timeOut = 500;

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

    //lay thong tin product
    const {
        data: dataProducts,
        isLoading3,
        error3,
    } = useShopProducts(id, offset, limit, filterData);
    const products = dataProducts?.products || [];
    const totalPages = dataProducts?.totalPages || 1;

    const [selectedImage, setSelectedImage] = useState(null);

    // Hàm xử lý scroll xuống phần feedback
    const scrollToFeedback = () => {
        document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" });
    };

    //Hàm xử lý ban
    const handleStatusChange = async () => {
        if (shop.shopStatus === "active") {
            const token = localStorage.getItem("token");
            const operatorData = jwtDecode(token);
            console.log(operatorData);
            navigate(`/main/ban_account?userId=${shop.shopID}&operatorId=1&accountType=shop`);
        } else {
            const confirmUnban = window.confirm("Bạn có muốn gỡ đình chỉ tài khoản này không?");
            if (confirmUnban) {
                await BanService.unbanAccountManually(shop.shopID);
                window.location.reload();
            }
        }
    };
    const [banInfo, setBanInfo] = useState(null);

    // Ensure hooks are always called in the same order
    useEffect(() => {
        if (!shop?.shopID) return;

        const fetchBanInfo = async () => {
            try {
                const isUserBan = await BanService.getBanAccount(shop.shopID, "shop");
                console.log("Ban info:", isUserBan);
                if (isUserBan) {
                    setBanInfo(isUserBan);
                }
                console.log("Ban info:", isUserBan);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin ban:", error);
            }
        };

        fetchBanInfo();
    }, [shop?.shopID]);

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
                    {/* Thông tin cửa hàng */}
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

                        {/* Nếu shop bị đình chỉ */}
                        {shop.shopStatus === "suspended" && (
                            <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md flex items-center gap-3">
                                <IconAlertCircle size={24} className="text-red-600" />
                                <p className="text-sm text-red-800 font-medium">
                                    Tài khoản bị đình chỉ đến:{" "}
                                    <span className="font-semibold text-red-900">
                                        {new Date(banInfo?.banEnd).toLocaleString("vi-VN")}
                                    </span>
                                </p>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Thông tin chủ cửa hàng */}
                    <Card
                        radius="lg"
                        className="bg-white p-6 w-full lg:w-1/2 border border-gray-200"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            🛍️ Thông tin chủ cửa hàng
                        </h2>

                        <Grid gutter="xl" align="center">
                            <Grid.Col
                                span={12}
                                md={4}
                                className="flex items-center gap-4 justify-center md:justify-start text-left md:text-center"
                            >
                                {/* Avatar */}
                                <Avatar
                                    src={shop.Owner.avatar}
                                    size={120}
                                    radius="100%"
                                    className="shadow-lg border-4 border-gray-200 hover:border-blue-400 transition-all duration-300"
                                />

                                {/* Thông tin chủ shop */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {shop.Owner.fullName}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{shop.Owner.userEmail}</p>
                                </div>
                            </Grid.Col>

                            <Grid.Col span={12} md={8}>
                                <Table
                                    striped
                                    highlightOnHover
                                    className="border border-gray-200 rounded-lg shadow-sm"
                                >
                                    <tbody>
                                        {[
                                            {
                                                label: "📅 Ngày sinh",
                                                value: shop.Owner.dateOfBirth,
                                            },
                                            { label: "👤 Giới tính", value: shop.Owner.gender },
                                            {
                                                label: "📞 Số điện thoại",
                                                value: shop.Owner.userPhone,
                                            },
                                            {
                                                label: "🆔 Số CCCD",
                                                value: shop.Owner.identificationNumber,
                                            },
                                            { label: "🏠 Địa chỉ", value: shop.Owner.userAddress },
                                        ].map((item) => (
                                            <tr key={item.label}>
                                                <td className="font-semibold text-gray-700 bg-gray-100 px-4 py-2">
                                                    {item.label}
                                                </td>
                                                <td className="px-4 py-2">{item.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Grid.Col>
                        </Grid>

                        {/* Hình ảnh CCCD */}
                        <h3 className="text-lg font-bold text-gray-800 mt-6">
                            📄 Giấy tờ tùy thân
                        </h3>
                        <div className="flex gap-6 mt-3">
                            {[
                                { label: "CCCD Mặt trước", img: shop.Owner.idCardFrontFile },
                                { label: "CCCD Mặt sau", img: shop.Owner.idCardBackFile },
                            ].map((item) => (
                                <div key={item.label} className="relative">
                                    <Image
                                        src={item.img}
                                        alt={item.label}
                                        className="w-40 h-28 rounded-lg border cursor-pointer transition-transform transform hover:scale-105"
                                        onClick={() => setSelectedImage(item.img)}
                                    />
                                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 rounded">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Thông tin cửa hàng */}
                    <Card
                        radius="lg"
                        className="bg-white p-6 w-full lg:w-1/2 border border-gray-200"
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            🏪 Thông tin cửa hàng
                        </h2>

                        <Table
                            striped
                            highlightOnHover
                            className="border border-gray-200 rounded-lg shadow-sm"
                        >
                            <tbody>
                                {[
                                    {
                                        label: "🕒 Thời gian hoạt động",
                                        value: shop.shopOperationHours,
                                    },
                                    { label: "📧 Email", value: shop.shopEmail },
                                    { label: "📞 SĐT", value: shop.shopPhone },
                                    { label: "📍 Địa chỉ lấy hàng", value: shop.shopPickUpAddress },
                                    { label: "🏢 Mô hình kinh doanh", value: shop.businessType },
                                    {
                                        label: "💳 Tài khoản ngân hàng",
                                        value: shop.shopBankAccountNumber,
                                    },
                                    { label: "🏦 Tên ngân hàng", value: shop.shopBankName },
                                    { label: "💰 Mã số thuế", value: shop.taxCode },
                                    {
                                        label: "📅 Ngày tham gia",
                                        value: new Date(shop.shopJoinedDate).toLocaleDateString(),
                                    },
                                ].map((item) => (
                                    <tr key={item.label}>
                                        <td className="font-semibold text-gray-700 bg-gray-100 px-4 py-2">
                                            {item.label}
                                        </td>
                                        <td className="px-4 py-2">{item.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Trạng thái cửa hàng */}
                        <div className="mt-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                🔹 Trạng thái cửa hàng
                            </h3>
                            <Badge
                                size="lg"
                                radius="md"
                                color={shop.shopStatus === "active" ? "green" : "red"}
                                className="text-sm mt-2 px-4 py-2"
                            >
                                {shop.shopStatus === "active" ? "Đang hoạt động" : "Bị tạm dừng"}
                            </Badge>
                        </div>
                        <div className="flex justify-end mt-6 w-full gap-4">
                            <button
                                type="button"
                                onClick={() => handleStatusChange()}
                                className={`${
                                    shop.shopStatus === "active"
                                        ? "bg-red-500 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md"
                                        : shop.shopStatus === "suspended"
                                          ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md"
                                          : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md" // Nếu là "Không hoạt động"
                                } px-4 py-2 rounded`}
                            >
                                {
                                    shop.shopStatus === "active"
                                        ? "Đình chỉ cửa hàng"
                                        : shop.shopStatus === "suspended"
                                          ? "Gỡ đình cửa hàng"
                                          : "Kích hoạt cửa hàng" // Nếu là "Không hoạt động"
                                }
                            </button>

                            <button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md"
                                onClick={() => navigate("/main/shops")}
                            >
                                Back to List
                            </button>
                        </div>
                    </Card>

                    {/* Popup xem ảnh CCCD lớn hơn */}
                    {selectedImage && (
                        <button
                            type="button" // ✅ Thêm type="button" để tránh lỗi
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                            onClick={() => setSelectedImage(null)}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setSelectedImage(null);
                                }
                            }}
                            aria-label="Đóng ảnh xem trước" // Cung cấp mô tả hỗ trợ accessibility
                        >
                            <img
                                src={selectedImage}
                                alt="Ảnh CCCD"
                                className="max-w-full max-h-[80vh] p-4 bg-white shadow-lg rounded-lg"
                            />
                        </button>
                    )}
                </div>

                {/* Biểu đồ */}
                <div className="border border-gray-200 mt-8 pt-1 rounded-lg">
                    <div className="w-full flex flex-col lg:flex-row gap-6 px-4">
                        <div className="w-full lg:w-1/2">
                            <div className="rounded-2xl p-6 w-full">
                                <h2 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wider my-4 mb-11 ">
                                    📊 Thống kê số đơn hàng
                                </h2>
                                <div>
                                    <OrderChart id={id} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wider my-10">
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
                                                        alert(`Xem chi tiết đơn hàng: ${order.id}`)
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
                                    onClick={() =>
                                        setPage2((prev) => Math.min(prev + 1, totalPages2))
                                    }
                                >
                                    Trang sau ➡
                                </button>
                            </div>
                        </div>
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
                                                        alert(
                                                            `Xem chi tiết sản phẩm: ${product.product_name}`,
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

export default ShopProfileDetail;
