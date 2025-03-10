//./pages.ShipperPendingPage
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePendingShippers } from "../hooks/useShippers";

export default function ShipperPendingPage() {
    const navigate = useNavigate();
    const limit = 10;
    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const filterData = useMemo(
        () => ({
            name: searchName,
            email: searchEmail,
            status: searchStatus,
        }),
        [searchName, searchEmail, searchStatus],
    );

    const { data, isLoading, error } = usePendingShippers(limit, page, filterData);
    const totalPages = Math.ceil((data?.total || 0) / limit);
    const pendingShippers = data?.shippers || [];

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Quản lý người giao hàng chờ duyệt</h1>
            </div>

            {/* Shipper Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {[
                                "ID",
                                "Họ và tên",
                                "Email",
                                "Số điện thoại",
                                "Phương thức vận chuyển",
                                "Trạng thái",
                                "Hành động",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pendingShippers.map((shipper, index) => (
                            <tr key={shipper.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {(page - 1) * limit + index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {shipper.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {shipper.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {shipper.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {shipper.shippingMethod}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {shipper.status}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/main/pendding-shippers/${shipper.id}`)
                                        }
                                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-4">
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Trước
                </button>
                <span className="self-center">
                    Trang {page} của {totalPages}
                </span>
                <button
                    type="button"
                    className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Sau
                </button>
            </div>
        </div>
    );
}
