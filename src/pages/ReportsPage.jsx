import { Container, Table, Tabs, Text, Title } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

const ReportsPage = () => {
    const [reports, setReports] = useState({ shippers: [], shops: [], customers: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await axios.get("/api/reports");
                // setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setLoading(false);
            }
        };

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

    if (loading) return <Text>Loading reports...</Text>;

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
