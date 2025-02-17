import { Button } from "@mantine/core";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePendingShippers } from "../hooks/useShippers";

const ShipperManagementPage = () => {
    const { id } = useParams();
    const { data: pendingShippers } = usePendingShippers();
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
                    {pendingShippers?.map((operator) => (
                        <tr key={operator.id}>
                            <td className="border px-4 py-2 text-center">{operator.id}</td>
                            <td className="border px-4 py-2">{operator.name}</td>
                            <td className="border px-4 py-2">{operator.email}</td>
                            <td className="border px-4 py-2">{operator.role}</td>
                            <td className="border px-4 py-2">{operator.status}</td>
                            <td className="border px-4 py-2 flex justify-center space-x-4">
                                <Button
                                    type="button"
                                    component={Link}
                                    to={`/main/pendding-shippers/${id}`}
                                >
                                    View
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShipperManagementPage;
