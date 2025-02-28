// import ShopService from "../services/ShopService.js";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../hooks/useShop";
import BanService from "../services/BanService";

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
//Chart

import { Bar, Line, Pie } from "react-chartjs-2";

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
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.3,
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
            },
        ],
    };

    const pieData = {
        labels: ["Gấu Teddy", "Thỏ Bông", "Mèo Bông", "Cá Mập Bông", "Khủng Long"],
        datasets: [
            {
                data: [30, 20, 25, 15, 10],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Thống kê bán hàng" },
        },
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thống kê bán hàng</h2>

            {/* Dropdown chọn biểu đồ */}
            <div className="mb-4">
                <select
                    onChange={(e) => setSelectedChart(e.target.value)}
                    value={selectedChart}
                    className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="line">📈 Doanh thu theo tháng</option>
                    <option value="bar">📊 Sản phẩm bán chạy</option>
                    <option value="pie">🥧 Doanh thu theo danh mục</option>
                </select>
            </div>

            {/* Biểu đồ */}
            <div className="w-full h-[400px] flex justify-center items-center">
                {selectedChart === "line" && <Line data={lineData} options={options} />}
                {selectedChart === "bar" && <Bar data={barData} options={options} />}
                {selectedChart === "pie" && <Pie data={pieData} options={options} />}
            </div>
        </div>
    );
};

//Feedback:
const feedbacks = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        rating: 5,
        comment: "Sản phẩm rất đẹp, chất lượng tuyệt vời! Sẽ tiếp tục ủng hộ shop.",
        date: "20/02/2025",
    },
    {
        id: 2,
        name: "Trần Thị B",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        rating: 4,
        comment: "Giao hàng nhanh, đóng gói cẩn thận. Tuy nhiên, màu sắc hơi khác.",
        date: "18/02/2025",
    },
    // {
    //     id: 3,
    //     name: "Lê Văn C",
    //     avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    //     rating: 5,
    //     comment: "Shop phục vụ rất nhiệt tình, sản phẩm đẹp hơn mong đợi!",
    //     date: "15/02/2025",
    // },
];

const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
};

const CustomerFeedback = () => {
    return (
        <div className="bg-white p-6 shadow-md rounded-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Phản hồi từ khách hàng</h2>
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div
                        key={feedback.id}
                        className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                    >
                        <img
                            src={feedback.avatar}
                            alt={feedback.name}
                            className="w-16 h-16 rounded-full border-2 border-gray-300 shadow"
                        />
                        <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-900">{feedback.name}</p>
                            <p className="text-yellow-500 text-sm">
                                🕒 {feedback.date} {renderStars(feedback.rating)}
                            </p>
                            <p className="text-gray-700 mt-1">{feedback.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

//San pham gia
const productsData = [
    {
        id: 1,
        name: "Burger Full Toping",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/1200px-Burger_King_2020.svg.png",
        category: "Fast Food",
        description: "Delicious burger with full toping",
        createdAt: "2023-01-01",
        price: "$10",
        status: "Active",
    },
    {
        id: 2,
        name: "Pizza",
        image: "https://image.kkday.com/v2/image/get/w_960%2Cc_fit%2Cq_55%2Ct_webp/s1.kkday.com/product_139606/20231027115630_EmNWF/png",
        category: "Fast Food",
        description: "Delicious pizza with full toping",
        createdAt: "2023-02-01",
        price: "$20",
        status: "Active",
    },

    {
        id: 3,
        name: "Banh Mi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAg5nrWcTsX4F_pUiu73dnQVzufJ5zE9PLCg&s",
        category: "Fast Food",
        description: "Delicious banh mi with full toping",
        createdAt: "2023-03-01",
        price: "$5",
        status: "Deactive",
    },
];
const ShopProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: shop, isLoading, error } = useShop(id);
    const [selectedImage, setSelectedImage] = useState(null);
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

    return (
        <div className="flex w-full bg-white-100 min-h-screen">
            <div className="w-full mx-auto p-8 bg-white mt-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">{shop.shopName}</h1>

                <div className="flex flex-col lg:flex-row gap-12 mb-8 items-start">
                    {/* Thông tin cửa hàng */}
                    <div className="gap-6 bg-white p-6 rounded-lg w-full lg:w-1/2">
                        <div className="flex gap-6">
                            <img
                                src="https://img.lovepik.com/free-png/20210918/lovepik-e-shop-png-image_400245565_wh1200.png"
                                alt={shop.shopName}
                                className="w-40 h-40 rounded-full shadow-lg border-4 border-gray-200 hover:border-blue-400 transition-all duration-300"
                            />
                            <div>
                                <p className="text-2xl font-bold text-gray-800">Mô tả cửa hàng</p>
                                <p className="text-gray-700 mt-2 text-lg">{shop.shopDescription}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-4">
                                    Đánh giá cửa hàng
                                </p>
                                <p className="text-yellow-500 mt-2 text-lg font-semibold">
                                    ⭐ {shop.shopRating}/5
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <CustomerFeedback />
                        </div>
                        {/* {shop.shopStatus === "suspended" && banInfo && (
                            <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
                                <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                                    <span className="text-red-600 font-bold">&#x21;</span>
                                    <span>Tài khoản bị đình chỉ đến:</span>
                                    <span className="font-semibold text-red-900">
                                        {new Date(banInfo.banEnd).toLocaleString("vi-VN")}
                                    </span>
                                </p>
                            </div>
                        )} */}
                    </div>

                    {/* Biểu đồ */}
                    <div className="w-full lg:w-1/2">
                        <DashboardChart />
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Bảng thông tin chủ cửa hàng */}
                    <table className="table-auto w-1/2 mb-8 shadow-lg rounded-lg overflow-hidden border border-gray-300">
                        <tbody>
                            <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                                <td
                                    colSpan={2}
                                    className="px-6 py-3 font-bold text-lg text-blue-900 uppercase"
                                >
                                    Thông tin chủ cửa hàng
                                </td>
                            </tr>

                            {[
                                { label: "Họ và tên", value: shop.Owner.fullName },
                                { label: "Ngày sinh", value: shop.Owner.dateOfBirth },
                                { label: "Giới tính", value: shop.Owner.gender },
                                { label: "Email", value: shop.Owner.userEmail },
                                { label: "SĐT", value: shop.Owner.userPhone },
                                { label: "Số định danh cư dân", value: shop.Owner.userCitizenID },
                                { label: "Số CCCD", value: shop.Owner.identificationNumber },
                            ].map((item) => (
                                <tr
                                    key={item.label}
                                    className="hover:bg-gray-50 transition-all duration-200"
                                >
                                    <td className="border px-6 py-3 font-semibold bg-gray-100 text-gray-700">
                                        {item.label}
                                    </td>
                                    <td className="border px-6 py-3">{item.value}</td>
                                </tr>
                            ))}

                            <tr>
                                <td className="border px-6 py-3 font-semibold bg-gray-100 text-gray-700">
                                    CCCD mặt trước
                                </td>
                                <td className="border px-6 py-3">
                                    <div className="relative">
                                        <img
                                            src={shop.Owner.idCardFrontFile}
                                            alt="Mặt trước CCCD"
                                            className="w-32 h-20 border cursor-pointer"
                                            onClick={() =>
                                                setSelectedImage(shop.Owner.idCardFrontFile)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ")
                                                    setSelectedImage(shop.Owner.idCardFrontFile);
                                            }}
                                            aria-label="CCCD Mặt trước" // Add an accessible label
                                        />
                                        <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                            Mặt trước
                                        </span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td className="border px-6 py-3 font-semibold bg-gray-100 text-gray-700">
                                    CCCD mặt sau
                                </td>
                                <td className="border px-6 py-3">
                                    <div className="relative">
                                        <img
                                            src={shop.Owner.idCardBackFile}
                                            alt="Mặt sau CCCD"
                                            className="w-32 h-20 border cursor-pointer"
                                            onClick={() =>
                                                setSelectedImage(shop.Owner.idCardBackFile)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ")
                                                    setSelectedImage(shop.Owner.idCardBackFile);
                                            }}
                                            aria-label="CCCD Mặt sau" // Add an accessible label
                                        />
                                        <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                            Mặt sau
                                        </span>{" "}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                            onClick={() => setSelectedImage(null)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setSelectedImage(null);
                            }}
                            aria-label="Xem ảnh CCCD" // Add an accessible label
                        >
                            <img
                                src={selectedImage}
                                alt="Ảnh CCCD"
                                className="max-w-full max-h-full p-4 bg-white shadow-lg rounded-lg"
                            />
                        </div>
                    )}

                    {/* Bảng thông tin cửa hàng */}
                    <table className="table-auto w-1/2 mb-8 shadow-lg rounded-lg overflow-hidden border border-gray-300">
                        <tbody>
                            <tr className="bg-gradient-to-r from-green-100 to-green-50">
                                <td
                                    colSpan={2}
                                    className="px-6 py-3 font-bold text-lg text-green-900 uppercase"
                                >
                                    Thông tin cửa hàng
                                </td>
                            </tr>

                            {[
                                { label: "Thời gian hoạt động", value: shop.shopOperationHours },
                                { label: "Email", value: shop.shopEmail },
                                { label: "SĐT", value: shop.shopPhone },
                                { label: "Địa chỉ lấy hàng", value: shop.shopPickUpAddress },
                                { label: "Mô hình kinh doanh", value: shop.businessType },
                                { label: "Tài khoản ngân hàng", value: shop.shopBankAccountNumber },
                                { label: "Tên ngân hàng", value: shop.shopBankName },
                                { label: "Mã số thuế", value: shop.taxCode },
                                {
                                    label: "Ngày tham gia",
                                    value: new Date(shop.shopJoinedDate).toLocaleDateString(),
                                },
                            ].map((item) => (
                                <tr
                                    key={item.label}
                                    className="hover:bg-gray-50 transition-all duration-200"
                                >
                                    <td className="border px-6 py-3 font-semibold bg-gray-100 text-gray-700">
                                        {item.label}
                                    </td>
                                    <td className="border px-6 py-3">{item.value}</td>
                                </tr>
                            ))}

                            {/* Trạng thái cửa hàng */}
                            <tr>
                                <td className="border px-6 py-3 font-semibold bg-gray-100 text-gray-700">
                                    Trạng thái
                                </td>
                                <td className="border px-6 py-3">
                                    <span
                                        className={`text-sm font-semibold px-3 py-1 rounded-md ${
                                            shop.shopStatus === "active"
                                                ? "text-green-700 bg-green-100 border border-green-500"
                                                : "text-red-700 bg-red-100 border border-red-500"
                                        }`}
                                    >
                                        {shop.shopStatus === "active"
                                            ? "Đang hoạt động"
                                            : "Bị tạm dừng"}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

                {/* <div className="w-full mx-auto p-8 bg-white mt-8"></div> */}
                <div className="w-full mx-auto p-8 bg-white mt-8">
                    <h1 className="text-4xl font-bold mb-8 text-gray-800">
                        Danh sách sản phẩm của shop
                    </h1>
                    <table className="table-auto w-full mb-8">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Product Name</th>
                                <th className="border px-4 py-2">Image</th>
                                <th className="border px-4 py-2">Category</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Created At</th>
                                <th className="border px-4 py-2">Price</th>
                                <th className="border px-4 py-2">Rating</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.map((product) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2">{product.name}</td>
                                    <td className="border px-4 py-2">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{product.category}</td>
                                    <td className="border px-4 py-2">{product.description}</td>
                                    <td className="border px-4 py-2">{product.createdAt}</td>
                                    <td className="border px-4 py-2">{product.price}</td>
                                    <td className="border px-4 py-2">4.5</td>
                                    <td className="border px-4 py-2">
                                        <span
                                            className={
                                                product.status === "Active"
                                                    ? "text-green-700 bg-green-100 p-1 rounded"
                                                    : "text-red-700 bg-red-100 p-1 rounded"
                                            }
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            type="button"
                                            className="text-blue-500 underline hover:text-blue-700 transition duration-300"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            className="text-red-500 underline ml-4 hover:text-red-700 transition duration-300"
                                            onClick={() => alert("Delete product")}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShopProfileDetail;
