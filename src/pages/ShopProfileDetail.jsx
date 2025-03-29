import { Avatar, Badge, Button, Card, Grid, Image, Table, Modal, Textarea, Group, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeedbackChat from "../components/FeedbackChat";
import EmailModal from "../components/ShopEmail";
import { useShop } from "../hooks/useShop";
import BanService from "../services/BanService";
import { Loader } from '@mantine/core';
import { useAccountProfile } from "../hooks/useAccountProfile";
import { useQueryClient } from "@tanstack/react-query";

const ShopProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [unbantModalOpen, setUnbanModalOpen] = useState(false);
    const [reason, setReason] = useState("");


    //Lay thong tin shop
    const { data, isLoading, error } = useShop(id);
    const queryClient = useQueryClient();
    const {
        data: operatorData,
        isLoadingOperator,
        errorOperator,
    } = useAccountProfile();

    const shop = data?.shop;

    const [selectedImage, setSelectedImage] = useState(null);

    const [modalOpened, setModalOpened] = useState(false);

    //Hàm xử lý ban
    const handleStatusChange = async () => {
        if (shop.shopStatus === "active" && !banInfo) {
            navigate(
                `/main/ban_account?userId=${shop.shopID}&userName=${shop.shopName}&operatorId=${operatorData.operatorID}&accountType=shop`,
            );
        } else {
            if (banInfo?.status === "banned") {
                await BanService.unbanAccountManually(shop.shopID, "shop", "");
            } else if (banInfo?.status === "scheduled") {
                await BanService.cancelBanScheduled(shop.shopID, "shop", "");
            }
            window.location.reload();
        }
        queryClient.invalidateQueries(["shops"]);
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
        return (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
                <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-lg">
                    <Loader color="blue" size="sm" variant="bars" />
                    <span className="text-gray-700 font-medium text-lg">
                        Đang tải dữ liệu, vui lòng chờ...
                    </span>
                </div>
            </div>
        );
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

                                {/* <p className="text-2xl font-bold text-gray-800 mt-4 flex items-center gap-2">
                                    Đánh giá cửa hàng
                                </p>
                                <p className="text-yellow-500 mt-2 text-lg font-semibold">
                                    ⭐ {shop.shopRating}/5
                                </p> */}
                            </div>
                        </div>


                        {/* Nếu shop bị đình chỉ */}
                        {/* {shop.shopStatus === "suspended" && (
                            <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md flex items-center gap-3">
                                <IconAlertCircle size={24} className="text-red-600" />
                                <p className="text-sm text-red-800 font-medium">
                                    Tài khoản bị đình chỉ đến:{" "}
                                    <span className="font-semibold text-red-900">
                                        {new Date(banInfo?.banEnd).toLocaleString("vi-VN")}
                                    </span>
                                </p>
                            </div>
                        )} */}
                        {/* Nếu status là "Hoạt động", hiển thị thêm thời gian đặt lịch ban */}
                        {shop.shopStatus === "active" && banInfo && (
                            <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded-md shadow-md">
                                <div className="text-sm text-yellow-800 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-600 font-bold">
                                            &#x26A0;
                                        </span>
                                        <span>Tài khoản của bạn sẽ bị đình chỉ từ:</span>
                                        <span className="font-semibold text-yellow-900">
                                            {new Date(banInfo.banStart).toLocaleString("vi-VN")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-600 font-bold">
                                            &#x26A0;
                                        </span>
                                        <span>Tài khoản của bạn sẽ bị đình chỉ đến:</span>
                                        <span className="font-semibold text-yellow-900">
                                            {new Date(banInfo.banEnd).toLocaleString("vi-VN")}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded-md">
                                    <p className="text-sm text-yellow-700">
                                        <span className="font-semibold">⚠ Lý do: </span>{" "}
                                        {banInfo.reason}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Nếu status là "Đình chỉ", hiển thị thêm thời gian ban */}
                        {shop.shopStatus === "suspended" && banInfo && (
                            <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
                                <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                                    <span className="text-red-600 font-bold">&#x21;</span>
                                    <span>Tài khoản bị đình chỉ đến:</span>
                                    <span className="font-semibold text-red-900">
                                        {new Date(banInfo.banEnd).toLocaleString("vi-VN")}
                                    </span>
                                </p>
                                <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded-md">
                                    <p className="text-sm text-red-700">
                                        <span className="font-semibold">Lý do: </span>{" "}
                                        {banInfo.reason}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                    <div>
                        <FeedbackChat shopId={id} />
                    </div>
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
                                color={shop.shopStatus === "active" ? "green" : shop.shopStatus === "suspended" ? "red" : "yellow"}
                                className="text-sm mt-2 px-4 py-2"
                            >
                                {shop.shopStatus === "active" ? "Đang hoạt động" : "Bị tạm dừng"}
                            </Badge>
                        </div>
                        <div className="flex justify-end mt-6 w-full gap-4">
                            <Button
                                color="red"
                                type="button"
                                onClick={() => {
                                    if (shop.shopStatus === "active" && !banInfo) {
                                        handleStatusChange();
                                    } else if (
                                        banInfo?.status === "banned" ||
                                        banInfo?.status === "scheduled"
                                    ) {
                                        setUnbanModalOpen(true);
                                    }
                                }}
                                className={`${shop.shopStatus === "active" && !banInfo
                                        ? "bg-yellow-500 hover:bg-yellow-700 text-white"
                                        : banInfo?.status === "banned"
                                            ? "bg-green-500 hover:bg-green-700 text-white"
                                            : "bg-blue-500 hover:bg-blue-700 text-white" // Nếu là "Không hoạt động"
                                    } px-4 py-2 rounded`}
                            >
                                {
                                    shop.shopStatus === "active" && !banInfo
                                        ? "Đình chỉ người dùng"
                                        : banInfo?.status === "banned"
                                            ? "Gỡ đình chỉ người dùng"
                                            : "Hủy lịch đình chỉ người dùng" // Nếu là "Không hoạt động"
                                }
                            </Button>
                            {/* <Button
                                color="red"
                                type="button"
                                onClick={() => handleStatusChange()}
                                className={`${shop.shopStatus === "active"
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
                            </Button> */}

                            <Button
                                color="blue"
                                type="button"
                                onClick={() => navigate("/main/shops")}
                            >
                                Quay lại danh sách shop
                            </Button>
                            <Button color="cyan" onClick={() => setModalOpened(true)}>
                                📩 Gửi Email cho shop
                            </Button>
                            <EmailModal
                                opened={modalOpened}
                                onClose={() => setModalOpened(false)}
                                shopId={id}
                            />
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
                <div className="mt-8 pt-1 rounded-lg">
                    {/* Nút Xem feedback */}
                    <div className="flex justify-center mb-6">
                        <Button
                            onClick={() => navigate(`/main/shop/${id}/statistic`)}
                            radius="lg"
                            size="md"
                            color="blue"
                            variant="outline"
                        >
                            Xem thống kê chi tiết của shop
                        </Button>
                    </div>
                </div>
                {/* Modal xác nhận gỡ ban người dùng */}
                <Modal
                    opened={unbantModalOpen}
                    onClose={() => setUnbanModalOpen(false)}
                    title="Xác nhận"
                >
                    <Text>Bạn có chắc chắn muốn gỡ đình chỉ người dùng này?</Text>
                    <Textarea
                        label="Lý do gỡ đình chỉ"
                        placeholder="Nhập lý do..."
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        mt="md"
                        required
                    />
                    <Group position="right" mt="md">
                        <Button variant="default" onClick={() => setUnbanModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button color="green" onClick={handleStatusChange}>
                            Xác nhận
                        </Button>
                    </Group>
                </Modal>
            </div>

        </div>
    );
};

export default ShopProfileDetail;
