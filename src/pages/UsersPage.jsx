import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUser";

const UserList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(""); // State cho tìm kiếm
    const [statusFilter, setStatusFilter] = useState(""); // State cho filter
    const { data, isLoading, error } = useUsers(page);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;

    const users = data?.users || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
            {/* 🔎 Search và Filter */}
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-1/2"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Đình chỉ">Đình chỉ</option>
                </select>
            </div>
            <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Ảnh đại diện</th>
                        <th className="p-2 border">Tên</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Số điện thoại</th>
                        <th className="p-2 border">Trạng thái</th>
                        <th className="p-2 border">Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userID} className="text-center border-b">
                            <td className="p-2 border">
                                <img
                                    src={user.avatar}
                                    alt={user.fullName}
                                    className="w-10 h-10 rounded-full mx-auto"
                                />
                            </td>
                            <td className="p-2 border">{user.fullName}</td>
                            <td className="p-2 border">{user.userEmail}</td>
                            <td className="p-2 border">{user.userPhone}</td>
                            <td className="p-2 border">
                                <span
                                    className={`px-4 py-1 rounded-full text-white text-sm ${
                                        user.status === "Hoạt động"
                                            ? "bg-green-500"
                                            : user.status === "Không hoạt động"
                                              ? "bg-red-500"
                                              : "bg-yellow-500"
                                    }`}
                                >
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-2 border">
                                <Link
                                    to={`/main/user_detail/${user.userID}`}
                                    className="bg-blue-500 text-white py-1 px-3 rounded"
                                >
                                    Xem chi tiết
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="px-4 py-2 mx-1">
                    Trang {page} / {totalPages}
                </span>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default UserList;
