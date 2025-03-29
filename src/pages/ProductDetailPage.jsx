import {
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Image,
    Loader,
    Stack,
    Table,
    Text,
    Modal,
    Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmailModal from "../components/ShopEmail";
import { useProduct } from "../hooks/useShop";
import BanService from "../services/BanService";
import { useQueryClient } from "@tanstack/react-query";
import { useAccountProfile } from "../hooks/useAccountProfile";
const ProductDetail = () => {
    const { id, pid } = useParams();
    const { data, isLoading, error } = useProduct(id, pid);
    const product = data?.data;
    const [modalOpened, setModalOpened] = useState(false);
    const navigate = useNavigate();

    console.log(product)

    const [unbantModalOpen, setUnbanModalOpen] = useState(false);
    const [reason, setReason] = useState("");
    const queryClient = useQueryClient();

    const {
        data: operatorData,
        isLoadingOperator,
        errorOperator,
    } = useAccountProfile();

    //Hàm xử lý ban
    const handleStatusChange = async () => {
        if (product.status === "active" && !banInfo) {
            navigate(
                `/main/ban_account?userId=${product?.product_id}&userName=${product.product_name}&operatorId=${operatorData.operatorID}&accountType=product`,
            );
        } else {
            if (banInfo?.status === "banned") {
                await BanService.unbanAccountManually(product?.product_id, "product", "");
            } else if (banInfo?.status === "scheduled") {
                await BanService.cancelBanScheduled(product?.product_id, "product", "");
            }
            window.location.reload();
        }
        queryClient.invalidateQueries(["product"]);
    };
    const [banInfo, setBanInfo] = useState(null);

    // Ensure hooks are always called in the same order
    useEffect(() => {
        if (!product?.product_id) return;

        const fetchBanInfo = async () => {
            try {
                const isUserBan = await BanService.getBanAccount(product?.product_id, "product");
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
    }, [product?.product_id]);

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
    };
    if (!product) return;
    if (error) return <Alert color="red">Error: {error.message}</Alert>;


    return (
        <Container size="lg" px="md">
            {/* Thông tin sản phẩm */}
            <Card shadow="lg" padding="xl" radius="md" withBorder>
                <Group
                    align="center"
                    spacing="lg"
                    noWrap
                    style={{ display: "flex", width: "100%" }}
                >
                    {/* Ảnh sản phẩm (chiếm 50%) */}
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <Image
                            src={product?.main_image}
                            alt={product?.product_name}
                            width={100} // Giảm kích thước ảnh
                            height={100}
                            radius="md"
                            fit="contain"
                            style={{
                                border: "1px solid #eee",
                                backgroundColor: "#f9f9f9",
                                padding: "6px",
                            }}
                        />
                    </div>

                    {/* Nội dung sản phẩm (chiếm 50%) */}
                    <Stack spacing="xs" style={{ flex: 4 }}>
                        {/* Tên sản phẩm */}
                        <Text
                            size="xl"
                            weight={700}
                            style={{ color: "#222", lineHeight: 1.3, fontSize: "1.5rem" }}
                        >
                            {product?.product_name}
                        </Text>

                        {/* Mô tả sản phẩm */}
                        <Text size="sm" color="gray" lineClamp={2} style={{ fontStyle: "italic" }}>
                            {product?.description}
                        </Text>

                        {/* Giá sản phẩm */}
                        <Badge
                            size="xl"
                            radius="lg"
                            variant="filled"
                            style={{
                                backgroundColor: "blue",
                                color: "white",
                                fontSize: "1.1rem",
                                padding: "6px 12px",
                                fontWeight: 700,
                            }}
                        >
                            {Number(product.price).toLocaleString()} VND
                        </Badge>

                        <Badge
                            color={product?.quantity > 0 ? "green" : "gray"}
                            variant="light"
                            size="md"
                        >
                            {product?.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                        </Badge>
                    </Stack>
                </Group>
                <div>
                    {product.status === "active" && banInfo && (
                        <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded-md shadow-md">
                            <div className="text-sm text-yellow-800 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-600 font-bold">
                                        &#x26A0;
                                    </span>
                                    <span>Sản phẩm này sẽ bị tạm dừng từ:</span>
                                    <span className="font-semibold text-yellow-900">
                                        {new Date(banInfo.banStart).toLocaleString("vi-VN")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-600 font-bold">
                                        &#x26A0;
                                    </span>
                                    <span>Sản phẩm này sẽ bị tạm dừng đến:</span>
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
                    {product.status === "suspended" && banInfo && (
                        <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
                            <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                                <span className="text-red-600 font-bold">&#x21;</span>
                                <span>Sản phẩm bị tạm dừng đến:</span>
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
                </div>
            </Card>

            <Divider my="lg" />

            {/* Lịch sử đơn hàng */}
            <Text size="xl" weight={600} mt={20}>
                Lịch sử đơn hàng
            </Text>
            {product?.OrderItems?.length > 0 ? (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Table
                        highlightOnHover
                        striped
                        withBorder
                        withColumnBorders
                        style={{ borderRadius: "8px", overflow: "hidden" }}
                    >
                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                            <tr>
                                <th style={{ textAlign: "left", padding: "12px" }}>Người mua</th>
                                <th style={{ textAlign: "left", padding: "12px" }}>Email</th>
                                <th style={{ textAlign: "left", padding: "12px" }}>Order ID</th>

                                <th style={{ textAlign: "center", padding: "12px" }}>Trạng thái</th>
                                <th style={{ textAlign: "right", padding: "12px" }}>Xem đơn hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product?.OrderItems?.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ padding: "12px" }}>
                                        {order.Order?.Customer?.fullName}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {order.Order?.Customer?.userEmail}
                                    </td>
                                    <td style={{ padding: "12px" }}>#{order.order_id}</td>

                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        <Badge
                                            color={
                                                order?.Order?.status === "completed"
                                                    ? "green"
                                                    : order?.Order?.status === "cancelled"
                                                        ? "red"
                                                        : "yellow"
                                            }
                                        >
                                            {order?.Order?.status}
                                        </Badge>
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "right" }}>
                                        <Button
                                            color="blue"
                                            type="button"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                            onClick={() => navigate(`/main/orderdetail/${order.order_id}`)}
                                        >
                                            Xem
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            ) : (
                <Text color="gray" mt="sm">
                    Chưa có đơn hàng nào.
                </Text>
            )}

            <Divider my="lg" />
            <Modal
                opened={unbantModalOpen}
                onClose={() => setUnbanModalOpen(false)}
                title="Xác nhận"
            >
                <Text>Bạn có chắc chắn muốn cho phép sản phẩm này bán trở lại?</Text>
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

            {/* Feedback */}
            <Text size="xl" weight={600} mt={20}>
                Feedback về sản phẩm
            </Text>
            {product?.OrderItems?.some((item) => item.Feedbacks) ? (
                product.OrderItems.filter((item) => item.Feedbacks).map((order) => (
                    <Card key={order.id} shadow="sm" padding="md" radius="md" mt="md" withBorder>
                        <Group>
                            <Avatar src={order.Feedbacks.Customer.avatar} radius="xl" size="lg" />
                            <Stack spacing={4}>
                                <Text weight={500}>{order.Feedbacks.Customer.fullName}</Text>
                                <Text size="sm" color="gray">
                                    {order.Feedbacks.content}
                                </Text>
                                <Text size="xs" color="dimmed">
                                    ⭐ {order.Feedbacks.star}/5
                                </Text>
                            </Stack>
                        </Group>
                    </Card>
                ))
            ) : (
                <Text mt="sm">Chưa có feedback nào.</Text>
            )}
            <div className="flex justify-end mt-6 w-full gap-4">
                <Button
                    color="red"
                    type="button"
                    onClick={() => {
                        if (product.status === "active" && !banInfo) {
                            handleStatusChange();
                        } else if (
                            banInfo?.status === "banned" ||
                            banInfo?.status === "scheduled"
                        ) {
                            setUnbanModalOpen(true);
                        }
                    }}
                    className={`${product.status === "active" && !banInfo
                        ? "bg-yellow-500 hover:bg-yellow-700 text-white"
                        : banInfo?.status === "banned"
                            ? "bg-green-500 hover:bg-green-700 text-white"
                            : "bg-blue-500 hover:bg-blue-700 text-white" // Nếu là "Không hoạt động"
                        } px-4 py-2 rounded`}
                >
                    {
                        product.status === "active" && !banInfo
                            ? "Tạm dừng bán sản phẩm"
                            : banInfo?.status === "banned"
                                ? "Cho phép tiếp tục bán sản phẩm"
                                : "Hủy lịch tạm dừng bán sản phẩm này" // Nếu là "Không hoạt động"
                    }
                </Button>
                <Button color="cyan" onClick={() => setModalOpened(true)}>
                    📩 Gửi Email
                </Button>
                <EmailModal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    shopId={id}
                />
            </div>
        </Container>
    );
};

export default ProductDetail;
