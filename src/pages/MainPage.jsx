import { Search, User } from "lucide-react";
import MostSellingProducts from "./ui-main-page/MostSellingProductsPage.jsx";
import NewCustomerChart from "./ui-main-page/NewCustomerChartPage.jsx";
import Statistics from "./ui-main-page/StatisticPage.jsx";
import SummaryChart from "./ui-main-page/SummaryChartPage.jsx";
import TopCustomers from "./ui-main-page/TopCustomersPage.jsx";
import TopShippers from "./ui-main-page/TopShipperPage.jsx";

export default function Dashboard() {
    return (
        <div className="p-6 bg-gray-100 min-h-screen space-y-6">
            {/* Thống kê */}
            <Statistics />

            {/* Biểu đồ đơn hàng & doanh thu (chiếm một hàng) */}
            <SummaryChart />

            {/* NewCustomerChart & MostSellingProducts cùng 1 hàng */}
            <div className="grid grid-cols-2 gap-4">
                <NewCustomerChart />
                <MostSellingProducts />
            </div>

            {/* TopShippers & TopCustomers cùng 1 hàng */}
            <div className="grid grid-cols-2 gap-4">
                <TopShippers />
                <TopCustomers />
            </div>
        </div>
    );
}
