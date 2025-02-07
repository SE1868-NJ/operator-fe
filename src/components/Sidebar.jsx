import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white">
            <div className="p-4 text-xl font-bold border-b border-gray-700">
                Operator Management
            </div>
            <div className="p-4">
                <div className="mb-2">
                    <Link
                        to="/shopmanagement"
                        className="block py-2 px-4 hover:bg-gray-700 rounded"
                    >
                        Shop Management
                    </Link>
                    <div className="ml-4">
                        <Link
                            to="/shopmanagement"
                            className="block py-2 px-4 hover:bg-gray-700 rounded"
                        >
                            All Shop
                        </Link>
                        <Link
                            to="/shop-management/shop-detail"
                            className="block py-2 px-4 hover:bg-gray-700 rounded"
                        >
                            Shop Detail
                        </Link>
                    </div>
                </div>
                <div className="mb-2">
                    <Link
                        to="/shipper-management"
                        className="block py-2 px-4 hover:bg-gray-700 rounded"
                    >
                        Shipper Management
                    </Link>
                </div>
                <div className="mb-2">
                    <Link
                        to="/customer-management"
                        className="block py-2 px-4 hover:bg-gray-700 rounded"
                    >
                        Customer Management
                    </Link>
                </div>
            </div>
        </div>
    );
}
