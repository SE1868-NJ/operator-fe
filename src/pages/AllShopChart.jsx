import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
// //Chart
import { useEffect, useRef, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useAllShopsChart } from "../hooks/useShop";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

const DashboardChart = () => {
    const [selectedChart, setSelectedChart] = useState("line"); // Giá trị mặc định là "line"
    // 1 trong 3 loai biểu đồ: line, bar, pie
    const chartRef = useRef(null); // Tham chiếu đến canvas
    const chartInstance = useRef(null); // Lưu trữ instance của biểu đồ
    const [timeOfCount, setTimeOfCount] = useState("day");
    // 1 trong 4 loại biểu đồ: day, week, month, quarter, year-chưa cần

    const { data: listData } = useAllShopsChart(timeOfCount);

    const getHoursLastDayToNow = () => {
        const hours = [];
        const endDate = new Date(); // Thời điểm hiện tại
        const startDate = new Date();
        startDate.setHours(startDate.getHours() - 24); // Lùi về hôm qua

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const hourString = `${currentDate
                .toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                })
                .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")} ${currentDate
                .getHours()
                .toString()
                .padStart(2, "0")}:00:00`;
            hours.push(hourString);

            currentDate.setHours(currentDate.getHours() + 1); // Tăng giờ lên 1
        }
        return hours;
    };

    const getDatesLastWeekToNow = () => {
        const dates = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            currentDate.setHours(currentDate.getHours() + 7);
            const formattedDate = `${currentDate.toLocaleDateString("vi-VN", {
                weekday: "long",
            })}, ${currentDate.toISOString().split("T")[0]}`; // YYYY-MM-DD
            currentDate.setHours(currentDate.getHours() - 7);
            dates.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const getDatesLastMonthToNow = () => {
        const dates = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const getMonthsLastYearToNow = () => {
        const months = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const monthString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}`; // YYYY-MM
            months.push(monthString);

            currentDate.setMonth(currentDate.getMonth() + 1); // Tăng lên 1 tháng
        }
        return months;
    };

    const convertDayOfWeek = (dayOfWeek) => {
        const days = ["Thứ Bảy", "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];
        return days[dayOfWeek % 7] || "Không hợp lệ"; // Tránh lỗi nếu nhập sai
    };

    const mergeDateData = () => {
        // Date bao gồm day, month, year
        const dataMap = {};
        listData?.map((item) => {
            dataMap[item.time] = item.totalRevenue;
        });

        const listDates =
            timeOfCount === "day"
                ? getHoursLastDayToNow()
                : timeOfCount === "month"
                  ? getDatesLastMonthToNow()
                  : getMonthsLastYearToNow();
        return listDates.map((date) => ({
            day: date,
            total: dataMap[date] || 0,
        }));
    };

    const mergeWeekData = () => {
        // week là chỉ có week
        const dataMap = {};
        listData?.map((item) => {
            const dateAndWeek = `${convertDayOfWeek(item.DayOfWeek)}, ${item.time}`;
            console.log(dateAndWeek, item.totalRevenue);
            dataMap[dateAndWeek] = item.totalRevenue;
        });

        const listDayOfWeek = getDatesLastWeekToNow();
        return listDayOfWeek.map((date) => ({
            day: date,
            total: dataMap[date] || 0,
        }));
    };

    const mergeData = () => {
        if (timeOfCount === "week") {
            return mergeWeekData();
        }
        return mergeDateData();
    };

    const datasets = mergeData();

    // const lineDatas = { // hàm dùng tốt, chờ tối ưu thì thay vào
    //   labels: datasets?.map((item) => item.day), // Use the labels directly, no need for currentLabels here
    //   datasets: [
    //     {
    //       label: "Doanh thu (Triệu VND)",
    //       data: datasets?.map((item) => item.total), // Example data
    //       borderColor: "rgb(75, 192, 192)",
    //       backgroundColor: "rgba(75, 192, 192, 0.2)",
    //       tension: 0.3,
    //     },
    //   ],
    // };

    const lineData = {
        day: {
            labels: datasets?.map((item) => item.day), // Use the labels directly, no need for currentLabels here
            datasets: [
                {
                    label: "Doanh thu (Triệu VND)",
                    data: datasets?.map((item) => item.total), // Example data
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                },
            ],
        },
        week: {
            labels: datasets?.map((item) => item.day), // Use the labels directly, no need for currentLabels here
            datasets: [
                {
                    label: "Doanh thu (Triệu VND)",
                    data: datasets?.map((item) => item.total), // Example data
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                },
            ],
        },
        month: {
            labels: datasets?.map((item) => item.day), // Use the labels directly, no need for currentLabels here
            datasets: [
                {
                    label: "Doanh thu (Triệu VND)",
                    data: datasets?.map((item) => item.total), // Example data
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                },
            ],
        },
        year: {
            labels: datasets?.map((item) => item.day), // Use the labels directly, no need for currentLabels here
            datasets: [
                {
                    label: "Doanh thu (Triệu VND)",
                    data: datasets?.map((item) => item.total), // Example data
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                },
            ],
        },
    };
    const getLineData = (dataType) => {
        return lineData[dataType] || lineData.day; // Mặc định là labels.day nếu không tìm thấy
    };
    const currentLineData = getLineData(timeOfCount);

    const barData = {
        day: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
                "Hổ Bông",
                "Ngựa Bông",
            ],
            datasets: [
                {
                    label: "Số lượng bán (cái)",
                    data: [120, 90, 150, 110, 130, 85, 100, 70, 95, 115],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                        "#00BCD4",
                        "#E91E63",
                    ],
                },
            ],
        },
        week: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
                "Hổ Bông",
                "Ngựa Bông",
            ],
            datasets: [
                {
                    label: "Số lượng bán (cái)",
                    data: [200, 190, 400, 230, 430, 155, 180, 140, 175, 205],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                        "#00BCD4",
                        "#E91E63",
                    ],
                },
            ],
        },
        month: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
                "Hổ Bông",
                "Ngựa Bông",
            ],
            datasets: [
                {
                    label: "Số lượng bán (cái)",
                    data: [1120, 910, 1350, 2110, 1530, 755, 880, 640, 775, 905],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                        "#00BCD4",
                        "#E91E63",
                    ],
                },
            ],
        },
        quarter: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
                "Hổ Bông",
                "Ngựa Bông",
            ],
            datasets: [
                {
                    label: "Số lượng bán (cái)",
                    data: [3360, 2730, 4050, 6330, 4590, 2265, 2640, 1920, 2325, 2715],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                        "#00BCD4",
                        "#E91E63",
                    ],
                },
            ],
        },
        year: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
                "Hổ Bông",
                "Ngựa Bông",
            ],
            datasets: [
                {
                    label: "Số lượng bán (cái)",
                    data: [13440, 10920, 16200, 25320, 18360, 9060, 10560, 7680, 9300, 10860],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                        "#00BCD4",
                        "#E91E63",
                    ],
                },
            ],
        },
    };
    const getBarData = (dataType) => {
        return barData[dataType] || barData.day; // Mặc định là labels.day nếu không tìm thấy
    };
    const currentBarData = getBarData(timeOfCount);

    const pieData = {
        day: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
            ],
            datasets: [
                {
                    data: [30, 20, 25, 15, 10, 12, 18, 20], // Percentages
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                    ],
                },
            ],
        },
        week: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
            ],
            datasets: [
                {
                    data: [28, 22, 23, 17, 8, 10, 22, 20], // Percentages
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                    ],
                },
            ],
        },
        month: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
            ],
            datasets: [
                {
                    data: [32, 18, 27, 12, 9, 11, 19, 22], // Percentages
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                    ],
                },
            ],
        },
        quarter: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
            ],
            datasets: [
                {
                    data: [35, 15, 23, 10, 7, 13, 17, 20], // Percentages
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                    ],
                },
            ],
        },
        year: {
            labels: [
                "Gấu Teddy",
                "Thỏ Bông",
                "Mèo Bông",
                "Cá Mập Bông",
                "Khủng Long",
                "Voi Bông",
                "Chó Bông",
                "Ếch Bông",
            ],
            datasets: [
                {
                    data: [33, 17, 24, 11, 8, 10, 18, 19], // Percentages
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                        "#FF9F40",
                        "#C9CBCF",
                        "#64DD17",
                    ],
                },
            ],
        },
    };
    const getPieData = (dataType) => {
        return pieData[dataType] || pieData.day; // Mặc định là labels.day nếu không tìm thấy
    };
    const currentPieData = getPieData(timeOfCount);

    const options = {
        line: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Thống kê tổng doanh thu toàn sàn" },
            },
        },
        bar: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Thống kê top 10 sản phẩm bán chạy" },
            },
        },
        pie: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Thống kê theo danh mục sản phẩm" },
            },
        },
    };
    const getOptions = (dataType) => {
        return options[dataType] || options.line; // Mặc định là options.line nếu không tìm thấy
    };
    const currentOptions = getOptions(selectedChart);

    useEffect(() => {
        const chartCanvas = chartRef.current?.getContext("2d"); // Optional chaining

        if (!chartCanvas) {
            return; // Nếu không có canvas, dừng lại
        }

        // Hủy biểu đồ cũ nếu có
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Tạo biểu đồ mới dựa trên selectedChart
        let chartConfig;
        switch (selectedChart) {
            case "line":
                chartConfig = {
                    type: "line",
                    data: currentLineData,
                    options: currentOptions,
                };
                break;
            case "bar":
                chartConfig = {
                    type: "bar",
                    data: currentBarData,
                    options: currentOptions,
                };
                break;
            case "pie":
                chartConfig = {
                    type: "pie",
                    data: currentPieData,
                    options: currentOptions,
                };
                break;
            default:
                chartConfig = {
                    type: "line",
                    data: currentLineData,
                    options: currentOptions,
                }; // trả về dạng line nếu ko hợp lệ
        }

        chartInstance.current = new ChartJS(chartCanvas, chartConfig);

        // Cleanup function: Hủy biểu đồ khi component unmount hoặc selectedChart thay đổi
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
        // Chạy lại effect khi selectedChart hoặc data thay đổi
    }, [selectedChart, currentLineData, currentBarData, currentPieData, currentOptions]); // Chạy lại effect khi selectedChart hoặc data thay đổi

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thống kê bán hàng</h2>

            {/* Dropdown chọn biểu đồ */}
            <div className="mb-4 flex justify-around">
                <select
                    onChange={(e) => setTimeOfCount(e.target.value)}
                    value={timeOfCount}
                    className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="day">📈 Doanh thu trong ngày</option>
                    <option value="week">📈 Doanh thu trong tuần</option>
                    <option value="month">📈 Doanh thu trong tháng</option>
                    <option value="year">📈 Doanh thu trong năm</option>
                </select>
                <select
                    onChange={(e) => setSelectedChart(e.target.value)}
                    value={selectedChart}
                    className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="line">📈 Tổng doanh thu</option>
                    <option value="bar">📊 Top 10 sản phẩm bán chạy</option>
                    <option value="pie">🥧 Doanh thu theo danh mục</option>
                </select>
            </div>

            {/* Biểu đồ */}
            <div className="w-full h-[400px] flex justify-center items-center">
                {selectedChart === "line" && (
                    <Line data={currentLineData} options={currentOptions} />
                )}
                {selectedChart === "bar" && <Bar data={currentBarData} options={currentOptions} />}
                {selectedChart === "pie" && <Pie data={currentPieData} options={currentOptions} />}
            </div>
        </div>
    );
};

export default DashboardChart;
