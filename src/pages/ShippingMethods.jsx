import {
    Button,
    Card,
    Container,
    Divider,
    Grid,
    Group,
    Loader,
    Paper,
    Stack,
    Switch,
    Text,
    Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useShippingMethods } from "../hooks/useShippingMethod";
import ShippingMethodService from "../services/ShippingMethodService";

const ShippingMethods = () => {
    const { data: shippingMethods, isFetching } = useShippingMethods();
    const queryClient = useQueryClient();

    if (isFetching) {
        return (
            <Container
                fluid
                py="md"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                }}
            >
                <Loader size="lg" />
            </Container>
        );
    }

    return (
        <Container fluid py="md">
            <Paper shadow="sm" p="md" withBorder>
                <Group position="apart" mb="md" justify="space-between">
                    <Title order={2}>Phương thức vận chuyển</Title>
                    <Button component={Link} to={"/main/shipping-methods/new"}>
                        Tạo mới
                    </Button>
                </Group>
                <Divider mb="md" />

                <Grid>
                    {shippingMethods.map((method) => (
                        <Grid.Col key={method.id} span={{ base: 12, sm: 6, md: 4 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Stack spacing="md">
                                    <Group position="apart">
                                        <Title order={4}>{method.name}</Title>
                                        <Switch
                                            checked={method.status === "enabled"}
                                            onChange={async () => {
                                                if (method.status === "enabled") {
                                                    await ShippingMethodService.updateStatus(
                                                        method.id,
                                                        "disabled",
                                                    );
                                                    queryClient.invalidateQueries([
                                                        "shipping-methods",
                                                    ]);
                                                } else {
                                                    await ShippingMethodService.updateStatus(
                                                        method.id,
                                                        "enabled",
                                                    );
                                                    queryClient.invalidateQueries([
                                                        "shipping-methods",
                                                    ]);
                                                }
                                            }}
                                        />
                                    </Group>
                                    <Text size="sm" color="dimmed">
                                        {method.autoCalculate
                                            ? "Auto-calculating fee based on weather & time"
                                            : "Manually set the shipping fee"}
                                    </Text>
                                </Stack>
                                <Button
                                    component={Link}
                                    to={`/main/shipping-methods/${method.id}`}
                                    mt={20}
                                >
                                    Xem
                                </Button>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default ShippingMethods;
