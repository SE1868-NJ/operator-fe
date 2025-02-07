import { useState } from "react";
import { useNavigate } from "react-router-dom";

const shippersData = [
    {
        id: 1,
        avatar: "https://via.placeholder.com/50",
        name: "Nguyen A",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        hometown: "Ha Noi",
        address: "123 Street, Ha Noi",
        phone: "0123456789",
        cccd: "123456789012",
        email: "0aM9X@example.com",
        status: "Active",
        activityArea: "Ha Noi",
        shippingMethod: "Xe máy",
        emergencyContact: {
            name: "Nguyen Van B",
            relation: "Anh trai",
            phone: "0912345678",
        },
    },
    {
        id: 2,
        avatar: "https://via.placeholder.com/50",
        name: "Nguyen B",
        gender: "Female",
        dateOfBirth: "1995-02-02",
        hometown: "Hai Phong",
        address: "456 Street, Hai Phong",
        phone: "0976543210",
        cccd: "098765432109",
        email: "V4r3t@example.com",
        status: "Deactive",
        activityArea: "Ha Noi",
        shippingMethod: "Xe máy",
        emergencyContact: {
            name: "Nguyen Van C",
            relation: "Mẹ",
            phone: "0909876543",
        },
    },
];

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

export default function ShipperList() {
    const [searchName, setSearchName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const navigate = useNavigate();

    const applyFilters = () => {
        return shippersData.filter((shipper) => {
            const matchName = searchName
                ? shipper.name.toLowerCase().includes(searchName.toLowerCase()) ||
                  shipper.phone.includes(searchName)
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
                    placeholder="Search by name or phone"
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
                        <th className="border p-2">SĐT</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Trạng thái</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applyFilters().map((shipper) => (
                        <tr key={shipper.id} className="border">
                            <td className="border p-2">{shipper.id}</td>
                            <td className="border p-2">{shipper.name}</td>
                            <td className="border p-2">{shipper.phone}</td>
                            <td className="border p-2">{shipper.email}</td>
                            <td className="border p-2">{shipper.status}</td>
                            <td className="border p-2">
                                <button
                                    type="button"
                                    className="text-blue-500 underline"
                                    onClick={() => navigate(`/shipper/${shipper.id}`)}
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
