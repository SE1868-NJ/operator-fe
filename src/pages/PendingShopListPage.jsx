import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PendingShopListPage = () => {
    const navigate = useNavigate();
    const [searchOwner, setSearchOwner] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    const listShop = [
        // all status = pending
        {
            id: 1,
            name: "Shop 1",
            owner: "Nguyen Van A",
            email: "nguyenA@example.com",
            phone: "0123456789",
            address: "Toa nha so 1, tang 1, phong so 101",
            date: "01-02-2003",
            status: "pending",
        },
        {
            id: 2,
            name: "Shop 2",
            owner: "Nguyen van B",
            email: "NguyenB@example.com",
            phone: "0987654321",
            address: "Toa nha so 2, tang 2, phong so 202",
            date: "02-03-2004",
            status: "pending",
        },
        {
            id: 3,
            name: "Shop 3",
            owner: "Nguyen van C",
            email: "NguyenC@example.com",
            phone: "0987612345",
            address: "Toa nha so 3, tang 3, phong so 303",
            date: "05-03-2004",
            status: "accept",
        },
        {
            id: 4,
            name: "Shop 4",
            owner: "Nguyen van D",
            email: "NguyenD@example.com",
            phone: "0956784321",
            address: "Toa nha so 4, tang 4, phong so 404",
            date: "02-04-2003",
            status: "pending",
        },
    ];

    const [pendingshoplist, setPendingshoplist] = useState([]);
    useEffect(() => {
        setPendingshoplist(listShop.filter((shop) => shop.status === "pending"));
    }, []);

    const handleFilter = () => {
        const newList = pendingshoplist.filter((shop) => {
            const owner = searchOwner
                ? shop.owner.toLowerCase().includes(searchOwner.toLowerCase())
                : true;
            const email = searchEmail
                ? shop.email.toLowerCase().includes(searchEmail.toLowerCase())
                : true;
            const phone = searchPhone
                ? shop.phone.toLowerCase().includes(searchPhone.toLowerCase())
                : true;
            return owner && email && phone;
        });
        return newList;
    };

    return (
        <div className="justify-center w-full">
            <h1 className="mt-10 text-center font-bold text-3xl">Pending Shop List</h1>
            <div className="my-10 mx-20">
                <div className="flex mb-4 justify-between">
                    <label className="w-1/4">
                        <p>Search by Owner:</p>
                        <input
                            type="text"
                            placeholder="Search by owner"
                            className="border p-2 rounded w-full"
                            value={searchOwner}
                            onChange={(e) => setSearchOwner(e.target.value)}
                        />
                    </label>
                    <label className="w-1/4">
                        <p>Search by email:</p>
                        <input
                            type="text"
                            placeholder="Search by email"
                            className="border p-2 rounded w-full"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                    </label>
                    <label className="w-1/4">
                        <p>Search by phone:</p>
                        <input
                            type="text"
                            placeholder="Search by phone"
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
                                Shop Name
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Owner
                            </th>
                            <th className="max-w-28 border-[2px] border-black p-2 text-xl">
                                Email
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Phone
                            </th>
                            <th className="max-w-40 border-[2px] border-black p-2 text-xl">
                                Address
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">Date</th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {handleFilter().map((shop, index) => (
                            <tr key={shop.id}>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2 text-center">
                                    {index + 1}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.name}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.owner}
                                </td>
                                <td className="max-w-28 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.email}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.phone}
                                </td>
                                <td className="max-w-40 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.address}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.date}
                                </td>
                                <td className="border-[2px] border-black p-2">
                                    {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Accept
                  </button> */}
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => navigate(`/pendingshoplist/${shop.id}`)}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingShopListPage;
