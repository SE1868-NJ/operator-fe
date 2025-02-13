import { useNavigate } from "react-router-dom";
import { usePendingShops } from "../hooks/useShop";

const PendingShopListPage = () => {
    const navigate = useNavigate();

    const { data: pendingShops, isLoading, error } = usePendingShops();

    return (
        <div className="justify-center w-full">
            <h1 className="mt-10 text-center font-bold text-3xl">Pending Shop List</h1>
            <div className="mx-3 lg:mx-10">
                <table className=" w-full table-auto text-left">
                    <thead className="text-center bg-gray-200 border-black">
                        <tr>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">STT</th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Tên cửa hàng
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Chủ cửa hàng
                            </th>
                            <th className="max-w-28 border-[2px] border-black p-2 text-xl">
                                Email
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Số điện thoại
                            </th>
                            <th className="max-w-40 border-[2px] border-black p-2 text-xl">
                                Địa chỉ cửa hàng
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Ngày gửi
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Chi tiết
                            </th>
                        </tr>
                    </thead>
                    {error && (
                        <tbody>
                            <tr>
                                <th
                                    className="border border-gray-300 px-4 py-2 text-center text-xl"
                                    colSpan={8}
                                >
                                    <p className="my-4">Đã có lỗi xảy ra khi lấy dữ liệu!</p>
                                </th>
                            </tr>
                        </tbody>
                    )}
                    {isLoading && (
                        <tbody>
                            <tr>
                                <th
                                    className="border border-gray-300 px-4 py-2 text-center text-xl"
                                    colSpan={8}
                                >
                                    <p className="my-4">Đang tải dữ liệu...</p>
                                </th>
                            </tr>
                        </tbody>
                    )}
                    {pendingShops && (
                        <tbody>
                            {pendingShops?.length === 0 ? (
                                <tr>
                                    <th
                                        className="border border-gray-300 px-4 py-2 text-center text-xl"
                                        colSpan={8}
                                    >
                                        <p className="my-4">Không có của hàng nào!</p>
                                    </th>
                                </tr>
                            ) : (
                                pendingShops?.map((shop, index) => (
                                    <tr key={shop.shopID}>
                                        <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                            {shop.shopName}
                                        </td>
                                        <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                            {shop.Owner.fullName}
                                        </td>
                                        <td className="max-w-28 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                            {shop.shopEmail}
                                        </td>
                                        <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                            {shop.shopPhone}
                                        </td>
                                        <td className="max-w-40 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                            {shop.shopPickUpAddress}
                                        </td>
                                        <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                            {shop.shopJoinedDate}
                                        </td>
                                        <td className="border-[2px] border-black p-2">
                                            <button
                                                type="button"
                                                className="text-blue-500 underline"
                                                onClick={() =>
                                                    navigate(`/main/pendingshop/${shop.shopID}`)
                                                }
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

export default PendingShopListPage;
