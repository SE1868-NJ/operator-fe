import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePendingShops } from "../hooks/useShop";
import ErrorPage from "./ErrorPage.jsx";

const PendingShopListPage = () => {
    const navigate = useNavigate();
    const [searchOwner, setSearchOwner] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    const { data: pendingShops, isLoading, err } = usePendingShops();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (err) {
        return <ErrorPage />;
    }

    const filterPendingShops = pendingShops.data?.filter((shop) => {
        const owner = searchOwner
            ? shop.Owner.fullName.toLowerCase().includes(searchOwner.toLowerCase())
            : true;
        const email = searchEmail
            ? shop.shopEmail.toLowerCase().includes(searchEmail.toLowerCase())
            : true;
        const phone = searchPhone
            ? shop.shopPhone.toLowerCase().includes(searchPhone.toLowerCase())
            : true;
        return owner && email && phone;
    });

    return (
        <div className="justify-center w-full">
            <h1 className="mt-10 text-center font-bold text-3xl">Pending Shop List</h1>
            <div className="my-10 mx-20">
                <div className="flex mb-4 justify-between">
                    <label className="w-1/4">
                        <p className="font-bold">Tìm kiếm bằng tên chủ cửa hàng:</p>
                        <input
                            type="text"
                            placeholder="Tên chủ cửa hàng"
                            className="border p-2 rounded w-full"
                            value={searchOwner}
                            onChange={(e) => setSearchOwner(e.target.value)}
                        />
                    </label>
                    <label className="w-1/4">
                        <p className="font-bold">Tìm kiếm bằng email:</p>
                        <input
                            type="text"
                            placeholder="Email của chủ cửa hàng"
                            className="border p-2 rounded w-full"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                    </label>
                    <label className="w-1/4">
                        <p className="font-bold">Tìm kiếm bằng số điện thoại:</p>
                        <input
                            type="text"
                            placeholder="0987654321"
                            className="border p-2 rounded w-full"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                        />
                    </label>
                </div>
            </div>
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
                    <tbody>
                        {filterPendingShops?.length === 0 ? (
                            <tr>
                                <th
                                    className="border border-gray-300 px-4 py-2 text-center text-xl"
                                    colSpan={8}
                                >
                                    <p className="my-4">Không có của hàng nào!</p>
                                </th>
                            </tr>
                        ) : (
                            filterPendingShops?.map((shop, index) => (
                                <tr key={shop.id}>
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
                </table>
            </div>
        </div>
    );
};

export default PendingShopListPage;
