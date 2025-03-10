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

    console.log(method);

    if (isFetching) return <Loader />;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;
    if (!method) return <p>Shipping method not found.</p>;

    const options = JSON.parse(method.options || "{}");

    const handleDeleteMethod = async () => {
        nprogress.start();
        await ShippingMethodService.delete(id)
            .catch((error) => {
                console.log(error);
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
                        {method.status === "enabled" ? "Bật" : "Tắt"}
                    </Badge>
                    <Text>Giá mặc định: {method.shippingFee}</Text>
                    <Text>Ước tính thời gian chuẩn bị: {method.preparationTime} giờ</Text>
                    <Text>Ước tính thời gian giao: {method.estimatedDeliveryTime} giờ</Text>

                    <Title order={4}>Tùy chọn</Title>
                    <Table>
                        <tbody>
                            {Object.entries(options).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="font-medium capitalize">{key}</td>
                                    <td>{value ? "Yes" : "No"}</td>
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
                                    <td>Enabled: {factor.enabled ? "Yes" : "No"}</td>
                                    <td>Level: {factor.level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Text className="text-gray-500 text-sm">
                        Last updated: {new Date(method.updatedAt).toLocaleString()}
                    </Text>
                    <Button variant="light" color="red" onClick={handleDeleteMethod}>
                        Xóa
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ShippingMethodDetail;
