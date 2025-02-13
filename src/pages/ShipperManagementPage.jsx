import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShipperManagementPage = () => {
    const navigate = useNavigate();

    const handleViewDetails = (shipper) => {
        navigate(`/main/pendding-shippers/${shipper.id}`, { state: { shipper } });
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 mx-auto bg-white p-6 w-full max-w-6xl">
                <h1 className="text-2xl font-bold mb-4">Danh sách shipper</h1>

                {/* Shipper list */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Họ và Tên</th>
                            <th className="border p-2">Số điện thoại</th>
                            <th className="border p-2">Phạm vi hoạt động</th>
                            <th className="border p-2">Phương thức vận chuyển</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shippers.map((shipper) => (
                            <tr key={shipper.id} className="border">
                                <td className="border p-2 text-center">{shipper.id}</td>
                                <td className="border p-2">{shipper.name}</td>
                                <td className="border p-2 text-center">{shipper.phone}</td>
                                <td className="border p-2">{shipper.activityInformation}</td>
                                <td className="border p-2 text-center">{shipper.shippingMethod}</td>
                                <td className="border p-2 text-center">
                                    <span
                                        className={
                                            shipper.status === "Đang hoạt động"
                                                ? "text-green-700 bg-green-100 p-1 rounded"
                                                : "text-red-700 bg-red-100 p-1 rounded"
                                        }
                                    >
                                        {shipper.status}
                                    </span>
                                </td>
                                <td className="border p-2 text-center">
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => handleViewDetails(shipper)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShipperManagementPage;
