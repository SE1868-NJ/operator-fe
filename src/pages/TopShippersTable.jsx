import { Card, Grid, Table, Text, Title } from "@mantine/core";
import {
    useGetActiveShipperCount,
    useGetTopShippers,
    useGetShippersJoinedToday
} from "../hooks/useShippers"; // Hook để fetch dữ liệu

export default function Top() {
    const { data: topShippers, isLoading } = useGetTopShippers();
    const { data: activeShipperCount, isLoading: isLoadingActive } = useGetActiveShipperCount();
    const { data: shippersJoinedToday, isLoading: isLoadingJoined } = useGetShippersJoinedToday();
    console.log("Active Shipper Count:", activeShipperCount);

    if (isLoading || isLoadingActive || isLoadingJoined) return <p className="text-lg font-semibold text-center">Loading data...</p>;

    return (
        <div className="p-6">
            <Grid gutter="md">
                {/* Thống kê shipper (Bên trái) */}
                <Grid.Col span={5}>
                    <Card shadow="sm" padding="lg" radius="md" className="bg-white shadow-lg">
                        <div className="space-y-4">
                            <div className="p-4 text-center bg-blue-100 rounded-lg shadow-sm">
                                <div className="p-4">
                                    <Text size="lg" className="font-semibold text-gray-700">
                                        📦 Người giao hàng đang hoạt động
                                    </Text>
                                </div>
                                <div className="p-4">
                                    <Text size="xl" className="font-bold text-blue-600">
                                        <strong>{activeShipperCount ?? "Đang tải..."}</strong>
                                    </Text>
                                </div>
                            </div>

                            {/* Ô New Shippers Today */}
                            <div className="p-4 text-center bg-green-100 rounded-lg shadow-sm">
                                <div className="p-4">
                                    <Text size="lg" className="font-semibold text-gray-700">
                                        🆕 Người giao hàng mới hôm nay
                                    </Text>
                                </div>
                                <div className="p-4">
                                    <Text size="xl" className="font-bold text-green-600 ">
                                        <strong>{shippersJoinedToday ?? "Đang tải..."}</strong>
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Grid.Col>

                {/* Bảng xếp hạng shipper (Bên phải) */}
                <Grid.Col span={7}>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        className="bg-white shadow-lg"
                    >
                        <Title
                            order={3}
                            align="center"
                            mb="md"
                            className="text-lg font-bold text-gray-700"
                        >
                            Top 5 người giao hàng có doanh thu cao nhất
                        </Title>
                        <Table
                            highlightOnHover
                            striped
                            className="border border-gray-200 rounded-lg"
                        >
                            <thead className="bg-gray-100">
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>Tổng doanh thu (VND)</th>
                                    <th>Số đơn hàng giao thành công</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topShippers?.map((shipper, index) => {
                                    // Xác định class theo thứ hạng
                                    let rowClass = "";
                                    if (index === 0) {
                                        rowClass =
                                            "text-yellow-600 bg-yellow-100 font-extrabold shadow-md";
                                    } else if (index === 1) {
                                        rowClass = "text-gray-600 bg-gray-100 font-bold";
                                    } else if (index === 2) {
                                        rowClass = "text-orange-600 bg-orange-100 font-semibold";
                                    }

                                    return (
                                        <tr key={shipper.shipper_id} className={rowClass}>
                                            <td className="px-4 py-2 text-center">{index + 1}</td>
                                            <td className="px-4 py-2 text-center">
                                                {shipper.name}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {new Intl.NumberFormat("vi-VN").format(
                                                    shipper.total_revenue,
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {shipper.completed_orders}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
}
