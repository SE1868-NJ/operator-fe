import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ShipperDashboardChart = () => {
    const [selectedChart, setSelectedChart] = useState("bar");
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [timeOfCount, setTimeOfCount] = useState("day"); // Tùy chọn cho ngày, tuần, tháng

    const labels = {
        day: ["Shipper A", "Shipper B", "Shipper C", "Shipper D", "Shipper E"],
        week: ["Shipper A", "Shipper B", "Shipper C", "Shipper D", "Shipper E"],
        month: ["Shipper A", "Shipper B", "Shipper C", "Shipper D", "Shipper E"],
        quarter: ["Shipper A", "Shipper B", "Shipper C", "Shipper D", "Shipper E"],
    };

    const barData = {
        day: {
            labels: labels.day,
            datasets: [
                {
                    label: "Số lượng đơn giao (cái)",
                    data: [120, 95, 150, 110, 130], // Số lượng đơn hàng trong ngày của mỗi shipper
                    backgroundColor: "#4BC0C0",
                },
            ],
        },
        week: {
            labels: labels.week,
            datasets: [
                {
                    label: "Số lượng đơn giao (cái)",
                    data: [210, 170, 220, 180, 250], // Số lượng đơn hàng trong tuần
                    backgroundColor: "#4BC0C0",
                },
            ],
        },
        month: {
            labels: labels.month,
            datasets: [
                {
                    label: "Số lượng đơn giao (cái)",
                    data: [900, 850, 980, 880, 950], // Số lượng đơn hàng trong tháng
                    backgroundColor: "#4BC0C0",
                },
            ],
        },
        quarter: {
            labels: labels.quarter,
            datasets: [
                {
                    label: "Số lượng đơn giao (cái)",
                    data: [2500, 2300, 2700, 2200, 2600], // Số lượng đơn hàng trong quý
                    backgroundColor: "#4BC0C0",
                },
            ],
        },
    };

    const getBarData = (dataType) => {
        return barData[dataType] || barData.day; // Mặc định là data của ngày nếu không tìm thấy
    };
    const currentBarData = getBarData(timeOfCount);

    const options = {
        bar: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Thống kê số lượng đơn giao của shipper" },
            },
        },
    };
    const getOptions = (dataType) => {
        return options[dataType] || options.bar;
    };
    const currentOptions = getOptions(selectedChart);

    useEffect(() => {
        const chartCanvas = chartRef.current?.getContext("2d"); // Optional chaining

        if (!chartCanvas) {
            return;
        }

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        let chartConfig;
        switch (selectedChart) {
            case "bar":
                chartConfig = {
                    type: "bar",
                    data: currentBarData,
                    options: currentOptions,
                };
                break;
            default:
                chartConfig = {
                    type: "bar",
                    data: currentBarData,
                    options: currentOptions,
                };
        }

        chartInstance.current = new ChartJS(chartCanvas, chartConfig);

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [selectedChart, currentBarData, currentOptions]);

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Thống kê giao hàng của Shipper
            </h2>

            {/* Dropdown chọn thời gian */}
            <div className="flex justify-around mb-4">
                <select
                    onChange={(e) => setTimeOfCount(e.target.value)}
                    value={timeOfCount}
                    className="p-2 transition border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="day">📅 Số lượng giao trong ngày</option>
                    <option value="week">📅 Số lượng giao trong tuần</option>
                    <option value="month">📅 Số lượng giao trong tháng</option>
                    <option value="quarter">📅 Số lượng giao trong quý</option>
                </select>
            </div>

            {/* Biểu đồ */}
            <div className="w-full h-[400px] flex justify-center items-center">
                {selectedChart === "bar" && <Bar data={currentBarData} options={currentOptions} />}
            </div>
        </div>
    );
};

export default ShipperDashboardChart;
