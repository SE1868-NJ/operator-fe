import { useDebouncedState } from "@mantine/hooks"; // keep useDebouncedState
import { useMemo, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useShops } from "../hooks/useShop.js";

// import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// const data = [
//     { quarter: "2023-Q1", shop_count: 12 },
//     { quarter: "2023-Q2", shop_count: 18 },
//     { quarter: "2023-Q3", shop_count: 25 },
//     { quarter: "2023-Q4", shop_count: 20 },
//     { quarter: "2024-Q1", shop_count: 30 },
// ];

// const ShopStatistics = () => {
//     return (
//         <div className="w-full h-96 p-4 bg-white rounded-lg">
//             <h2 className="text-xl font-bold mb-4">Số lượng shop mới theo quý</h2>
//             <ResponsiveContainer width="100%" height="90%">
//                 <BarChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="quarter" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="shop_count" fill="#4F46E5" barSize={50} />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

export default function ShopsPage() {
    const navigate = useNavigate();
    const limit = 10;
    const timeOut = 200;
    const [page, setPage] = useState(1);
    // const offset = (page - 1) * limit;

    const [searchShopName, setSearchShopName] = useDebouncedState("", timeOut);
    const [searchOwnerName, setSearchOwnerName] = useDebouncedState("", timeOut);
    const [searchEmail, setSearchEmail] = useDebouncedState("", timeOut);
    const [searchPhone, setSearchPhone] = useDebouncedState("", timeOut);

    const filterData = useMemo(
        () => ({
            shopName: searchShopName,
            ownerName: searchOwnerName,
            shopEmail: searchEmail,
            shopPhone: searchPhone,
        }),
        [searchShopName, searchOwnerName, searchEmail, searchPhone],
    );

    const { data, isLoading, error } = useShops(page, limit, filterData);

    console.log(data?.shops);

    const totalPages = Number.parseInt(data?.totalShops / limit) + 1;

    // if (isLoading) {
    //     return <div className="flex justify-center items-center h-screen">Loading...</div>;
    // }

    // if (error || !data?.shops) {
    //     return <div className="flex justify-center items-center h-screen">Shop not found</div>;
    // }

    return (
        <div className="flex h-screen">
            {/* <Sidebar className="fixed top-0 left-0 h-full" /> */}
            <div className="flex-1 mx-auto bg-white p-6">
                <h1 className="text-2xl font-bold mb-4">Danh sách các shop</h1>

                {/* Statistics */}
                <div className="flex gap-4 mb-4">
                    <div className="bg-blue-100 p-4 rounded-lg shadow-md w-1/3 text-center">
                        <h2 className="text-xl font-semibold text-blue-800">New Shops</h2>
                        <p className="text-2xl font-bold">8,282</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg shadow-md w-1/3 text-center">
                        <h2 className="text-xl font-semibold text-green-800">Total Orders Today</h2>
                        <p className="text-2xl font-bold">200,521</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-1/3 text-center">
                        <h2 className="text-xl font-semibold text-yellow-800">Total Products</h2>
                        <p className="text-2xl font-bold">215,542</p>
                    </div>
                </div>

                {/* <ShopStatistics /> */}
                <div>
                    <h1 className="text-2xl font-bold mb-4">Tìm kiếm</h1>
                </div>
                {/* Tìm kiếm và lọc */}
                <div className="p-6">
                    {" "}
                    {/* Search Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label
                                htmlFor="searchShopName"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Tìm tên cửa hàng:
                            </label>
                            <input
                                type="text"
                                id="searchShopName"
                                placeholder="Tên cửa hàng"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                defaultValue={searchShopName}
                                onChange={(e) => setSearchShopName(e.currentTarget.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="searchOwnerName"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Tìm chủ cửa hàng:
                            </label>
                            <input
                                type="text"
                                id="searchOwnerName"
                                placeholder="Tên chủ cửa hàng"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                defaultValue={searchOwnerName}
                                onChange={(e) => setSearchOwnerName(e.currentTarget.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="searchShopEmail"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Tìm email cửa hàng:
                            </label>
                            <input
                                type="text"
                                id="searchShopEmail"
                                placeholder="Email cửa hàng"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                defaultValue={searchEmail}
                                onChange={(e) => setSearchEmail(e.currentTarget.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="searchShopPhone"
                                className="block text-gray-700 text-sm font-bold mb-2"
                            >
                                Tìm SĐT cửa hàng:
                            </label>
                            <input
                                type="text"
                                id="searchShopPhone"
                                placeholder="Số điện thoại cửa hàng"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                defaultValue={searchPhone}
                                onChange={(e) => setSearchPhone(e.currentTarget.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Shop list */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Tên Shop</th>
                            <th className="border p-2">Chủ cửa hàng</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">SĐT</th>
                            {/* <th className="border p-2">Avatar</th> */}
                            <th className="border p-2">Mô tả shop</th>
                            <th className="border p-2">Địa chỉ</th>
                            <th className="border p-2">Ngày tham gia</th>
                            <th className="border p-2">Trạng thái</th>
                            <th className="border p-2">Xem chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && (
                            <tr>
                                <td colSpan={8} className="px-5 py-5 text-center">
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                        role="alert"
                                    >
                                        <strong className="font-bold">Lỗi!</strong>
                                        <span className="block sm:inline">
                                            Đã có lỗi xảy ra khi lấy dữ liệu.
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {isLoading && (
                            <tr>
                                <td colSpan={8} className="px-5 py-5 text-center">
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500" />
                                        <span className="ml-2">Đang tải dữ liệu...</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {data?.shops && data?.shops?.length === 0 && !isLoading && !error ? (
                            <tr>
                                <td colSpan={8} className="px-5 py-5 text-center">
                                    Không có cửa hàng nào!
                                </td>
                            </tr>
                        ) : (
                            data?.shops?.map((shop) => (
                                <tr key={shop.shopID} className="border">
                                    <td className="border p-2">{shop.shopID}</td>
                                    <td className="border p-2">{shop.shopName}</td>
                                    <td className="border p-2">{shop.Owner.fullName}</td>
                                    <td className="border p-2">{shop.shopEmail}</td>
                                    <td className="border p-2">{shop.shopPhone}</td>
                                    <td className="border p-2">{shop.shopDescription}</td>
                                    <td className="border p-2">{shop.shopPickUpAddress}</td>
                                    <td className="border p-2">
                                        {new Date(shop.shopJoinedDate).toLocaleDateString()}
                                    </td>
                                    <td className="border p-2">
                                        <span
                                            className={`text-sm font-semibold px-3 py-1 rounded-md ${
                                                shop.shopStatus === "active"
                                                    ? "text-green-700 bg-green-100 border border-green-500"
                                                    : "text-red-700 bg-red-100 border border-red-500"
                                            }`}
                                        >
                                            {shop.shopStatus === "active"
                                                ? "Đang hoạt động"
                                                : "Bị tạm dừng"}
                                        </span>
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            type="button"
                                            className="text-blue-500 underline"
                                            onClick={() => navigate(`/main/shop/${shop.shopID}`)}
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* Phân trang */}
                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 text-white bg-gray-500 rounded disabled:opacity-50"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        Trước
                    </button>
                    <span className="self-center">
                        Trang {page} trên {totalPages}
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
        </div>
    );
}
