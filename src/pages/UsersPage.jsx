import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUser";

const UserList = () => {
    // Lấy giá trị từ URL
    //const page = Number(searchParams.get("page")) || 1;
    // const search = searchParams.get("search") || "";
    // const phoneSearch = searchParams.get("phoneSearch") || "";
    // const statusFilter = searchParams.get("statusFilter") || "";

    const [whereCondition, setWhereCondition] = useState("name=&phone=&status=");

    const [page, setPage] = useState(1);

    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [status, setStatus] = useState("");

    // Fetch dữ liệu dựa trên page + filter
    const { data, isLoading, error } = useUsers(page, whereCondition);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;

    const users = data?.users || [];
    const totalPages = data?.totalPages || 1;

    // ✅ Xử lý khi nhấn "Tìm kiếm"
    const handleSearch = () => {
        setPage(1); // Reset về trang 1 khi tìm kiếm
        setWhereCondition(`name=${name}&phone=${phone}&status=${status}`);

        //console.log("Params after update:", setWhereCondition);
    };

    const handleReset = () => {
        setPage(1); // Reset về trang 1 khi tìm kiếm
        setWhereCondition("name=&phone=&status=");

        //console.log("Params after update:", setWhereCondition);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
            {/* 🔎 Search và Filter */}
            <div className="flex justify-between mb-4 gap-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-1/4"
                />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo SĐT..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 rounded w-1/4"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 rounded w-1/4"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Đình chỉ</option>
                </select>
                <button
                    type="button"
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                >
                    Tìm kiếm
                </button>
                {/* ✅ Nút Reset */}
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
                >
                    Làm mới
                </button>
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
                                        user.status === "active"
                                            ? "bg-green-500"
                                            : user.status === "inactive"
                                              ? "bg-red-500"
                                              : "bg-yellow-500"
                                    }`}
                                >
                                    {user.status === "active"
                                        ? "Đang hoạt động"
                                        : user.status === "inactive"
                                          ? "Không hoạt động"
                                          : "Đình chỉ"}
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

            {/*Pagination giữ nguyên bộ lọc */}
            <div className="flex justify-center mt-4">
                <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => {
                        setPage((prevPage) => prevPage - 1);
                    }}
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
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Tiếp
                </button>
            </div>
        </div>
    );
};

export default UserList;
