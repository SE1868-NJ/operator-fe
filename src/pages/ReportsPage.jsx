import {
    Alert,
    Badge,
    Button,
    Center,
    Container,
    Group,
    Pagination,
    Paper,
    Select,
    Skeleton,
    Table,
    Tabs,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useReports } from "../hooks/useReport";

const ReportsPage = () => {
    const [search, setSearch] = useDebouncedState("", 300);
    const [reportType, setReportType] = useState("");
    const [status, setStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const { data, isFetching, error } = useReports({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search,
        report_type: reportType,
        status,
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "yellow";
            case "resolved":
                return "green";
            case "rejected":
                return "red";
            default:
                return "gray";
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (error) {
        return (
            <Container size="xl" py="xl">
                <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
                    Failed to load reports. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="xl" py="xl">
            <Paper shadow="sm" p="md" withBorder>
                <Group position="apart" mb="md">
                    <Title order={2}>Danh sách khiếu nại</Title>
                </Group>

                <Group align="end" spacing="md" my={20}>
                    <TextInput
                        label="Tìm kiếm"
                        placeholder="Tìm kiếm theo nội dung..."
                        icon={<IconSearch size="1rem" stroke={1.5} />}
                        w="250px"
                        styles={{
                            input: {
                                "&:focus": {
                                    borderColor: "var(--mantine-color-blue-filled)",
                                },
                            },
                        }}
                        onChange={(e) => {
                            setSearch(e.currentTarget.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                    />

                    <Select
                        label="Phân loại"
                        w="200px"
                        placeholder="Chọn loại khiếu nại"
                        data={[
                            { value: "all", label: "Tất cả" },
                            { value: "shipper", label: "Người giao hàng" },
                            { value: "shop", label: "Cửa hàng" },
                            { value: "customer", label: "Người mua hàng" },
                        ]}
                        styles={{
                            input: {
                                "&:focus": {
                                    borderColor: "var(--mantine-color-blue-filled)",
                                },
                            },
                        }}
                        onChange={(_value, option) => {
                            setReportType(option.value);
                            setCurrentPage(1); // Reset to first page on filter change
                        }}
                    />
                </Group>

                <Tabs
                    defaultValue="all"
                    mb="md"
                    value={status}
                    onChange={(value) => {
                        setStatus(value);
                        setCurrentPage(1); // Reset to first page on status change
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab value="all">Tất cả</Tabs.Tab>
                        <Tabs.Tab value="pending">Đang chờ</Tabs.Tab>
                        <Tabs.Tab value="resolved">Đã xử lý</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                {isFetching ? (
                    Array(5)
                        .fill(0)
                        .map((_, index) => <Skeleton key={index} height={50} mb="sm" />)
                ) : (
                    <Table striped highlightOnHover verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Phân loại</Table.Th>
                                <Table.Th>Nội dung</Table.Th>
                                <Table.Th>Trạng thái</Table.Th>
                                <Table.Th>Thời gian</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data?.reports.map((report) => (
                                <Table.Tr key={report.id}>
                                    <Table.Td>
                                        <Text size="sm" color="dimmed">
                                            {report.id.slice(0, 8)}...
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color="blue" variant="light">
                                            {report.report_type === "shipper"
                                                ? "Người giao hàng"
                                                : report.report_type === "shop"
                                                  ? "Cửa hàng"
                                                  : "Người mua hàng"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td w={"30%"}>
                                        <Text lineClamp={2}>{report.report_title}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={getStatusColor(report.status)}>
                                            {report.status === "pending" ? "Đang chờ" : "Đã xử lý"}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{formatDate(report.createdAt)}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group spacing="xs">
                                            <Button
                                                component={Link}
                                                to={`/main/reports/${report.id}`}
                                                variant="light"
                                                size="xs"
                                            >
                                                View
                                            </Button>
                                            <Button variant="light" color="green" size="xs">
                                                Resolve
                                            </Button>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}

                {!isFetching && data?.reports.length === 0 && (
                    <Text color="dimmed" align="center" py="xl">
                        Không có khiếu nại nào.
                    </Text>
                )}

                {data?.totalPages > 1 && (
                    <Center mt="xl">
                        <Pagination
                            value={currentPage}
                            onChange={handlePageChange}
                            total={data.totalPages}
                            radius="md"
                            withEdges
                        />
                    </Center>
                )}
            </Paper>
        </Container>
    );
};

export default ReportsPage;
