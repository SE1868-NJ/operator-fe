import { Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShipper } from "../hooks/useShippers";

export default function ShipperDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { data: shipper, error } = useShipper(id);

    if (!shipper) {
        return <div className="text-center text-red-500">Không tìm thấy shipper</div>;
    }

    const handleChangeStatus = (status) => {
        setIsLoading(true);
        fetch(`http://localhost:3000/shippers/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        })
            .then(() => {
                setIsLoading(false);
                navigate("/main/shipperslist");
            })
            .catch(() => setIsLoading(false));
    };

    return (
        <div className="flex items-center justify-center pt-10 ">
            <div className="container px-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="p-6 text-center bg-white rounded-lg shadow-md">
                        <img
                            className="w-40 h-40 mx-auto rounded-full"
                            src="/images/shipper1.jpg"
                            alt={shipper.name}
                        />
                        <h6 className="mt-4 text-sm text-gray-500">ID: {shipper.id}</h6>
                        <h5 className="mt-4 text-lg font-semibold">{shipper.name}</h5>
                        <h6 className="text-sm text-gray-500">{shipper.email}</h6>
                        <div className="mt-6">
                            {/* <h5 className="text-lg font-semibold">Trạng thái</h5> */}
                            <div
                                className={`inline-block px-2 py-1 rounded-md text-sm font-semibold ${
                                    shipper.status === "Đang hoạt động"
                                        ? "text-green-700 bg-green-100 border-green-500"
                                        : shipper.status === "Đang duyệt"
                                          ? "text-yellow-700 bg-yellow-100 border-yellow-500"
                                          : "text-red-700 bg-red-100 border-red-500"
                                }`}
                            >
                                {shipper.status}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                        <h5 className="mb-4 font-semibold text-blue-500">Thông tin cá nhân</h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="font-bold">Giới tính:</span> {shipper.gender}
                            </div>
                            <div>
                                <span className="font-bold">Ngày sinh:</span>{" "}
                                {shipper.dateOfBirth.split("T")[0]}
                            </div>
                            <div>
                                <span className="font-bold">Quê quán:</span> {shipper.hometown}
                            </div>
                            <div>
                                <span className="font-bold">Địa chỉ:</span> {shipper.address}
                            </div>
                            <div>
                                <span className="font-bold">SĐT:</span> {shipper.phone}
                            </div>
                            <div>
                                <span className="font-bold">CCCD:</span> {shipper.cccd}
                            </div>
                            <div>
                                <span className="font-bold">Vị trí hoạt động:</span>{" "}
                                {shipper.activityArea}
                            </div>
                            <div>
                                <span className="font-bold">Phương tiện:</span>{" "}
                                {shipper.shippingMethod}
                            </div>
                        </div>
                        <h6 className="mt-6 mb-4 font-semibold text-blue-500">Liên lạc khẩn cấp</h6>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="font-bold">Họ và tên:</span>{" "}
                                {shipper.emergencyContact?.name}
                            </div>
                            <div>
                                <span className="font-bold">Mối quan hệ:</span>{" "}
                                {shipper.emergencyContact?.relation}
                            </div>
                            <div>
                                <span className="font-bold">SĐT:</span>{" "}
                                {shipper.emergencyContact?.phone}
                            </div>
                        </div>
                        <div className="flex items-center justify-center mt-6 space-x-4">
                            <div className="text-left">
                                <Button
                                    color={shipper?.status === "Active" ? "red" : "teal"}
                                    onClick={() =>
                                        handleChangeStatus(
                                            shipper?.status === "Active" ? "Inactive" : "Active",
                                        )
                                    }
                                >
                                    {isLoading ? (
                                        <span>Đang xử lý...</span>
                                    ) : shipper?.status === "Active" ? (
                                        "Dừng hoạt động"
                                    ) : (
                                        "Kích hoạt"
                                    )}
                                </Button>
                            </div>
                            <div className="text-right">
                                <Button onClick={() => navigate("/main/shipperslist")}>
                                    Quay lại
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
