import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShipperManagementPage = () => {
    const [operators] = useState([
        {
            id: 1,
            name: "TamNV",
            email: "tamnv@gmail.com",
            role: "Shipper",
            status: "Pending", // Shipper with Pending status
        },
        {
            id: 2,
            name: "TrangTT",
            email: "trangtt@gmail.com",
            role: "Shipper",
            status: "Pending",
        },
        {
            id: 3,
            name: "HoaVT",
            email: "hoavt@gmail.com",
            role: "Shipper",
            status: "Pending",
        },
        {
            id: 4,
            name: "TramNT",
            email: "tramnt@gmail.com",
            role: "Shipper",
            status: "Pending",
        },
    ]);

    const navigate = useNavigate();

    // Filter out only the shippers with "Pending" status
    const pendingOperators = operators.filter((operator) => operator.status === "Pending");

    // Navigate to the shipper detail page
    const handleViewDetails = (operator) => {
        navigate(`/main/operators/${operator.id}`, { state: { operator } });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">List of Shippers in Pending Status</h1>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingOperators.map((operator) => (
                        <tr key={operator.id}>
                            <td className="border px-4 py-2 text-center">{operator.id}</td>
                            <td className="border px-4 py-2">{operator.name}</td>
                            <td className="border px-4 py-2">{operator.email}</td>
                            <td className="border px-4 py-2">{operator.role}</td>
                            <td className="border px-4 py-2">{operator.status}</td>
                            <td className="border px-4 py-2 flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => handleViewDetails(operator)}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShipperManagementPage;
