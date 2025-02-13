// import React, {useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    // const { mutate: updateShopStatus } = useUpdateShopStatus();
    // const [status, setStatus] = useState(""); // Khởi tạo state 'status'

    // useEffect(() => {
    //     if (shop) {
    //         setStatus(shop.shopStatus);
    //     }
    // }, [shop]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error || !shop) {
        return <div className="flex justify-center items-center h-screen">Shop not found</div>;
    }

    // const toggleStatus = () => {
    //     const newStatus = status === "active" ? "suspended" : "active";
    //     setStatus(newStatus); // Cập nhật state 'status' mới
    //     updateShopStatus({ id, status: newStatus });
    // };

    return (
        <div className="flex w-full bg-gray-100 min-h-screen">
            <div className="w-full mx-auto p-8 bg-white mt-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-800">{shop.shopName}</h1>
                <div className="flex gap-12 mb-8">
                    <div className="flex gap-6 items-center">
                        <img
                            src={
                                "https://img.lovepik.com/free-png/20210918/lovepik-e-shop-png-image_400245565_wh1200.png"
                            }
                            alt={shop.shopName}
                            className="w-40 h-40 rounded-full shadow-md"
                        />
                        <div>
                            <p className="text-xl font-semibold">Shop Description</p>
                            <p className="text-gray-800 mt-2">{shop.shopDescription}</p>
                            <p className="text-xl font-semibold">Shop Rating</p>
                            <p className="text-gray-800 mt-2">{shop.shopRating}</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-yellow-100 p-6 rounded-lg shadow-md w-1/2 text-center">
                            <h2 className="text-xl font-bold">Total Orders</h2>
                            <p className="text-2xl">8,282</p>
                        </div>
                        <div className="bg-orange-100 p-6 rounded-lg shadow-md w-1/2 text-center">
                            <h2 className="text-xl font-bold">Total Revenue</h2>
                            <p className="text-2xl">$200,521</p>
                        </div>
                    </div>
                </div>
                <table className="table-auto w-full mb-8">
                    <tbody>
                        {/* Ownder in4 */}
                        <tr>
                            <td className="px-4 py-2 font-semibold text-lg">Owner Information</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Fullname</td>
                            <td className="border px-4 py-2">{shop.Owner.fullName}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Date of birth</td>
                            <td className="border px-4 py-2">{shop.Owner.dateOfBirth}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Gender</td>
                            <td className="border px-4 py-2">{shop.Owner.gender}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Email</td>
                            <td className="border px-4 py-2">{shop.Owner.userEmail}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Phone</td>
                            <td className="border px-4 py-2">{shop.Owner.userPhone}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">CitizenID</td>
                            <td className="border px-4 py-2">{shop.Owner.userCitizenID}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">
                                Identification Number
                            </td>
                            <td className="border px-4 py-2">{shop.Owner.identificationNumber}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">idCardFrontFile</td>
                            <td className="border px-4 py-2">
                                <img
                                    src={shop.Owner.idCardFrontFile}
                                    alt="idCardFrontFile"
                                    className="w-60 h-40 shadow-md"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">idCardBackFile</td>

                            <td className="border px-4 py-2">
                                <img
                                    src={shop.Owner.idCardBackFile}
                                    alt="idCardBackFile"
                                    className="w-60 h-40 shadow-md"
                                />
                            </td>
                        </tr>
                        {/* Shop In4 */}
                        <tr>
                            <td className="px-4 py-2 font-semibold text-lg">Shop Information</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Operation Hours</td>
                            <td className="border px-4 py-2">{shop.shopOperationHours}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Email</td>
                            <td className="border px-4 py-2">{shop.shopEmail}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Phone</td>
                            <td className="border px-4 py-2">{shop.shopPhone}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Pick Up Address</td>
                            <td className="border px-4 py-2">{shop.shopPickUpAddress}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Business Type</td>
                            <td className="border px-4 py-2">{shop.businessType}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Bank Account Number</td>
                            <td className="border px-4 py-2">{shop.shopBankAccountNumber}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Bank Name</td>
                            <td className="border px-4 py-2">{shop.shopBankName}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Tax Code</td>
                            <td className="border px-4 py-2">{shop.taxCode}</td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Joined Date</td>
                            <td className="border px-4 py-2">
                                {new Date(shop.shopJoinedDate).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="border px-4 py-2 font-semibold">Status</td>
                            <td className="border px-4 py-2">
                                <span
                                    className={
                                        shop.shopStatus === "active"
                                            ? "text-green-700 bg-green-100 p-1 rounded"
                                            : "text-red-700 bg-red-100 p-1 rounded"
                                    }
                                >
                                    {shop.shopStatus}
                                </span>
                                {/* <button
                                    type="button"
                                    onClick={toggleStatus}
                                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Change Status
                                </button> */}
                            </td>
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
                {/* <div className="w-full mx-auto p-8 bg-white mt-8"></div> */}
                <div className="w-full mx-auto p-8 bg-white mt-8">
                    <h1 className="text-4xl font-bold mb-8 text-gray-800">List of Products</h1>
                    <table className="table-auto w-full mb-8">
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
