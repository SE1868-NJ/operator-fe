import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShipperManagementPage = () => {
    const [operators] = useState([
        {
            id: 1,
            name: "Nguyễn Văn An",
            phone: "0923457789",
            activityInformation: "Giao hàng chung cư Vincom Park Place",
            shippingMethod: "Xe máy",
            status: "Đang hoạt động",
        },
        {
            id: 2,
            name: "Trần Thị Bích",
            phone: "0987654321",
            activityInformation: "Giao hàng chung cư Keangnam Hanoi Landmark Tower",
            shippingMethod: "Xe đạp",
            status: "Đang hoạt động",
        },
        {
            id: 3,
            name: "Lê Văn Cần",
            phone: "0912345678",
            activityInformation: "Giao hàng chung cư Royal City",
            shippingMethod: "Xe máy",
            status: "Đang hoạt động",
        },
        {
            id: 4,
            name: "Phạm Thị Dung",
            phone: "0901234567",
            activityInformation: "Giao hàng chung cư The Link Ciputra",
            shippingMethod: "Xe máy",
            status: "Đang hoạt động",
        },
    ]);

    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách shipper</h1>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Họ và Tên</th>
                        <th className="border px-4 py-2">Số điện thoại</th>
                        <th className="border px-4 py-2">Phạm vi hoạt động</th>
                        <th className="border px-4 py-2">Phương thức vận chuyển</th>
                        <th className="border px-4 py-2">Trạng thái hoạt động</th>
                    </tr>
                </thead>
                <tbody>
                    {operators.map((operator) => (
                        <tr key={operator.id}>
                            <td className="border px-4 py-2 text-center">{operator.id}</td>
                            <td className="border px-4 py-2">{operator.name}</td>
                            <td className="border px-4 py-2 text-center">{operator.phone}</td>
                            <td className="border px-4 py-2">{operator.activityInformation}</td>
                            <td className="border px-4 py-2 text-center">
                                {operator.shippingMethod}
                            </td>
                            <td className="border px-4 py-2 text-center">{operator.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShipperManagementPage;
