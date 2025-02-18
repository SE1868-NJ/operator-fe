import { Button, Container, Table, Tabs, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3050");

const ReportsPage = () => {
    const [reports] = useState({ shippers: [], shops: [], customers: [] });
    const [loading] = useState(true);

    useEffect(() => {
        socket.on("new_notif", (data) => {
            console.log(data);
        });
    }, []);

    useEffect(() => {
        const fetchReports = async () => {};

        fetchReports();
    }, []);

    const renderTable = (data) => (
        <Table striped highlightOnHover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {data.map((report) => (
                    <tr key={report.id}>
                        <td>{report.id}</td>
                        <td>{report.name}</td>
                        <td>{report.type}</td>
                        <td>{report.status}</td>
                        <td>{new Date(report.date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    if (loading)
        return (
            <Button
                onClick={() => {
                    socket.emit("custom_event", "Hello");
                }}
            >
                Emit
            </Button>
        );

    return (
        <Container fluid py={20}>
            <Title order={2}>Danh sách khiếu nại</Title>
            <Tabs defaultValue="shippers">
                <Tabs.List>
                    <Tabs.Tab value="shippers">Shippers</Tabs.Tab>
                    <Tabs.Tab value="shops">Shops</Tabs.Tab>
                    <Tabs.Tab value="customers">Customers</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="shippers" pt="xs">
                    {renderTable(reports.shippers)}
                </Tabs.Panel>

                <Tabs.Panel value="shops" pt="xs">
                    {renderTable(reports.shops)}
                </Tabs.Panel>

                <Tabs.Panel value="customers" pt="xs">
                    {renderTable(reports.customers)}
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default ReportsPage;
