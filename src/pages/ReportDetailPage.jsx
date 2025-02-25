import {
    Badge,
    Box,
    Button,
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { nprogress } from "@mantine/nprogress";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useReport } from "../hooks/useReport";
import { instance } from "../lib/axios";
import { formatDate } from "../utils";

const ReportDetailPage = () => {
    const { id } = useParams();
    const { data: report, isLoading } = useReport(id);
    const queryClient = useQueryClient();
    const [response, setResponse] = useDebouncedState("");

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const getPriorityColor = (status) => {
        switch (status.toLowerCase()) {
            case "low":
                return "blue"; // Changed from yellow to blue
            case "medium":
                return "orange"; // Changed from green to orange
            case "high":
                return "purple"; // Changed from red to purple
            case "critical":
                return "black"; // Changed from red to black
            default:
                return "gray";
        }
    };

    const handleResponse = () => {
        nprogress.start();
        instance
            .post(`/reports/response/${id}`, {
                response,
                reporter_email: report.reporter_email,
                report_title: report.report_title,
            })
            .then((res) => {
                console.log(res);
                queryClient.invalidateQueries(["report", id]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                nprogress.complete();
            });
    };
    return (
        <Paper p="xl">
            <Stack spacing="md">
                <Group position="apart">
                    <Title order={2}>{report.report_title}</Title>
                    <Badge
                        size="lg"
                        variant="filled"
                        color={getPriorityColor(report.priority)}
                        sx={{ textTransform: "capitalize" }}
                    >
                        {report.priority}
                    </Badge>
                    <Badge
                        size="lg"
                        variant="filled"
                        color={getStatusColor(report.status)}
                        sx={{ textTransform: "capitalize" }}
                    >
                        {report.status}
                    </Badge>
                </Group>

                <Divider />

                <Stack spacing="xs">
                    <Group>
                        <Text fw={600}>ID:</Text>
                        <Text>{report.id}</Text>
                    </Group>

                    <Group>
                        <Text fw={600}>Phân loại:</Text>
                        <Text style={{ textTransform: "capitalize" }}>{report.report_type}</Text>
                    </Group>

                    <Group>
                        <Text fw={600}>Email Người khiếu nại:</Text>
                        <Text>{report.reporter_email}</Text>
                    </Group>
                </Stack>

                <Stack spacing="xs">
                    <Text fw={600}>Nội dung:</Text>
                    <Paper p="md" bg="gray.0" radius="sm">
                        <Text>{report.content}</Text>
                    </Paper>
                </Stack>

                <Divider />

                <Group>
                    <Text fw={600}>Thời gian:</Text>
                    <Text>{formatDate(report.createdAt)}</Text>
                </Group>

                <Divider />

                <Box>
                    <Title order={3} mb="md">
                        Trả lời Khiếu nại
                    </Title>

                    {report.response ? (
                        <Textarea disabled defaultValue={report.response} />
                    ) : (
                        <>
                            <Textarea
                                placeholder="Enter your response to the reporter..."
                                minRows={4}
                                value={response}
                                onChange={(event) => setResponse(event.target.value)}
                                mb="md"
                            />
                            <Group position="right">
                                <Button onClick={handleResponse}>Trả lời</Button>
                            </Group>
                        </>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
};

export default ReportDetailPage;
