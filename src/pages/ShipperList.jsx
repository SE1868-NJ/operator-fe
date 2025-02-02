import { useState } from "react";
import { useNavigate } from "react-router-dom";

const shippersData = [
    { id: 1, name: "Nguyen A", status: "Active", deliveries: 150, date: "2025-02-01" },
    { id: 2, name: "Nguyen B", status: "Deactive", deliveries: 120, date: "2025-01-25" },
    { id: 3, name: "Nguyen C", status: "Active", deliveries: 200, date: "2025-01-30" },
];

export default function ShipperList() {
    const [searchName, setSearchName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const navigate = useNavigate();

    const applyFilters = () => {
        return shippersData.filter((shipper) => {
            const matchName = searchName
                ? shipper.name.toLowerCase().includes(searchName.toLowerCase())
                : true;
            const matchStatus = filterStatus ? shipper.status === filterStatus : true;
            const matchDate = filterDate ? shipper.date === filterDate : true;
            return matchName && matchStatus && matchDate;
        });
    };

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Shipper List</h1>

            {/* Tìm kiếm và lọc */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    className="border p-2 rounded w-1/3"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <select
                    className="border p-2 rounded w-1/4"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Deactive">Deactive</option>
                </select>
                <input
                    type="date"
                    className="border p-2 rounded w-1/4"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            {/* Bảng danh sách shipper */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Họ tên</th>
                        <th className="border p-2">Trạng thái</th>
                        <th className="border p-2">Số lần giao hàng</th>
                        <th className="border p-2">Ngày tham gia</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applyFilters().map((shipper) => (
                        <tr key={shipper.id} className="border">
                            <td className="border p-2">{shipper.id}</td>
                            <td className="border p-2">{shipper.name}</td>
                            <td className="border p-2">{shipper.status}</td>
                            <td className="border p-2">{shipper.deliveries}</td>
                            <td className="border p-2">{shipper.date}</td>
                            <td className="border p-2">
                                <button
                                    type="button"
                                    className="text-blue-500 underline"
                                    onClick={() => navigate(`/shippers/${shipper.id}`)}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
