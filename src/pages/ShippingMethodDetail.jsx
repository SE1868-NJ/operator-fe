import { Badge, Button, Card, Loader, Table, Text, Title } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useShippingMethod } from "../hooks/useShippingMethod";
import ShippingMethodService from "../services/ShippingMethodService";

const ShippingMethodDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: method, isFetching, error } = useShippingMethod(id);
    const queryClient = useQueryClient();

    if (isFetching) return <Loader />;
    if (error) return <p className="text-red-500">Lỗi: {error.message}</p>;
    if (!method) return <p>Không tìm thấy phương thức vận chuyển.</p>;

    const options = JSON.parse(method.options || "{}");

    const handleDeleteMethod = async () => {
        nprogress.start();
        await ShippingMethodService.delete(id)
            .catch((error) => {
                console.error("Lỗi khi xóa phương thức vận chuyển:", error);
            })
            .finally(() => {
                nprogress.complete();
                queryClient.invalidateQueries(["shipping-methods"]);
                navigate("/main/shipping-methods");
            });
    };

    return (
        <div className="p-6 mx-auto">
            <Card shadow="sm" padding="lg" radius="md" className="space-y-4">
                <div className="max-w-screen-md space-y-4">
                    <Title order={2}>{method.name}</Title>
                    <Badge color={method.status === "enabled" ? "green" : "red"}>
                        {method.status === "enabled" ? "Đang bật" : "Đã tắt"}
                    </Badge>
                    <Text>Phí vận chuyển mặc định: {method.shippingFee} VND</Text>
                    <Text>Thời gian chuẩn bị ước tính: {method.preparationTime / 60} giờ</Text>
                    <Text>Thời gian giao hàng ước tính: {method.estimatedDeliveryTime / 60} giờ</Text>

                    <Title order={4}>Tùy chọn</Title>
                    <Table>
                        <tbody>
                            {Object.entries(options).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="font-medium capitalize">{key}</td>
                                    <td>{value ? "Có" : "Không"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Title order={4}>Yếu tố bên ngoài</Title>
                    <Table>
                        <tbody>
                            {Object.entries(method.externalFactors || {}).map(([key, factor]) => (
                                <tr key={key}>
                                    <td className="font-medium capitalize">{key}</td>
                                    <td>Được bật: {factor.enabled ? "Có" : "Không"}</td>
                                    <td>Mức độ: {factor.level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Text className="text-gray-500 text-sm">
                        Cập nhật lần cuối: {new Date(method.updatedAt).toLocaleString()}
                    </Text>
                    <Button variant="light" color="red" onClick={handleDeleteMethod}>
                        Xóa phương thức vận chuyển
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ShippingMethodDetail;
