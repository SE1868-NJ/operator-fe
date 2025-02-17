import { ActionIcon, Modal } from "@mantine/core";
/* eslint-disable react-hooks/exhaustive-deps */
import { useDebouncedState, useDisclosure } from "@mantine/hooks"; // keep useDebouncedState
import { IconEye } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApprovedShops, usePendingShops } from "../hooks/useShop";

const PendingShopListPage = () => {
    const navigate = useNavigate();
    const limit = 10;
    const timeOut = 200;
    const [page, setPage] = useState(1);
    const [reason, setReason] = useState("");

    const [searchShopName, setSearchShopName] = useDebouncedState("", timeOut);
    const [searchOwnerName, setSearchOwnerName] = useDebouncedState("", timeOut);
    const [searchEmail, setSearchEmail] = useDebouncedState("", timeOut);
    const [searchPhone, setSearchPhone] = useDebouncedState("", timeOut);

    const [activeButton, setActiveButton] = useState("pending");

    const [opened, { open, close }] = useDisclosure(false);

    const filterData = useMemo(
        () => ({
            shopName: searchShopName,
            ownerName: searchOwnerName,
            shopEmail: searchEmail,
            shopPhone: searchPhone,
        }),
        [searchShopName, searchOwnerName, searchEmail, searchPhone],
    );

    const {
        data: responseData,
        isLoading: pendingShopsLoading,
        error: pendingShopsError,
    } = usePendingShops(limit, page, filterData);

    const {
        data: approvedShopsData,
        isLoading: approvedShopsLoading,
        error: approvedShopsError,
    } = useApprovedShops(limit, page, filterData);

    // pending
    const pendingShops = responseData?.pendingShops || [];
    const totalPending = responseData?.totalPendingShops || 0;
    // approved
    const approvedShops = approvedShopsData?.approvedShops || [];
    const totalApproved = approvedShopsData?.totalApprovedShops || 0;

    const handleToggleButton = (buttonName) => {
        setPage(1); // Reset page to 1 when switching tabs
        setActiveButton(buttonName);
    };

    const handleOpenModal = (reason) => {
        setReason(reason);
        open();
    };

    // Determine which list to display based on active button
    const shopsToDisplay = useMemo(() => {
        return activeButton === "pending" ? pendingShops : approvedShops;
    }, [activeButton, pendingShops, approvedShops]);

    const isLoading = activeButton === "pending" ? pendingShopsLoading : approvedShopsLoading;
    const error = activeButton === "pending" ? pendingShopsError : approvedShopsError;
    const total = activeButton === "pending" ? totalPending : totalApproved;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="container mx-auto p-5">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="py-4 px-6 bg-gray-100 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-800 text-center">
                        {activeButton === "pending"
                            ? "Các cửa hàng đang chờ duyệt"
                            : "Các cửa hàng đã duyệt bởi tôi"}
                    </h1>
                </div>

                <div className="p-6">
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

                    {/* Toggle Switch */}
                    <div>
                        <button
                            className={`hover:bg-gray-200 text-gray-600 border font-bold py-2 px-6 focus:outline-none focus:shadow-outline
              ${
                  activeButton === "pending"
                      ? "bg-gray-100 border-gray-100 border-t-4 border-t-black" // Active: nền xám nhạt, border xám, border trên đen
                      : "border-gray-300" // Không Active: border xám
              }`}
                            type="button"
                            onClick={() => handleToggleButton("pending")}
                        >
                            Đang chờ duyệt
                        </button>
                        <button
                            className={`hover:bg-gray-200 text-gray-600 border font-bold py-2 px-6 focus:outline-none focus:shadow-outline ${
                                activeButton === "approved"
                                    ? "bg-gray-100 border-gray-100 border-t-4 border-t-black"
                                    : "border-gray-300"
                            }`}
                            type="button"
                            onClick={() => handleToggleButton("approved")}
                        >
                            Đã duyệt bởi tôi
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tên cửa hàng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Chủ cửa hàng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Địa chỉ cửa hàng
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {activeButton === "pending" ? "Ngày gửi" : "Ngày duyệt"}
                                    </th>
                                    <th
                                        hidden={activeButton === "pending"}
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                    >
                                        Kết quả duyệt
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Chi tiết
                                    </th>
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
                                {shopsToDisplay &&
                                shopsToDisplay?.length === 0 &&
                                !isLoading &&
                                !error ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-5 text-center">
                                            Không có cửa hàng nào!
                                        </td>
                                    </tr>
                                ) : (
                                    shopsToDisplay?.map((shop, index) => (
                                        <tr key={shop.shopID}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {page * limit - limit + index + 1}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending"
                                                    ? shop.shopName
                                                    : shop.shop.shopName}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending"
                                                    ? shop.Owner.fullName
                                                    : shop.shop.Owner.fullName}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending"
                                                    ? shop.shopEmail
                                                    : shop.shop.shopEmail}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending"
                                                    ? shop.shopPhone
                                                    : shop.shop.shopPhone}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending"
                                                    ? shop.shopPickUpAddress
                                                    : shop.shop.shopPickUpAddress}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending"
                                                    ? shop.shopJoinedDate
                                                    : shop.createAt}
                                            </td>
                                            <td
                                                hidden={activeButton === "pending"}
                                                className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
                                            >
                                                {activeButton === "pending" ? (
                                                    ""
                                                ) : (
                                                    <input
                                                        type="button"
                                                        disabled
                                                        className={`rounded py-2 px-4 font-bold text-white
                            ${
                                shop.changedStatus === "accepted"
                                    ? "bg-green-500" // Xanh lá cây
                                    : "bg-red-500" // Đỏ
                            }
                            cursor-not-allowed`} // Vô hiệu hóa
                                                        value={shop.changedStatus}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {activeButton === "pending" ? (
                                                    <button
                                                        hidden={activeButton !== "pending"}
                                                        onClick={() =>
                                                            navigate(
                                                                `/main/pendingshop/${shop.shopID}`,
                                                            )
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                        type="button"
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                ) : (
                                                    <ActionIcon
                                                        variant="default"
                                                        onClick={() => handleOpenModal(shop.reason)}
                                                    >
                                                        <IconEye />
                                                    </ActionIcon>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {/* Modal hien thi ly do */}
                                <Modal
                                    opened={opened}
                                    onClose={close}
                                    withCloseButton={false}
                                    centered
                                    classNames={{
                                        modal: "max-w-lg w-full p-6 rounded-lg shadow-xl bg-white", // Adding padding, rounded corners, and shadow for the modal
                                        title: "text-2xl font-semibold text-gray-800 mb-4", // Larger, more prominent title with better color contrast
                                    }}
                                >
                                    <p className="font-semibold text-xl text-gray-800 mb-6">
                                        Lý do từ chối
                                    </p>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-4 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                        disabled
                                        value={reason}
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="button"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                                            onClick={close}
                                        >
                                            Đóng
                                        </button>
                                    </div>
                                </Modal>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-5">
                        <nav aria-label="Page navigation">
                            <ul className="inline-flex items-center -space-x-px">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setPage(Math.max(page - 1, 1))}
                                        disabled={page === 1}
                                        className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                                    >
                                        Trang trước
                                    </button>
                                </li>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (pageNumber) => (
                                        <li key={pageNumber}>
                                            <button
                                                type="button"
                                                onClick={() => setPage(pageNumber)}
                                                className={`py-2 px-3 leading-tight ${
                                                    page === pageNumber
                                                        ? "text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                                }  focus:outline-none`}
                                            >
                                                {pageNumber}
                                            </button>
                                        </li>
                                    ),
                                )}

                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setPage(Math.min(page + 1, totalPages))}
                                        disabled={
                                            page === totalPages ||
                                            (shopsToDisplay &&
                                                shopsToDisplay?.length === 0 &&
                                                !isLoading &&
                                                !error)
                                        }
                                        className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trang sau
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingShopListPage;
