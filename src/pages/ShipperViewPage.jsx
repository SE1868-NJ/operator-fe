import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ShipperViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shipper, setShipper] = useState({
        id: "4",
        fullName: "Phạm Thị Dung",
        email: "phamthidung@gmail.com",
        phoneNumber: "0901234567",
        photoUrl: "/images/shipper4.jpg",
        gender: "Nữ",
        dateOfBirth: "04/04/2008",
        hometown: "Hà Nội",
        temporaryAddress: "Hà Nội",
        cccd: "024789123456",
        activityInformation: "Giao hàng chung cư The Link Ciputra",
        shippingMethod: "Xe máy",
        emergencyContact: {
            name: "Phạm Thị Vân",
            relationship: "Mẹ",
            phoneNumber: "0969876543",
        },
    });

    return (
        //    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
        //     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
                {/* Profile Section */}
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="text-center mt-4">
                        <img
                            src={shipper.photoUrl}
                            alt={shipper.fullName}
                            className="w-32 h-32 rounded-full mx-auto mb-3"
                        />
                        <h6 className="text-gray-500 text-sm mt-2">ID: {shipper.id}</h6>
                        <h5 className="mt-3 font-bold">{shipper.fullName}</h5>
                        <h6 className="text-gray-500 text-sm">{shipper.email}</h6>
                    </div>
                    <div className="mt-5 text-center">
                        <h5 className="text-blue-500 font-bold">Thông tin hoạt động</h5>
                        <p className="text-sm">{shipper.activityInformation}</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="md:col-span-3 bg-white p-5 rounded-lg shadow-md">
                    <h6 className="text-blue-500 font-bold mb-4">Thông tin cá nhân</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Giới tính:</strong> {shipper.gender}
                        </div>
                        <div>
                            <strong>Ngày sinh:</strong> {shipper.dateOfBirth}
                        </div>
                        <div>
                            <strong>Quê quán:</strong> {shipper.hometown}
                        </div>
                        <div>
                            <strong>Địa chỉ:</strong> {shipper.temporaryAddress}
                        </div>
                        <div>
                            <strong>CCCD:</strong> {shipper.cccd}
                        </div>
                        <div>
                            <strong>Số điện thoại:</strong> {shipper.phoneNumber}
                        </div>
                    </div>

                    <h6 className="text-blue-500 font-bold mt-6 mb-4">Thông tin giao hàng</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Phương thức vận chuyển:</strong> {shipper.shippingMethod}
                        </div>
                    </div>

                    <h6 className="text-blue-500 font-bold mt-6 mb-4">Liên hệ khẩn cấp</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Họ và tên:</strong> {shipper.emergencyContact.name}
                        </div>
                        <div>
                            <strong>Mối quan hệ:</strong> {shipper.emergencyContact.relationship}
                        </div>
                        <div>
                            <strong>Số điện thoại:</strong> {shipper.emergencyContact.phoneNumber}
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                            onClick={() => alert("Đăng ký chấp nhận.")}
                        >
                            Chấp nhận
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                            onClick={() => alert("Đăng ký bị từ chối.")}
                        >
                            Từ chối
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipperViewPage;
