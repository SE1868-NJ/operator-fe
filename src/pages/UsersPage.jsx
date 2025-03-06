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

    // Xử lý khi nhấn "Tìm kiếm"
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
        <div className="max-w-4xl p-4 mx-auto mt-10 bg-white rounded-lg shadow-md">
            {/* 🔎 Search và Filter */}
            <div className="flex justify-between gap-2 mb-4">

                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-1/4 p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo SĐT..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-1/4 p-2 border rounded"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-1/4 p-2 border rounded"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="suspended">Đình chỉ</option>
                </select>
                <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-2 text-sm text-white bg-blue-500 rounded"
                >
                    Tìm kiếm
                </button>
                {/* Nút Reset */}
                <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 text-sm text-white bg-gray-500 rounded"
                >
                    Làm mới
                </button>
            </div>

            <h2 className="mb-4 text-2xl font-bold">Danh sách người dùng</h2>
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
                                    src="https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"
                                    alt={user.fullName}
                                    className="w-10 h-10 mx-auto rounded-full"
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
                                    className="px-3 py-1 text-white bg-blue-500 rounded"
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
