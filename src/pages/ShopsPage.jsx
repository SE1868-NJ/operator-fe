import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShops } from "../hooks/useShop";

export default function ShopsPage() {
    const [searchName, setSearchName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const navigate = useNavigate();

    const { data: shops, isLoading, error } = useShops();
    console.log(shops);

    const applyFilters = () => {
        return shops.filter((shop) => {
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
            {/* <Sidebar className="fixed top-0 left-0 h-full" /> */}
            <div className="flex-1 mx-auto bg-white p-6">
                <h1 className="text-2xl font-bold mb-4">All Shop List</h1>

                {/* Statistics */}
                <div className="flex gap-4 mb-4">
                    <div className="bg-blue-100 p-4 rounded-lg shadow-md w-1/3 text-center">
                        <h2 className="text-xl font-bold">New Shops</h2>
                        <p className="text-2xl">8,282</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg shadow-md w-1/3 text-center">
                        <h2 className="text-xl font-bold">Total Orders Today</h2>
                        <p className="text-2xl">200,521</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-1/3 text-center">
                        <h2 className="text-xl font-bold">Total Products</h2>
                        <p className="text-2xl">215,542</p>
                    </div>
                </div>

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
                            <th className="border p-2">Seller</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Mobile</th>
                            {/* <th className="border p-2">Avatar</th> */}
                            <th className="border p-2">Description</th>
                            <th className="border p-2">Address</th>
                            <th className="border p-2">Joined Date</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applyFilters().map((shop) => (
                            <tr key={shop.id} className="border">
                                <td className="border p-2">{shop.id}</td>
                                <td className="border p-2">{shop.name}</td>
                                <td className="border p-2">{shop.owner}</td>
                                <td className="border p-2">{shop.email}</td>
                                <td className="border p-2">{shop.mobile}</td>
                                <td className="border p-2">{shop.description}</td>
                                <td className="border p-2">{shop.address}</td>
                                <td className="border p-2">{shop.createdAt}</td>
                                <td className="border p-2">
                                    <span
                                        className={
                                            shop.status === "Active"
                                                ? "text-green-700 bg-green-100 p-1 rounded"
                                                : "text-red-700 bg-red-100 p-1 rounded"
                                        }
                                    >
                                        {shop.status}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => navigate(`/main/shop/${shop.id}`)}
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
