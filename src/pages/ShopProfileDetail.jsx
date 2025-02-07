import { id } from "date-fns/locale";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import { useShop } from "../hooks/useShop";

const productsData = [
    {
        id: 1,
        name: "Burger Full Toping",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/1200px-Burger_King_2020.svg.png",
        category: "Fast Food",
        description: "Delicious burger with full toping",
        createdAt: "2023-01-01",
        price: "$10",
        status: "Active",
    },
    {
        id: 2,
        name: "Pizza",
        image: "https://image.kkday.com/v2/image/get/w_960%2Cc_fit%2Cq_55%2Ct_webp/s1.kkday.com/product_139606/20231027115630_EmNWF/png",
        category: "Fast Food",
        description: "Delicious pizza with full toping",
        createdAt: "2023-02-01",
        price: "$20",
        status: "Active",
    },

    {
        id: 3,
        name: "Banh Mi",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAg5nrWcTsX4F_pUiu73dnQVzufJ5zE9PLCg&s",
        category: "Fast Food",
        description: "Delicious banh mi with full toping",
        createdAt: "2023-03-01",
        price: "$5",
        status: "Deactive",
    },
];
const ShopProfileDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: shop, isLoading, error } = useShop(id);
    console.log(shop);

    const [status, setStatus] = useState(shop ? shop.status : "");

    if (shop) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Shop not found</p>
            </div>
        );
    }

    const toggleStatus = () => {
        setStatus((prevStatus) => (prevStatus === "Active" ? "Deactive" : "Active"));
    };

    return (
        <div className="flex w-full bg-gray-100 min-h-screen">
            {/* <Sidebar /> */}
            <div className="w-full mx-auto p-8 bg-white mt-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">{shop.name}</h1>
                <div className="flex gap-12 mb-8">
                    <div className="flex gap-6 items-center">
                        <img
                            src={shop.avatar}
                            alt={shop.name}
                            className="w-40 h-40 rounded-full shadow-md"
                        />
                        <div>
                            <p className="text-xl font-semibold">Shop Description</p>
                            <p className="text-gray-800 mt-2">{shop.description}</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-blue-100 p-6 rounded-lg shadow-md w-1/2 text-center">
                            <h2 className="text-xl font-bold">Total Orders</h2>
                            <p className="text-2xl">8,282</p>
                        </div>
                        <div className="bg-green-100 p-6 rounded-lg shadow-md w-1/2 text-center">
                            <h2 className="text-xl font-bold">Total Revenue</h2>
                            <p className="text-2xl">$200,521</p>
                        </div>
                    </div>
                </div>
                <table className="table-auto w-full mb-8">
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 font-semibold text-lg">Shop Information</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Owner</td>
                            <td className="border px-4 py-2">{shop.owner}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Email</td>
                            <td className="border px-4 py-2">{shop.email}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Phone</td>
                            <td className="border px-4 py-2">{shop.mobile}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Pick Up Address</td>
                            <td className="border px-4 py-2">{shop.pickUpAddress}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Shop Address</td>
                            <td className="border px-4 py-2">{shop.address}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Joined Date</td>
                            <td className="border px-4 py-2">{shop.createdAt}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Status</td>
                            <td className="border px-4 py-2">
                                <span
                                    className={
                                        status === "Active"
                                            ? "text-green-700 bg-green-100 p-1 rounded"
                                            : "text-red-700 bg-red-100 p-1 rounded"
                                    }
                                >
                                    {status}
                                </span>
                                <button
                                    type="button"
                                    onClick={toggleStatus}
                                    className="mb-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Change Status
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-semibold text-lg">Tax Information</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Business Type</td>
                            <td className="border px-4 py-2">Individual/Household/Company</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Tax Code</td>
                            <td className="border px-4 py-2">73889332</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">
                                Identification Info (CCCD)
                            </td>
                            <td className="border px-4 py-2">075204000024</td>
                        </tr>
                    </tbody>
                </table>
                <button
                    type="button"
                    className="mb-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-300"
                    onClick={() => navigate("/main/shops")}
                >
                    Back to List
                </button>
                <div className="w-full max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-4xl font-bold mb-8 text-gray-800">List of Products</h1>
                    <table className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Product Name</th>
                                <th className="border px-4 py-2">Image</th>
                                <th className="border px-4 py-2">Category</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Created At</th>
                                <th className="border px-4 py-2">Price</th>
                                <th className="border px-4 py-2">Rating</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData.map((product) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2">{product.name}</td>
                                    <td className="border px-4 py-2">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="border px-4 py-2">{product.category}</td>
                                    <td className="border px-4 py-2">{product.description}</td>
                                    <td className="border px-4 py-2">{product.createdAt}</td>
                                    <td className="border px-4 py-2">{product.price}</td>
                                    <td className="border px-4 py-2">4.5</td>
                                    <td className="border px-4 py-2">
                                        <span
                                            className={
                                                product.status === "Active"
                                                    ? "text-green-700 bg-green-100 p-1 rounded"
                                                    : "text-red-700 bg-red-100 p-1 rounded"
                                            }
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            type="button"
                                            className="text-blue-500 underline hover:text-blue-700 transition duration-300"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            className="text-red-500 underline ml-4 hover:text-red-700 transition duration-300"
                                            onClick={() => alert("Delete product")}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShopProfileDetail;
