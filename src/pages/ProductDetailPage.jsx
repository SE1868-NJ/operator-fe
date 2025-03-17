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
} from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmailModal from "../components/ShopEmail";
import { useProduct } from "../hooks/useShop";
import BanService from "../services/BanService";
const ProductDetail = () => {
    const { id, pid } = useParams();
    const { data, isLoading, error } = useProduct(id, pid);
    const product = data?.data;
    const [modalOpened, setModalOpened] = useState(false);

    //Hàm xử lý ban
    const handleStatusChange = async () => {
        if (product?.product_id === "active") {
            const token = localStorage.getItem("token");
            const operatorData = jwtDecode(token);
            console.log(operatorData);
            navigate(
                `/main/ban_account?userId=${product?.product_id}&userName=${product?.product_name}&operatorId=1&accountType=product`,
            );
        } else {
            const confirmUnban = window.confirm("Bạn có muốn gỡ đình chỉ tài khoản này không?");
            if (confirmUnban) {
                await BanService.unbanAccountManually(product.product_id);
                window.location.reload();
            }
        }
    };
    const [banInfo, setBanInfo] = useState(null);

    // Ensure hooks are always called in the same order
    useEffect(() => {
        if (!product?.product_id) return;

        const fetchBanInfo = async () => {
            try {
                const isUserBan = await BanService.getBanAccount(product.product_id, "shop");
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

    if (isLoading) return <Loader size="xl" />;
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
                    {product.status === "suspended" && (
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
                </Group>
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
                                <th style={{ textAlign: "center", padding: "12px" }}>Số lượng</th>
                                <th style={{ textAlign: "right", padding: "12px" }}>Giá</th>
                                <th style={{ textAlign: "center", padding: "12px" }}>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.OrderItems.map((order) => (
                                <tr key={order.id}>
                                    <td style={{ padding: "12px" }}>
                                        {order.Order.Customer.fullName}
                                    </td>
                                    <td style={{ padding: "12px" }}>
                                        {order.Order.Customer.userEmail}
                                    </td>
                                    <td style={{ padding: "12px" }}>#{order.order_id}</td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        {order.quantity}
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "right" }}>
                                        {Number(order.total).toLocaleString()} VND
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                        <Badge
                                            color={
                                                order.Order.status === "completed"
                                                    ? "green"
                                                    : order.Order.status === "cancelled"
                                                      ? "red"
                                                      : "yellow"
                                            }
                                        >
                                            {order.Order.status}
                                        </Badge>
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
                    onClick={() => handleStatusChange()}
                    className={`${
                        product.status === "active"
                            ? "bg-red-500 hover:bg-yellow-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md"
                            : product.status === "suspended"
                              ? "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md"
                              : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition-all duration-300 shadow-md" // Nếu là "Không hoạt động"
                    } px-4 py-2 rounded`}
                >
                    {
                        product.status === "active"
                            ? "Đình chỉ sản phẩm"
                            : product.status === "suspended"
                              ? "Gỡ đình sản phẩm"
                              : "Kích hoạt sản phẩm" // Nếu là "Không hoạt động"
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
