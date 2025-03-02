import {
    Accordion,
    Avatar,
    Badge,
    Button,
    Card,
    Grid,
    Image,
    Progress,
    Rating,
    Select,
    Table,
} from "@mantine/core";
import { IconAlertCircle, IconRobot, IconStar } from "@tabler/icons-react";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion"; // 🎯 Import framer-motion
// import ShopService from "../services/ShopService.js";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import BanService from "../services/BanService";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

const DashboardChart = () => {
    const [selectedChart, setSelectedChart] = useState("line");

    // Dữ liệu chung
    const labels = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
    ];

    // Dữ liệu cho từng biểu đồ
    const lineData = {
        labels,
        datasets: [
            {
                label: "Doanh thu (Triệu VND)",
                data: [50, 75, 100, 80, 120, 150, 150, 120, 80, 100, 75, 50],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: "rgba(75, 192, 192, 1)",
            },
        ],
    };

    const barData = {
        labels: ["Gấu Teddy", "Thỏ Bông", "Mèo Bông", "Cá Mập Bông", "Khủng Long"],
        datasets: [
            {
                label: "Số lượng bán (cái)",
                data: [120, 90, 150, 110, 130],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                hoverBackgroundColor: ["#FF4A6E", "#2B94D1", "#E0B43B", "#38A89D", "#8357D1"],
                borderRadius: 10,
            },
        ],
    };

    const pieData = {
        labels: ["Gấu Teddy", "Thỏ Bông", "Mèo Bông", "Cá Mập Bông", "Khủng Long"],
        datasets: [
            {
                data: [30, 20, 25, 15, 10],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                hoverBackgroundColor: ["#FF4A6E", "#2B94D1", "#E0B43B", "#38A89D", "#8357D1"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: { size: 14, weight: "bold" },
                    color: "#333",
                },
            },
            title: {
                display: true,
                text: "Thống kê bán hàng",
                font: { size: 18, weight: "bold" },
                color: "#1E293B",
            },
        },
    };

    return (
        <div className="rounded-2xl p-6 w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wider my-6">
                📊 Thống kê bán hàng
            </h2>

            {/* Dropdown chọn biểu đồ */}
            <div className="mb-6 flex justify-center">
                <Select
                    data={[
                        { value: "line", label: "📈 Doanh thu theo tháng" },
                        { value: "bar", label: "📊 Sản phẩm bán chạy" },
                        { value: "pie", label: "🥧 Doanh thu theo danh mục" },
                    ]}
                    value={selectedChart}
                    onChange={setSelectedChart}
                    radius="lg"
                    size="md"
                    className="w-64"
                />
            </div>

            {/* Biểu đồ */}
            <div className="w-full h-[400px] flex justify-center items-center bg-white p-4 rounded-xl transition-all duration-300 hover:scale-105">
                {selectedChart === "line" && <Line data={lineData} options={options} />}
                {selectedChart === "bar" && <Bar data={barData} options={options} />}
                {selectedChart === "pie" && <Pie data={pieData} options={options} />}
            </div>
        </div>
    );
};

//Feedback:
const FeedbackList = ({ feedbacks }) => {
    const [selectedStar, setSelectedStar] = useState("all");
    const [visibleCount, setVisibleCount] = useState(3);

    // Tính tổng số feedback
    const totalFeedback = feedbacks.length;

    // Lọc feedback theo số sao
    const filteredFeedbacks =
        selectedStar === "all"
            ? feedbacks
            : feedbacks.filter((fb) => fb.star === Number.parseInt(selectedStar));

    // Chỉ hiển thị số lượng feedback theo visibleCount
    const displayedFeedbacks = filteredFeedbacks.slice(0, visibleCount);

    const averageRating = () => {
        if (feedbacks.length === 0) return 0;
        const totalStars = feedbacks.reduce((sum, fb) => sum + fb.star, 0);
        return (totalStars / feedbacks.length).toFixed(1);
    };

    const starCounts = [5, 4, 3, 2, 1].map((star) => {
        const count = feedbacks.filter((fb) => fb.star === star).length;
        const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
        return { star, count, percentage: percentage.toFixed(1) }; // Giữ 1 chữ số thập phân
    });

    return (
        <div className="mt-6">
            {/* Hiển thị số sao trung bình */}
            <div className="mb-4 flex items-center gap-4">
                <h2 className="text-2xl font-bold">📢 Tất cả Feedback ({totalFeedback})</h2>
                <div className="flex items-center gap-2 text-lg font-medium">
                    <span className="text-gray-600 font-medium">⭐ Đánh giá trung bình:</span>
                    <span className="text-lg font-bold text-blue-600">{averageRating()} / 5</span>
                </div>
            </div>

            {/* Biểu đồ đánh giá tổng quan */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Tổng quan đánh giá</h3>
                {starCounts.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 mb-2">
                        <span className="w-10 text-gray-700">⭐{star}</span>
                        <Progress
                            value={percentage}
                            color={star >= 4 ? "green" : "orange"}
                            className="flex-1"
                        />
                        <span className="text-gray-600">{count} đánh giá</span>
                    </div>
                ))}
            </div>

            {/* Bộ lọc feedback theo sao */}
            <div className="mb-4 flex items-center gap-4">
                <span className="text-gray-600 font-medium">Lọc theo sao:</span>
                <Select
                    value={selectedStar}
                    onChange={setSelectedStar}
                    data={[
                        { value: "all", label: "🌟 Tất cả" },
                        ...starCounts.map(({ star, count }) => ({
                            value: String(star),
                            label: `⭐${star} (${count})`,
                        })),
                    ]}
                    radius="lg"
                    size="md"
                />
            </div>

            {/* Danh sách feedback với animation */}
            <div className="space-y-6">
                <AnimatePresence>
                    {displayedFeedbacks.map((fb) => (
                        <motion.div
                            key={fb.ID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card
                                shadow="md"
                                p="lg"
                                className="border rounded-xl hover:shadow-lg transition-all"
                            >
                                {/* Header Feedback */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar src={fb.Customer.avatar} size="lg" radius="xl" />
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {fb.Customer.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {fb.Customer.userEmail}
                                            </p>
                                            <Rating value={fb.star} readOnly size="sm" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        🕒{" "}
                                        {formatDistanceToNow(new Date(fb.createdAt), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </p>
                                </div>

                                {/* Nội dung feedback */}
                                <p className="mt-3 text-gray-700">{fb.content}</p>

                                {/* Hình ảnh feedback (nếu có) */}
                                {fb.Media?.MediaItems?.length > 0 && (
                                    <div className="mt-2 flex space-x-2">
                                        {fb.Media.MediaItems.map((img) => (
                                            <Image
                                                key={img.ID}
                                                src={img.mediaItemURL}
                                                alt="Feedback image"
                                                className="w-20 h-20 rounded-lg object-cover border"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Chi tiết sản phẩm đã mua */}
                                <Accordion variant="separated" className="mt-4">
                                    <Accordion.Item value="product">
                                        <Accordion.Control>
                                            📦 Chi tiết sản phẩm đã mua
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">
                                                        {fb.OrderItem?.ProductIT?.product_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {fb.OrderItem?.ProductIT?.description}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Số lượng: {fb.OrderItem?.quantity}
                                                    </p>
                                                    <p className="text-sm font-bold text-blue-600">
                                                        💰 Giá:{" "}
                                                        {fb.OrderItem?.price.toLocaleString()} VND
                                                    </p>
                                                </div>
                                                <Image
                                                    src="https://shopmebi.com/wp-content/uploads/2023/07/ao-so-mi-nam-dai-tay-uniqlo-goods_57_453156_edited.jpeg"
                                                    alt="Ảnh sản phẩm"
                                                    className="w-20 h-20 rounded-md object-cover border"
                                                />
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                {/* Phản hồi từ shop */}
                                {fb.Reply && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="text-sm font-bold">💬 Phản hồi từ shop</h4>
                                        <p className="text-gray-700">{fb.Reply.content}</p>
                                        <div className="flex items-center mt-2">
                                            <Avatar
                                                src={fb.Reply.ReplyUser.avatar}
                                                size="sm"
                                                radius="xl"
                                            />
                                            <span className="ml-2 text-sm text-gray-500">
                                                {fb.Reply.ReplyUser.fullName}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Nút Xem thêm / Thu gọn với animation */}
            <div className="mt-6 text-center">
                {visibleCount < filteredFeedbacks.length ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Button
                            onClick={() => setVisibleCount(visibleCount + 2)}
                            radius="xl"
                            size="md"
                            variant="outline"
                            color="blue"
                        >
                            Xem thêm feedback
                        </Button>
                    </motion.div>
                ) : (
                    visibleCount > 5 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button
                                onClick={() => setVisibleCount(3)}
                                radius="xl"
                                size="md"
                                variant="outline"
                                color="red"
                            >
                                Thu gọn feedback
                            </Button>
                        </motion.div>
                    )
                )}
            </div>
        </div>
    );
};

const ShopProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useShop(id);
    const [selectedImage, setSelectedImage] = useState(null);
    const shop = data?.shop;
    const products = data?.products;
    // const [banInfo, setBanInfo] = useState(null);

    // Ensure hooks are always called in the same order
    // useEffect(() => {
    //     if (!shop?.shopID) return;

    //     const fetchBanInfo = async () => {
    //         try {
    //             const isUserBan = await BanService.getBanAccount(shop.shopID, "shop");
    //             if (isUserBan) {
    //                 setBanInfo(isUserBan);
    //             }
    //         } catch (error) {
    //             console.error("Lỗi khi lấy thông tin ban:", error);
    //         }
    //     };

    //     fetchBanInfo();
    // }, [shop?.shopID]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error || !shop) {
        return <div className="flex justify-center items-center h-screen">Shop not found</div>;
    }

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

    // Hàm xử lý scroll xuống phần feedback
    const scrollToFeedback = () => {
        document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" });
    };

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
                        {/* {shop.shopStatus === "suspended" && (
                            <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md flex items-center gap-3">
                                <IconAlertCircle size={24} className="text-red-600" />
                                <p className="text-sm text-red-800 font-medium">
                                    Tài khoản bị đình chỉ đến:{" "}
                                    <span className="font-semibold text-red-900">
                                        {new Date(data.banInfo.banEnd).toLocaleString("vi-VN")}
                                    </span>
                                </p>
                            </div>
                        )} */}
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
                                <Table striped highlightOnHover withBorder>
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

                        <Table striped highlightOnHover withBorder>
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
                <div className="w-full flex flex-col lg:flex-row gap-6 px-4">
                    {/* Biểu đồ */}
                    <div className="w-full lg:w-1/2">
                        <DashboardChart />
                    </div>

                    {/* Đánh giá từ AI */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <IconRobot size={28} className="text-blue-500" />
                            Đánh giá tổng quan từ AI
                        </h2>

                        <div className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg text-white text-lg italic relative">
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 blur-lg rounded-xl" />
                            {data.feedbacks.aiReview === undefined ? (
                                <p>Tạm thời cửa hàng chưa có đánh giá nào!!!</p>
                            ) : (
                                <p>“{data.feedbacks.aiReview}”</p>
                            )}
                        </div>

                        {/* Nút Xem feedback */}
                        <div className="mt-4 flex justify-center">
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
                </div>

                {/* <div className="w-full mx-auto p-8 bg-white mt-8"></div> */}
                <div className="container mx-auto p-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 uppercase tracking-wider my-6">
                        🛍 Danh sách sản phẩm
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="p-3 border-b">Hình ảnh</th>
                                    <th className="p-3 border-b">Tên sản phẩm</th>
                                    <th className="p-3 border-b">Mô tả</th>
                                    <th className="p-3 border-b text-center">Giá (VND)</th>
                                    <th className="p-3 border-b text-center">Đã bán</th>
                                    <th className="p-3 border-b text-center">Đánh giá</th>
                                    <th className="p-3 border-b text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((product) => {
                                    // Tính tổng số lượng đã bán
                                    const totalSold =
                                        product.OrderItems?.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0,
                                        ) || 0;

                                    // Tính trung bình số sao từ feedbacks
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
                                            {/* Hình ảnh sản phẩm */}
                                            <td className="p-3">
                                                <img
                                                    src={
                                                        product.main_image ||
                                                        "https://cdn.shopify.com/s/files/1/0681/2821/1221/files/hipster-ban-phoi-thanh-thi-phong-khoang-1024x1024_480x480.jpg?v=1699854796"
                                                    }
                                                    alt={product.product_name}
                                                    className="w-20 h-20 object-cover rounded-lg border"
                                                />
                                            </td>

                                            {/* Tên sản phẩm */}
                                            <td className="p-3 font-semibold">
                                                {product.product_name}
                                            </td>

                                            {/* Mô tả */}
                                            <td className="p-3 text-gray-600">
                                                {product.description}
                                            </td>

                                            {/* Giá */}
                                            <td className="p-3 text-center font-semibold">
                                                {Number(product.price).toLocaleString()}
                                            </td>

                                            {/* Tổng số lượng bán */}
                                            <td className="p-3 text-center text-blue-600">
                                                {totalSold}
                                            </td>

                                            {/* Đánh giá trung bình */}
                                            <td className="p-3 text-center text-yellow-500">
                                                {averageStars} ⭐
                                            </td>

                                            {/* Nút Xem chi tiết */}
                                            <td className="p-3 text-center">
                                                <button
                                                    type="button" // 🔹 Thêm type="button" để tránh lỗi
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                                    onClick={() =>
                                                        alert(
                                                            `Xem chi tiết sản phẩm: ${product.product_name}`,
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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
