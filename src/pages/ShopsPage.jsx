import { useDebouncedState } from "@mantine/hooks"; // keep useDebouncedState
import { useMemo, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useShops } from "../hooks/useShop.js";

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
                <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 text-center uppercase font-semibold tracking-wide">
                            <th className="border p-3">ID</th>
                            <th className="border p-3">Tên Shop</th>
                            <th className="border p-3">Chủ cửa hàng</th>
                            <th className="border p-3">Email</th>
                            <th className="border p-3">SĐT</th>
                            <th className="border p-3">Mô tả shop</th>
                            <th className="border p-3">Địa chỉ</th>
                            <th className="border p-3">Ngày tham gia</th>
                            <th className="border p-3">Trạng thái</th>
                            <th className="border p-3">Xem chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.shops?.map((shop) => (
                            <tr
                                key={shop.shopID}
                                className="border text-center transition-all duration-200 hover:bg-gray-100"
                            >
                                <td className="border p-3 py-5">{shop.shopID}</td>
                                <td className="border p-3 py-5 font-medium text-gray-800">
                                    {shop.shopName}
                                </td>
                                <td className="border p-3 py-5">{shop.Owner.fullName}</td>
                                <td className="border p-3 py-5 text-blue-500">{shop.shopEmail}</td>
                                <td className="border p-3 py-5">{shop.shopPhone}</td>
                                <td className="border p-3 py-5 truncate max-w-[200px]">
                                    {shop.shopDescription}
                                </td>
                                <td className="border p-3 py-5">{shop.shopPickUpAddress}</td>
                                <td className="border p-3 py-5">
                                    {new Date(shop.shopJoinedDate).toLocaleDateString()}
                                </td>
                                <td className="border p-3 py-5">
                                    <span
                                        className={`px-4 py-1 rounded-full text-white text-sm ${
                                            shop.shopStatus === "active"
                                                ? "bg-green-500"
                                                : shop.shopStatus === "inactive"
                                                  ? "bg-red-500"
                                                  : "bg-yellow-500"
                                        }`}
                                    >
                                        {shop.shopStatus === "active"
                                            ? "Hoạt động"
                                            : shop.shopStatus === "inactive"
                                              ? "Không hoạt động"
                                              : "Đình chỉ"}
                                    </span>
                                </td>
                                <td className="border p-3">
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                        onClick={() => navigate(`/main/shop/${shop.shopID}`)}
                                    >
                                        Chi tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Phân trang */}
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
