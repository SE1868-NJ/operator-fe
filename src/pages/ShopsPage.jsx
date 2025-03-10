import { Button } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks"; // keep useDebouncedState
import { useMemo, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useExportShops, useShops } from "../hooks/useShop.js";
import ExportExcelButton from "./ExportExcelButton.jsx";

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

    const { data: exportData } = useExportShops(page, 99999, filterData);
    // console.log(data?.shops);
    const excelData = (exportData?.shops || []).map((shop) => ({
        shopID: shop.shopID,
        shopName: shop.shopName,
        ownerID: shop.ownerID,
        taxCode: shop.taxCode,
        shopEmail: shop.shopEmail,
        shopPhone: shop.shopPhone,
        shopDescription: shop.shopDescription,
        shopPickUpAddress: shop.shopPickUpAddress,
        shopStatus: shop.shopStatus,
        shopAvatar: shop.shopAvatar,
        shopOperationHours: shop.shopOperationHours,
        shopJoinedDate: shop.shopJoinedDate,
        businessType: shop.businessType,
        shopRating: shop.shopRating,
        shopBankAccountNumber: shop.shopBankAccountNumber,
        shopBankName: shop.shopBankName,
        // Thông tin của Owner
        ownerFullName: shop.Owner?.fullName || "",
        ownerDateOfBirth: shop.Owner?.dateOfBirth || "",
        ownerGender: shop.Owner?.gender || "",
        ownerEmail: shop.Owner?.userEmail || "",
        ownerPhone: shop.Owner?.userPhone || "",
        ownerCitizenID: shop.Owner?.userCitizenID || "",
        ownerAddress: shop.Owner?.userAddress || "",
        ownerIdentificationNumber: shop.Owner?.identificationNumber || "",
        ownerIdCardFrontFile: shop.Owner?.idCardFrontFile || "",
        ownerIdCardBackFile: shop.Owner?.idCardBackFile || "",
        ownerAvatar: shop.Owner?.avatar || "",
    }));

    const totalPages = Number.parseInt(data?.totalShops / limit) + 1;

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error || !data?.shops) {
        return <div className="flex justify-center items-center h-screen">Shop not found</div>;
    }

    return (
        <div className="flex h-screen">
            {/* <Sidebar className="fixed top-0 left-0 h-full" /> */}
            <div className="flex-1 mx-auto bg-white p-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Danh sách shop</h2>
                    <ExportExcelButton data={excelData} fileName="ShopList" />
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
                <table className="w-full border border-gray-300 shadow-lg rounded-lg overflow-hidden bg-white">
                    <thead className="bg-gray-100 text-gray-700 text-center uppercase font-semibold tracking-wide">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Tên Shop</th>
                            <th className="p-4">Chủ cửa hàng</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">SĐT</th>
                            <th className="p-4">Mô tả shop</th>
                            <th className="p-4">Địa chỉ</th>
                            <th className="p-4">Ngày tham gia</th>
                            <th className="p-4">Trạng thái</th>
                            <th className="p-4">Xem chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.shops?.map((shop, index) => (
                            <tr
                                key={shop.shopID}
                                className={`border-b text-center hover:bg-gray-50 transition-all ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                <td className="p-4">{shop.shopID}</td>
                                <td className="p-4 font-medium text-gray-800 flex items-center justify-center gap-2">
                                    {shop.shopName}
                                </td>
                                <td className="p-4">{shop.Owner.fullName}</td>
                                <td className="p-4 text-blue-500">{shop.shopEmail}</td>
                                <td className="p-4">{shop.shopPhone}</td>
                                <td
                                    className="p-4 truncate max-w-[200px]"
                                    title={shop.shopDescription}
                                >
                                    {shop.shopDescription}
                                </td>
                                <td className="p-4">{shop.shopPickUpAddress}</td>
                                <td className="p-4">
                                    {new Date(shop.shopJoinedDate).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span
                                        className="flex items-center justify-center px-3 py-1 rounded-full text-white text-sm font-semibold w-24 whitespace-nowrap"
                                        style={{
                                            backgroundColor:
                                                shop.shopStatus === "active"
                                                    ? "#22C55E"
                                                    : shop.shopStatus === "inactive"
                                                      ? "#EF4444"
                                                      : "#FACC15",
                                        }}
                                    >
                                        {shop.shopStatus === "active"
                                            ? "Hoạt động"
                                            : shop.shopStatus === "inactive"
                                              ? "Không hoạt động"
                                              : "Đình chỉ"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Button
                                        color="blue"
                                        size="sm"
                                        radius="md"
                                        variant="filled"
                                        onClick={() => navigate(`/main/shop/${shop.shopID}`)}
                                        styles={{
                                            root: {
                                                transition: "all 0.2s ease",
                                            },
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>
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
