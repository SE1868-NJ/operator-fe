import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const shopsData = [
    {
        id: 1,
        name: "Shop A",
        avatar: "avatar1.png",
        address: "123 Main St",
        createdAt: "2023-01-01",
        status: "Active",
    },
    {
        id: 2,
        name: "Shop B",
        avatar: "avatar2.png",
        address: "456 Elm St",
        createdAt: "2023-02-01",
        status: "Active",
    },
    {
        id: 3,
        name: "Shop C",
        avatar: "avatar3.png",
        address: "789 Oak St",
        createdAt: "2023-03-01",
        status: "Active",
    },
    {
        id: 4,
        name: "Shop D",
        avatar: "avatar4.png",
        address: "101 Pine St",
        createdAt: "2023-04-01",
        status: "Active",
    },
    {
        id: 5,
        name: "Shop E",
        avatar: "avatar5.png",
        address: "202 Maple St",
        createdAt: "2023-05-01",
        status: "Active",
    },
    {
        id: 6,
        name: "Shop F",
        avatar: "avatar6.png",
        address: "303 Birch St",
        createdAt: "2023-06-01",
        status: "Active",
    },
    {
        id: 7,
        name: "Shop G",
        avatar: "avatar7.png",
        address: "404 Cedar St",
        createdAt: "2023-07-01",
        status: "Active",
    },
    {
        id: 8,
        name: "Shop H",
        avatar: "avatar8.png",
        address: "505 Walnut St",
        createdAt: "2023-08-01",
        status: "Active",
    },
    {
        id: 9,
        name: "Shop I",
        avatar: "avatar9.png",
        address: "606 Chestnut St",
        createdAt: "2023-09-01",
        status: "Active",
    },
    {
        id: 10,
        name: "Shop J",
        avatar: "avatar10.png",
        address: "707 Redwood St",
        createdAt: "2023-10-01",
        status: "Active",
    },
];

export default function ShopManagementPage() {
    const [searchName, setSearchName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const navigate = useNavigate();

    const applyFilters = () => {
        return shopsData.filter((shop) => {
            const matchName = searchName
                ? shop.name.toLowerCase().includes(searchName.toLowerCase())
                : true;
            const matchStatus = filterStatus ? shop.status === filterStatus : true;
            const matchDate = filterDate ? shop.createdAt === filterDate : true;
            return matchName && matchStatus && matchDate;
        });
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">All Shop List</h1>

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

                {/* Shop list */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Avatar</th>
                            <th className="border p-2">Address</th>
                            <th className="border p-2">Created At</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applyFilters().map((shop) => (
                            <tr key={shop.id} className="border">
                                <td className="border p-2">{shop.id}</td>
                                <td className="border p-2">{shop.name}</td>
                                <td className="border p-2">
                                    <img
                                        src={shop.avatar}
                                        alt={shop.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                </td>
                                <td className="border p-2">{shop.address}</td>
                                <td className="border p-2">{shop.createdAt}</td>
                                <td className="border p-2">{shop.status}</td>
                                <td className="border p-2">
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => navigate(`/shops/${shop.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
