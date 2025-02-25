import {
    Alert,
    Button,
    Center,
    Container,
    Group,
    Modal,
    Pagination,
    Paper,
    Table,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { nprogress } from "@mantine/nprogress";
import { IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useReportCategories } from "../hooks/useReportCategories";
import ReportCategoriesServices from "../services/ReportCategoryServices";

const ITEMS_PER_PAGE = 5;
const ReportCategoriesPage = () => {
    const [id, setId] = useState("");

    // create new category modal
    const [opened, { open, close }] = useDisclosure(false);

    // update category modal
    const [openedUpdateModal, { open: openUpdateModal, close: closeUpdateModal }] =
        useDisclosure(false);

    const [search, setSearch] = useDebouncedState("", 300);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const queryClient = useQueryClient();

    const { data, isFetching, error } = useReportCategories({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search,
    });

    useEffect(() => {
        if (isFetching) {
            nprogress.start();
        } else {
            nprogress.complete();
        }
    }, [isFetching]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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

    const onSubmit = async (data) => {
        if (data.type === "create") {
            await ReportCategoriesServices.createCategory(data)
                .then(() => {
                    queryClient.invalidateQueries([
                        "reportCategories",
                        {
                            page: currentPage,
                            limit: ITEMS_PER_PAGE,
                            search,
                        },
                    ]);
                    reset();
                    notifications.show({
                        color: "green",
                        title: "Thành công!",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    notifications.show({
                        color: "red",
                        title: "Đã có lỗi xảy ra!",
                    });
                });
        } else if (data.type === "update") {
            const { type, ...updateData } = data;
            await ReportCategoriesServices.updateCategory(id, updateData)
                .then(() => {
                    queryClient.invalidateQueries([
                        "reportCategories",
                        {
                            page: currentPage,
                            limit: ITEMS_PER_PAGE,
                            search,
                        },
                    ]);
                    reset();
                    notifications.show({
                        color: "green",
                        title: "Thành công!",
                    });
                })
                .catch((err) => {
                    console.log(err);

                    notifications.show({
                        color: "red",
                        title: "Đã có lỗi xảy ra!",
                    });
                });
        }
    };

    const handleDeleteCategory = async (id) => {
        await ReportCategoriesServices.deleteCategory(id).then(() => {
            queryClient.invalidateQueries([
                "reportCategories",
                {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search,
                },
            ]);
        });
    };

    return (
        <Container size="xl" py="xl">
            <Modal opened={opened} onClose={close} title="Tạo mới danh mục" centered>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input hidden {...register("type")} defaultValue={"create"} />
                    <TextInput
                        label="Tên danh mục"
                        placeholder="Vấn đề thanh toán"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                        withAsterisk
                    />
                    <Textarea
                        label="Mô tả"
                        placeholder="Enter description"
                        {...register("description")}
                        mt="md"
                    />
                    <Button type="submit" fullWidth mt="md">
                        Tạo mới
                    </Button>
                </form>
            </Modal>

            <Modal
                opened={openedUpdateModal}
                onClose={closeUpdateModal}
                title="Cập nhật danh mục"
                centered
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input hidden {...register("type")} defaultValue={"update"} />
                    <TextInput
                        label="Tên danh mục"
                        placeholder="Vấn đề thanh toán"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name?.message}
                        withAsterisk
                    />
                    <Textarea
                        label="Mô tả"
                        placeholder="Enter description"
                        {...register("description")}
                        mt="md"
                    />
                    <Button type="submit" fullWidth mt="md">
                        Cập nhật
                    </Button>
                </form>
            </Modal>

            <Paper shadow="sm" p="md" withBorder>
                <Group position="apart" mb="md" justify="space-between">
                    <Title order={2}>Danh mục khiếu nại</Title>
                    <Button variant="light" onClick={open} color="green">
                        Tạo mới danh mục
                    </Button>
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
                </Group>

                <Table striped highlightOnHover verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>ID</Table.Th>
                            <Table.Th>Tên</Table.Th>
                            <Table.Th>Mô tả</Table.Th>
                            <Table.Th>Thời gian tạo</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data?.data?.map((category) => (
                            <Table.Tr key={category.id}>
                                <Table.Td>
                                    <Text size="sm" color="dimmed">
                                        {category.id.slice(0, 8)}...
                                    </Text>
                                </Table.Td>

                                <Table.Td w={"20%"}>
                                    <Text lineClamp={2}>{category.name}</Text>
                                </Table.Td>
                                <Table.Td w={"40%"}>
                                    <Text lineClamp={2}>{category.description}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{formatDate(category.createdAt)}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group spacing="xs">
                                        <Button
                                            onClick={() => {
                                                setId(category.id);
                                                openUpdateModal();
                                            }}
                                            variant="light"
                                            color="blue"
                                        >
                                            Cập nhật
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="red"
                                            size="xs"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {!isFetching && data?.length === 0 && (
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

export default ReportCategoriesPage;
