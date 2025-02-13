import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShippers } from "../hooks/useShippers";

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

export default function ShipperList() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const offset = (currentPage - 1) * itemsPerPage;
    console.log(offset);

    const { data, isLoading } = useShippers(offset, itemsPerPage, search);

    console.log(data);

    const totalPages = Math.ceil((data?.totalCount || 1) / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-6 mx-auto bg-white">
            <h1 className="mb-4 text-2xl font-bold">Danh sách tất cả người giao hàng</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or phone"
                    className="w-1/3 p-2 border rounded"
                    value={search}
                    onChange={handleSearchChange}
                />
                <select
                    className="w-1/4 p-2 border rounded"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
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
                        <th className="p-2 border">Actions</th>
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
                        {data?.shippers?.map((shipper) => (
                            <tr key={shipper.id} className="border">
                                <td className="p-2 border">{shipper.id}</td>
                                <td className="p-2 border">{shipper.name}</td>
                                <td className="p-2 border">{shipper.phone}</td>
                                <td className="p-2 border">{shipper.email}</td>
                                <td className="p-2 border">
                                    <span
                                        className={
                                            shipper.status === "Active"
                                                ? "text-green-700 bg-green-100 p-1 rounded"
                                                : "text-red-700 bg-red-100 p-1 rounded"
                                        }
                                    >
                                        {shipper.status}
                                    </span>
                                </td>
                                <td className="p-2 border">
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => navigate(`/main/shipperslist/${shipper.id}`)}
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>

            {/* Phân trang */}
            <div className="flex justify-between mt-4">
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="self-center">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
