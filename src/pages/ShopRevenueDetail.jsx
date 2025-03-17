import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOneShopInfor, useOneShopRevenue, useRevenuesOneShopLastTime } from "../hooks/useShop";

const ShopsRevenuePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const limit = 10;
    const timeOut = 200;
    const [page, setPage] = useState(1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    const [totalRevenuesTime, setTotalRevenuesTime] = useState("day");

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const [searchShipperName, setSearchShipperName] = useDebouncedState("", timeOut);
    const [searchCustomerName, setSearchCustomerName] = useDebouncedState("", timeOut);

    const filterData = useMemo(
        () => ({
            shipperName: searchShipperName,
            customerName: searchCustomerName,
        }),
        [searchShipperName, searchCustomerName],
    );

    const { data: shop } = useOneShopInfor(id);

    const {
        data: responseData,
        isLoading,
        error,
    } = useOneShopRevenue(id, day, month, year, limit, page, filterData);

    const { data: totalRevenues } = useRevenuesOneShopLastTime(id, totalRevenuesTime);

    const revenueData = responseData?.orders || [];
    const total = responseData?.total || 0;

    // // Determine which list to display based on active button
    // const shopsToDisplay = useMemo(() => {
    //   return activeButton === "pending" ? pendingShops : approvedShops;
    // }, [activeButton, pendingShops, approvedShops]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="h-screen">
            <div className="flex-1 mx-auto bg-white p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Thống kê tổng doanh thu của cửa hàng: {shop?.shopName}
                    <p className="text-xl">(Chủ cửa hàng: {shop?.Owner.fullName})</p>
                </h2>
                <div className="flex gap-4 mb-4">
                    {/* Thông tin thống kê trong ngày */}
                    <div className="p-4 rounded-lg w-1/4 hover:cursor-pointer">
                        <label
                            htmlFor="totalRevenuesTime"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Trong khoảng thời gian
                            <select
                                className="w-full px-2 rounded border-2 border-black font-medium"
                                name="totalRevenuesTime"
                                id="totalRevenuesTime"
                                onChange={(e) => setTotalRevenuesTime(e.target.value)}
                            >
                                <option
                                    selected={totalRevenuesTime.toLowerCase === "day"}
                                    value="day"
                                >
                                    24h gần nhất
                                </option>
                                <option
                                    selected={totalRevenuesTime.toLowerCase === "week"}
                                    value="week"
                                >
                                    7 ngày gần nhất
                                </option>
                                <option
                                    selected={totalRevenuesTime.toLowerCase === "month"}
                                    value="month"
                                >
                                    1 tháng gần nhất
                                </option>
                                <option
                                    selected={totalRevenuesTime.toLowerCase === "year"}
                                    value="year"
                                >
                                    1 năm gần nhất
                                </option>
                                <option selected={totalRevenuesTime.toLowerCase === ""} value="">
                                    Toàn bộ thời gian
                                </option>
                            </select>
                        </label>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg shadow-md w-1/4 text-center hover:cursor-pointer">
                        <h2 className="text-xl font-semibold text-green-800">Doanh thu cửa hàng</h2>
                        <p className="text-2xl font-bold">
                            {Number.parseInt(totalRevenues?.totalRevenues).toLocaleString("vi") ||
                                0}{" "}
                            VNĐ
                        </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-1/4 text-center hover:cursor-pointer">
                        <h2 className="text-xl font-semibold text-yellow-800">Tổng số đơn hàng</h2>
                        <p className="text-2xl font-bold">
                            {totalRevenues?.totalOrders || 0} đơn hàng
                        </p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg shadow-md w-1/4 text-center hover:cursor-pointer">
                        <h2 className="text-xl font-semibold text-red-800">Nộp thuế tháng 2</h2>
                        <p className="text-2xl font-bold">
                            {(Number.parseInt(totalRevenues?.totalRevenues) * 0.015).toLocaleString(
                                "vi",
                            ) || 0}{" "}
                            VNĐ
                        </p>
                    </div>
                </div>

                <div className="my-8">{/* <DashboardChart/> */}</div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="py-4 px-6 bg-gray-100 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800 text-center">
                            Doanh sách các đơn hàng
                        </h1>
                    </div>

                    <div className="p-6">
                        {/* Search Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label
                                    htmlFor="searchShipperName"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Tìm tên khách hàng:
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    placeholder="Tên khách hàng"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    defaultValue={searchCustomerName}
                                    onChange={(e) => setSearchCustomerName(e.currentTarget.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="searchShipperName"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Tìm tên người giao hàng:
                                </label>
                                <input
                                    type="text"
                                    id="shipperName"
                                    placeholder="Tên người gia hàng hàng"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    defaultValue={searchShipperName}
                                    onChange={(e) => setSearchShipperName(e.currentTarget.value)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="searchShopPhone"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Tìm theo ngày-tháng-năm:
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <select
                                        className="rounded border border-black px-2"
                                        name="year"
                                        id=""
                                        onChange={(e) => setYear(e.target.value)}
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y} selected={year === y}>
                                                Năm {y}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="rounded border border-black px-2"
                                        name="month"
                                        id=""
                                        onChange={(e) => {
                                            setMonth(e.target.value);
                                            if (e.target.value === "") {
                                                setDay("");
                                            }
                                        }}
                                    >
                                        <option value="">Tất cả tháng</option>
                                        {months.map((m) => (
                                            <option key={m} value={m} selected={m === month}>
                                                Tháng {m}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="rounded border border-black px-2"
                                        name="day"
                                        id=""
                                        onChange={(e) => setDay(e.target.value)}
                                    >
                                        <option value="" selected={day === ""}>
                                            Tất cả ngày
                                        </option>
                                        {days.map((d) => (
                                            <option key={d} value={d} selected={d === day}>
                                                Ngày {d}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 text-center uppercase font-semibold tracking-wide">
                                        <th className="border p-3">ID</th>
                                        <th className="border p-3">Tên Khách hàng</th>
                                        <th className="border p-3">Người giao hàng</th>
                                        <th className="border p-3">Địa chỉ</th>
                                        <th className="border p-3">Tổng số tiền (VNĐ)</th>
                                        <th className="border p-3">Phương thức thanh toán</th>
                                        <th className="border p-3">Trạng thái đơn hàng</th>
                                        <th className="border p-3">Xem chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {error && (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="p-3 py-5 text-2xl text-red-500 text-center font-bold"
                                            >
                                                Đã có lỗi xảy ra
                                            </td>
                                        </tr>
                                    )}
                                    {!error && revenueData?.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="9"
                                                className="p-3 py-5 text-2xl text-center font-bold"
                                            >
                                                Không tìm thấy kết quả!
                                            </td>
                                        </tr>
                                    )}
                                    {!error &&
                                        revenueData?.length > 0 &&
                                        revenueData?.map((order) => (
                                            <tr
                                                key={order?.id}
                                                className="border text-center transition-all duration-200 hover:bg-gray-100"
                                            >
                                                <td className="border p-3 py-5">{order?.id}</td>
                                                <td className="border p-3 py-5 font-medium text-gray-800">
                                                    {order?.Customer?.fullName}
                                                </td>
                                                <td className="border p-3 py-5">
                                                    {order?.Shipper?.name}
                                                </td>
                                                <td className="border p-3 py-5 text-blue-500">
                                                    {order?.Address?.street}, {order?.Address?.ward}
                                                    , {order?.Address?.district},{" "}
                                                    {order?.Address?.city}
                                                </td>
                                                <td className="border p-3 py-5">
                                                    {Number.parseInt(order?.total).toLocaleString(
                                                        "vi",
                                                    ) || 0}
                                                </td>
                                                <td className="border p-3 py-5">
                                                    {order?.payment_method}
                                                </td>
                                                <td className="border p-3 py-5">
                                                    {order?.payment_status || 0}
                                                </td>
                                                <td className="border p-3">
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                                        onClick={() =>
                                                            navigate(
                                                                `/main/orderdetail/${order?.id}`,
                                                            )
                                                        }
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center mt-5">
                            <nav aria-label="Page navigation">
                                <ul className="inline-flex items-center -space-x-px">
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => setPage(Math.max(page - 1, 1))}
                                            disabled={page === 1}
                                            className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                                        >
                                            Trang trước
                                        </button>
                                    </li>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (pageNumber) => (
                                            <li key={pageNumber}>
                                                <button
                                                    type="button"
                                                    onClick={() => setPage(pageNumber)}
                                                    className={`py-2 px-3 leading-tight ${
                                                        page === pageNumber
                                                            ? "text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                    }  focus:outline-none`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            </li>
                                        ),
                                    )}

                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => setPage(Math.min(page + 1, totalPages))}
                                            disabled={
                                                page === totalPages ||
                                                (revenueData &&
                                                    revenueData?.length === 0 &&
                                                    !isLoading &&
                                                    !error)
                                            }
                                            className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Trang sau
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopsRevenuePage;
