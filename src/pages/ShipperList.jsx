import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShippers, useTotalShippingFeeAllShippers } from "../hooks/useShippers.js";
import TopShippersTable from "./TopShippersTable.jsx";

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

function translateStatus(status) {
    const statusMap = {
        active: "Đang hoạt động",
        pending: "Đang duyệt",
        deactive: "Dừng hoạt động",
    };
    return statusMap[status] || status;
}

export default function ShipperList() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const offset = (currentPage - 1) * itemsPerPage;
    console.log(offset);

    const { data, isLoading } = useShippers(offset, itemsPerPage, search, filterStatus);
    const { data: allShipperFee, isLoading: isLoadingShippingFee } = useTotalShippingFeeAllShippers(
        0,
        0,
    );
    console.log("totalShippingFee", allShipperFee);

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

    return (
        <div className="p-6 mx-auto bg-white">
            <TopShippersTable />

            <h1 className="pt-4 mb-4 text-2xl font-bold">Danh sách tất cả người giao hàng</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm bằng tên và SĐT"
                    className="w-1/3 p-2 border rounded"
                    value={search}
                    onChange={handleSearchChange}
                />
                <select
                    className="w-1/4 p-2 border rounded"
                    value={filterStatus}
                    onChange={handleStatusChange}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Đang hoạt động</option>
                    <option value="deactive">Dừng hoạt động</option>
                    <option value="active">Đang duyệt</option>
                </select>
                <input
                    type="date"
                    className="w-1/4 p-2 border rounded"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
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
                        <th className="p-2 border">Tống số đơn hàng</th>
                        <th className="p-2 border">Tống doanh thu</th>
                        <th className="p-2 border">
                            Tổng doanh thu (VND) <br />
                            Đã trích xuất
                        </th>
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
                        {allShipperFee?.sumShippingFee?.map((shipper) => (
                            <tr key={shipper.id} className="border">
                                <td className="p-2 text-center border">{shipper?.Shipper.id}</td>
                                <td className="p-2 text-center border">{shipper?.Shipper.name}</td>
                                <td className="p-2 text-center border">{shipper?.Shipper.phone}</td>
                                <td className="p-2 text-center border">{shipper?.Shipper.email}</td>
                                <td className="p-2 text-center border">
                                    <span
                                        className={
                                            shipper.Shipper.status === "active"
                                                ? "text-green-700 bg-green-100 p-1 rounded"
                                                : shipper.Shipper.status === "pending"
                                                  ? "text-yellow-700 bg-yellow-100 p-1 rounded"
                                                  : "text-red-700 bg-red-100 p-1 rounded"
                                        }
                                    >
                                        {translateStatus(shipper?.Shipper.status)}
                                    </span>
                                </td>
                                <td className="p-2 text-center border">{shipper.count_order}</td>
                                <td className="p-2 text-center border">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        shipper.sum_shipping_fee,
                                    )}
                                </td>
                                <td className="p-2 text-center border">
                                    {new Intl.NumberFormat("vi-VN").format(
                                        shipper.sum_shipping_fee_adjusted,
                                    )}
                                </td>

                                <td className="p-2 text-center border">
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() =>
                                            navigate(`/main/shipperslist/${shipper.Shipper.id}`)
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
