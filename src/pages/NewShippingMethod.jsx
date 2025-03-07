import {
    Button,
    Card,
    Checkbox,
    Container,
    Group,
    NumberInput,
    SimpleGrid,
    Stack,
    Switch,
    TextInput,
    Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import ShippingMethodService from "../services/ShippingMethodService";

const NewShippingMethod = () => {
    const [name, setName] = useState("");
    const [autoCalculate, setAutoCalculate] = useState(false);
    const [shippingFee, setShippingFee] = useState("");
    const [preparationTime, setPreparationTime] = useState(0);
    const [deliveryTime, setDeliveryTime] = useState(0);
    const [options, setOptions] = useState({
        express: false,
        fragile: false,
        signature: false,
        weekend: false,
        largeSize: false,
    });

    const [externalFactors, setExternalFactors] = useState({
        trafficDensity: {
            enabled: false,
            level: "MEDIUM",
            multipliers: { HIGH: 1.5, MEDIUM: 1.2, LOW: 1.1 },
        },
        weather: {
            enabled: false,
            level: "MEDIUM",
            multipliers: { HIGH: 1.3, MEDIUM: 1.1, LOW: 1.05 },
        },
    });

    const updateMultiplier = (factor, level, value) => {
        setExternalFactors((prev) => ({
            ...prev,
            [factor]: {
                ...prev[factor],
                multipliers: { ...prev[factor].multipliers, [level]: value },
            },
        }));
    };

    const toggleOption = (option) => {
        setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
    };

    const toggleFactor = (factor) => {
        setExternalFactors((prev) => ({
            ...prev,
            [factor]: { ...prev[factor], enabled: !prev[factor].enabled },
        }));
    };

    const getPayload = () => {
        return {
            name, // You may need to add a state variable for the name input
            autoCalculate,
            shippingFee: shippingFee, // Null if auto-calculate is enabled
            options,
            externalFactors,
            preparationTime: preparationTime * 60, // Convert hours to minutes
            estimatedDeliveryTime: deliveryTime * 60, // Convert hours to minutes
        };
    };

    return (
        <Container fluid py="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ margin: "auto" }}>
                <Title order={3} mb="md">
                    Tạo phương thức vận chuyển mới
                </Title>

                <Stack spacing="md">
                    <TextInput
                        label="Tên phương thức"
                        placeholder="Nhập tên phương thức vận chuyển"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <NumberInput
                        label="Phí vận chuyển mặc định (VNĐ)"
                        placeholder="Nhập phí vận chuyển"
                        value={shippingFee}
                        onChange={setShippingFee}
                        min={0}
                        step={1000}
                        thousandSeparator
                    />

                    <Switch
                        label="Tính phí tự động (Dựa theo thời tiết, thời gian)"
                        checked={autoCalculate}
                        onChange={() => setAutoCalculate(!autoCalculate)}
                    />

                    {autoCalculate && (
                        <Card withBorder shadow="sm" className="space-y-5">
                            <Title order={5} mt="md">
                                Yếu tố ảnh hưởng đến phí vận chuyển
                            </Title>

                            <SimpleGrid cols={2} spacing="lg">
                                {/* <div>
                                    <Switch
                                        label="Mật độ giao thông (Phí cao hơn khi ùn tắc)"
                                        checked={externalFactors.trafficDensity.enabled}
                                        onChange={() => toggleFactor("trafficDensity")}
                                    />
                                    {externalFactors.trafficDensity.enabled && (
                                        <>
                                            <NumberInput
                                                label="Cao (Giao thông ùn tắc)"
                                                value={externalFactors.trafficDensity.multipliers.HIGH}
                                                onChange={(value) => updateMultiplier("trafficDensity", "HIGH", value)}
                                                min={1}
                                                step={0.1}
                                            />
                                            <NumberInput
                                                label="Vừa (Giao thông vừa phải)"
                                                value={externalFactors.trafficDensity.multipliers.MEDIUM}
                                                onChange={(value) => updateMultiplier("trafficDensity", "MEDIUM", value)}
                                                min={1}
                                                step={0.1}
                                            />
                                            <NumberInput
                                                label="Hệ số (Giao thông thông thoáng)"
                                                value={externalFactors.trafficDensity.multipliers.LOW}
                                                onChange={(value) => updateMultiplier("trafficDensity", "LOW", value)}
                                                min={1}
                                                step={0.1}
                                            />
                                        </>
                                    )}
                                </div> */}

                                <div>
                                    <Switch
                                        label="Thời tiết (Phí cao hơn khi trời mưa, bão)"
                                        checked={externalFactors.weather.enabled}
                                        onChange={() => toggleFactor("weather")}
                                    />
                                    {externalFactors.weather.enabled && (
                                        <>
                                            <NumberInput
                                                label="Thời tiết Khắc nghiệt"
                                                value={externalFactors.weather.multipliers.HIGH}
                                                onChange={(value) =>
                                                    updateMultiplier("weather", "HIGH", value)
                                                }
                                                min={1}
                                                step={0.1}
                                            />
                                            <NumberInput
                                                label="Thời tiết xấu"
                                                value={externalFactors.weather.multipliers.MEDIUM}
                                                onChange={(value) =>
                                                    updateMultiplier("weather", "MEDIUM", value)
                                                }
                                                min={1}
                                                step={0.1}
                                            />
                                            <NumberInput
                                                label="Thời tiết đẹp"
                                                value={externalFactors.weather.multipliers.LOW}
                                                onChange={(value) =>
                                                    updateMultiplier("weather", "LOW", value)
                                                }
                                                min={1}
                                                step={0.1}
                                            />
                                        </>
                                    )}
                                </div>
                            </SimpleGrid>
                        </Card>
                    )}

                    <Title order={5} mt="md">
                        Thời gian giao hàng
                    </Title>
                    <NumberInput
                        label="Thời gian chuẩn bị hàng (giờ)"
                        placeholder="Nhập số giờ chuẩn bị"
                        value={preparationTime}
                        onChange={setPreparationTime}
                        min={0}
                    />
                    <NumberInput
                        label="Ước tính thời gian giao hàng (giờ)"
                        placeholder="Nhập số giờ giao hàng dự kiến"
                        value={deliveryTime}
                        onChange={setDeliveryTime}
                        min={0}
                    />

                    <Title order={5} mt="md">
                        Tuỳ chọn bổ sung
                    </Title>
                    <Checkbox
                        label="Giao nhanh"
                        checked={options.express}
                        onChange={() => toggleOption("express")}
                    />
                    <Checkbox
                        label="Gói hàng dễ vỡ"
                        checked={options.fragile}
                        onChange={() => toggleOption("fragile")}
                    />
                    <Checkbox
                        label="Yêu cầu chữ ký"
                        checked={options.signature}
                        onChange={() => toggleOption("signature")}
                    />
                    <Checkbox
                        label="Giao cuối tuần"
                        checked={options.weekend}
                        onChange={() => toggleOption("weekend")}
                    />
                    <Checkbox
                        label="Hàng kích thước lớn"
                        checked={options.largeSize}
                        onChange={() => toggleOption("largeSize")}
                    />

                    <Group position="right" mt="lg">
                        <Button variant="outline" color="gray">
                            Hủy
                        </Button>
                        <Button
                            color="blue"
                            onClick={async () => {
                                ShippingMethodService.create(getPayload()).then(() => {
                                    notifications.show({
                                        color: "green",
                                        title: "Đã tạo thành công!",
                                    });
                                });
                            }}
                        >
                            Lưu phương thức
                        </Button>
                    </Group>
                </Stack>
            </Card>
        </Container>
    );
};

export default NewShippingMethod;
