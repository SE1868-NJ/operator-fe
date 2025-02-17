import { Button } from "@mantine/core";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePendingShippers } from "../hooks/useShippers";

const ShipperPendingPage = () => {
    const [operators] = useState([
        {
            id: 1,
            name: "Nguyễn Văn An",
            email: "nguyenvanan@gmail.com",
            role: "Người giao hàng",
            status: "Chờ xử lý",
        },
        {
            id: 2,
            name: "Trần Thị Bích",
            email: "tranthibich@gmail.com",
            role: "Người giao hàng",
            status: "Chờ xử lý",
        },
        {
            id: 3,
            name: "Lê Văn Cần",
            email: "levancan@gmail.com",
            role: "Người giao hàng",
            status: "Chờ xử lý",
        },
        {
            id: 4,
            name: "Phạm Thị Dung",
            email: "phamthidung@gmail.com",
            role: "Người giao hàng",
            status: "Chờ xử lý",
        },
    ]);

    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const itemsPerPage = 2;
    const totalPages = Math.ceil(operators.length / itemsPerPage);

    const paginatedOperators = operators.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Navigate to the shipper detail page
    const handleViewDetails = (shipper) => {
        console.log(shipper);
        navigate(`/main/pendding-shippers/${shipper.id}`, { state: { shipper } });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">
                Danh sách người giao hàng đang trong trạng thái chờ xử lý
            </h1>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Họ và tên</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Vai trò</th>
                        <th className="border px-4 py-2">Trạng thái</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOperators.map((operator) => (
                        <tr key={operator.id}>
                            <td className="border px-4 py-2 text-center">{operator.id}</td>
                            <td className="border px-4 py-2">{operator.name}</td>
                            <td className="border px-4 py-2">{operator.email}</td>
                            <td className="border px-4 py-2 text-center">{operator.role}</td>
                            <td className="border px-4 py-2 text-center">{operator.status}</td>
                            <td className="border px-4 py-2 flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => handleViewDetails(operator)}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Xem chi tiết
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4 space-x-4">
                <Button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Trước
                </Button>
                <span>
                    Trang {page} của {totalPages}
                </span>
                <Button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Kế tiếp
                </Button>
            </div>
        </div>
    );
};

export default ShipperPendingPage;
