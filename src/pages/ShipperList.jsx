import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShippers, useTotalShippingFeeAllShippers, useShippersExport } from "../hooks/useShippers.js";
import ShipperDashboardChart from "./ShipperDashboardChart.jsx";
import TopShippersTable from "./TopShippersTable.jsx";
import { useDebouncedState } from "@mantine/hooks";
import { useMemo } from "react";
import ExportExcelButton from "./ExportExcelButton.jsx";

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

function translateStatus(status) {
    const statusMap = {
        active: "Đang hoạt động",
        pending: "Đang duyệt",
        inactive: "Dừng hoạt động",
        suspended: "Đình chỉ",
    };
    return statusMap[status] || status;
}


export default function ShipperList() {
    // const [search, setSearch] = useState("");
    const [search, setSearch] = useDebouncedState("", 300);
    const [filterStatus, setFilterStatus] = useDebouncedState("", 300);
    const [filterDate, setFilterDate] = useDebouncedState("", 300);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    console.log("filterStatus", filterStatus);
    const offset = (currentPage - 1) * itemsPerPage;

    const filterData = useMemo(
        () => ({
            search: search,
            filterStatus: filterStatus,
            filterDate: filterDate,
        }),
        [search, filterStatus, filterDate],
    );

    const { data, isLoading } = useShippers(offset, itemsPerPage, filterData);

    const shipperList = data?.shippers || [];
    const { data: dataExport, isLoadingExport } = useShippersExport(offset, 9999, filterData);

    const shipperExport = dataExport?.shippers || [];

    console.log("shipperListExport", dataExport)



    const { data: allShipperFee, isLoading: isLoadingShippingFee } = useTotalShippingFeeAllShippers(
        0,
        10,
        filterData,
    );



    console.log("totalShippingFee Export", allShipperFee);

    const totalPages = Math.ceil((data?.totalCount || 1) / itemsPerPage);

    const queryClient = useQueryClient();
    queryClient.invalidateQueries(["shipper"]);



    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleDateChange = (e) => {
        const localDate = new Date(e.target.value);
        localDate.setHours(0, 0, 0, 0); // Đưa về đầu ngày
        setFilterDate(localDate.toISOString()); // Chuyển về ISO để gửi lên backend
    };

    // if (isLoading || isLoadingShippingFee) {
    //     return <p>Loading...</p>;
    // }

    return (
        <div className="p-6 mx-auto bg-white">
            <TopShippersTable />
            <ShipperDashboardChart />

            <h1 className="pt-4 mb-4 text-2xl font-bold">Danh sách tất cả người giao hàng</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex gap-4 mb-4">
                <div className="w-1/3">
                    <label htmlFor="search" className="block mb-1 text-sm font-medium">Tìm kiếm bằng tên và SĐT:</label>
                    <input
                        type="text"
                        placeholder="Nhập tên hoặc SĐT"
                        className="w-full p-2 border rounded"
                        defaultValue={search}
                        onChange={(e) => handleSearchChange(e)}
                    />
                </div>

                <div className="w-1/4">
                    <label htmlFor="status" className="block mb-1 text-sm font-medium">Lọc theo trạng thái:</label>
                    <select
                        className="w-full p-2 border rounded"
                        defaultValue={filterStatus}
                        onChange={(e) => handleStatusChange(e)}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="inactive">Dừng hoạt động</option>
                        <option value="pending">Đang duyệt</option>
                    </select>
                </div>

                <div className="w-1/4">
                    <label htmlFor="date" className="block mb-1 text-sm font-medium">Lọc theo ngày tham gia:</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        defaultValue={filterDate}
                        onChange={(e) => handleDateChange(e)}
                    />
                </div>

                <ExportExcelButton data={shipperExport} fileName="DanhSachShipper" />
            </div>

            {/* Bảng danh sách shipper */}
            <table className="w-full border border-collapse border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Họ tên</th>
                        <th className="p-2 border">SĐT</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Trạng thái</th>
                        <th className="p-2 border">Ngày tham gia</th>
                        <th className="p-2 border">Hoạt động</th>
                    </tr>
                </thead>
                {isLoading ? (
                    <tr>
                        <td colSpan="6" className="text-center">
                            Loading...
                        </td>
                    </tr>
                ) : (
                    <tbody>
                        {shipperList?.map((shipper) => (
                            <tr key={shipper?.id} className="border">
                                <td className="p-2 text-center border">{shipper?.id}</td>
                                <td className="p-2 text-center border">{shipper?.name}</td>
                                <td className="p-2 text-center border">{shipper?.phone}</td>
                                <td className="p-2 text-center border">{shipper?.email}</td>
                                <td className="p-2 text-center border">
                                    <span
                                        className={
                                            shipper.status === "active"
                                                ? "text-green-700 bg-green-100 p-1 rounded"
                                                : shipper.status === "pending"
                                                    ? "text-yellow-700 bg-yellow-100 p-1 rounded"
                                                    : shipper.status === "suspended"
                                                        ? "text-orange-700 bg-orange-100 border-orange-500"
                                                        : "text-red-700 bg-red-100 border-red-500"
                                        }
                                    >
                                        {translateStatus(shipper?.status)}
                                    </span>
                                </td>
                                {/* <td className="p-2 text-center border">{shipper.count_order}</td> */}
                                {/* <td className="p-2 text-center border">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        shipper.sum_shipping_fee,
                                    )}
                                </td>
                                <td className="p-2 text-center border">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        shipper.sum_shipping_fee_adjusted,
                                    )}
                                </td> */}
                                <td className="p-2 text-center border">
                                    {shipper?.joinedDate
                                        ? new Date(shipper.joinedDate).toLocaleDateString("vi-VN")
                                        : ""}
                                </td>
                                <td className="p-2 text-center border">
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() =>
                                            navigate(`/main/shipperslist/${shipper.id}`)
                                        }
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>

            {/* Phân trang */}
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Trước
                </button>
                <span className="self-center">
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
}
