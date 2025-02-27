import { Button, Modal, Select, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShipper } from "../hooks/useShippers";

function translateStatus(status) {
    const statusMap = {
        Active: "Đang hoạt động",
        Pending: "Đang duyệt",
        Deactive: "Dừng hoạt động",
    };
    return statusMap[status] || status;
}

function translateGender(gender) {
    const genderMap = {
        Male: "Nam",
        Female: "Nữ",
        Other: "Khác",
    };
    return genderMap[gender] || gender;
}

export default function ShipperDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [deactivationReason, setDeactivationReason] = useState("");
    const [deactivationDuration, setDeactivationDuration] = useState("1 tháng");
    const [customDate, setCustomDate] = useState(null);
    const [deactivationDate, setDeactivationDate] = useState(null);
    const [opened, setOpened] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const { data: shipper, error } = useShipper(id);

    if (!shipper) {
        return <div className="text-center text-red-500">Không tìm thấy shipper</div>;
    }

    const handleChangeStatus = (status) => {
        if (status === "Dừng hoạt động") {
            setOpened(true);
        } else {
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
        }
    };

    const handleConfirmDeactivation = () => {
        setIsLoading(true);
        const requestBody = {
            status: "Dừng hoạt động",
            deactivationReason,
            deactivationDuration:
                deactivationDuration === "Tùy chỉnh" ? customDate : deactivationDuration,
        };

        fetch(`http://localhost:3000/shippers/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        })
            .then(() => {
                setIsLoading(false);
                setOpened(false);
                navigate("/main/shipperslist");
            })
            .catch(() => setIsLoading(false));
    };

    return (
        <div className="flex items-center justify-center pt-10">
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
                            <div
                                className={`inline-block px-2 py-1 rounded-md text-sm font-semibold ${
                                    shipper.status === "Đang hoạt động"
                                        ? "text-green-700 bg-green-100 border-green-500"
                                        : shipper.status === "Đang duyệt"
                                          ? "text-yellow-700 bg-yellow-100 border-yellow-500"
                                          : "text-red-700 bg-red-100 border-red-500"
                                }`}
                            >
                                {translateStatus(shipper.status)}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                        <h5 className="mb-4 font-semibold text-blue-500">Thông tin cá nhân</h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="font-bold">Giới tính:</span>{" "}
                                {translateGender(shipper.gender)}
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
                                <span className="font-bold">Vị trí hoạt động:</span>{" "}
                                {shipper.activityArea}
                            </div>
                            <div>
                                <span className="font-bold">Phương tiện:</span>{" "}
                                {shipper.shippingMethod}
                            </div>
                            <div>
                                <span className="font-bold">CCCD:</span> {shipper.cccd}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-bold">Ảnh căn cước công dân (CCCD):</h3>
                            <div className="flex gap-4 mt-2">
                                <div className="relative">
                                    {" "}
                                    {/* Added relative wrapper for positioning */}
                                    <img
                                        src={shipper.idCardFrontFile}
                                        alt="Mặt trước CCCD"
                                        className="w-32 h-20 border cursor-pointer"
                                        onClick={() => setSelectedImage(shipper.idCardFrontFile)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ")
                                                setSelectedImage(shipper.idCardFrontFile);
                                        }}
                                        aria-label="CCCD Mặt trước" // Add an accessible label
                                    />
                                    <span className="absolute px-1 text-xs text-white bg-black bg-opacity-50 rounded bottom-2 left-2">
                                        Mặt trước
                                    </span>{" "}
                                    {/* Added label */}
                                </div>
                                <div className="relative">
                                    {" "}
                                    {/* Added relative wrapper for positioning */}
                                    <img
                                        src={shipper.idCardBackFile}
                                        alt="Mặt sau CCCD"
                                        className="w-32 h-20 border cursor-pointer"
                                        onClick={() => setSelectedImage(shipper.idCardBackFile)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ")
                                                setSelectedImage(shipper.idCardBackFile);
                                        }}
                                        aria-label="CCCD Mặt sau" // Add an accessible label
                                    />
                                    <span className="absolute px-1 text-xs text-white bg-black bg-opacity-50 rounded bottom-2 left-2">
                                        Mặt sau
                                    </span>{" "}
                                    {/* Added label */}
                                </div>
                            </div>
                        </div>

                        {selectedImage && (
                            <div
                                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                                onClick={() => setSelectedImage(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") setSelectedImage(null);
                                }}
                                aria-label="Xem ảnh CCCD" // Add an accessible label
                            >
                                <img
                                    src={selectedImage}
                                    alt="Ảnh CCCD"
                                    className="max-w-full max-h-full p-4 bg-white rounded-lg shadow-lg"
                                />
                            </div>
                        )}

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
                                    color={shipper?.status === "Đang hoạt động" ? "red" : "teal"}
                                    onClick={() =>
                                        handleChangeStatus(
                                            shipper?.status === "Đang hoạt động"
                                                ? "Dừng hoạt động"
                                                : "Đang hoạt động",
                                        )
                                    }
                                >
                                    {isLoading ? (
                                        <span>Đang xử lý...</span>
                                    ) : shipper?.status === "Đang hoạt động" ? (
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
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Bạn xác nhận cho người này dừng hoạt động không?"
            >
                <Textarea
                    label="Lý do dừng hoạt động"
                    value={deactivationReason}
                    onChange={(e) => setDeactivationReason(e.target.value)}
                    placeholder="Nhập lý do..."
                    rows={4}
                />
                <div className="flex justify-center text-center">
                    <Select
                        label="Thời gian tạm dừng"
                        value={deactivationDuration}
                        onChange={setDeactivationDuration}
                        data={["1 tháng", "3 tháng", "6 tháng", "Vĩnh viễn", "Tùy chỉnh"]}
                    />
                    {deactivationDuration === "Tùy chỉnh" && (
                        <DatePicker
                            label="Chọn ngày kết thúc"
                            value={customDate}
                            onChange={setCustomDate}
                            placeholder="Chọn ngày"
                        />
                    )}
                </div>
                <div className="flex justify-end mt-4 space-x-4">
                    <Button color="red" onClick={handleConfirmDeactivation} loading={isLoading}>
                        Xác nhận
                    </Button>
                    <Button variant="outline" onClick={() => setOpened(false)}>
                        Hủy
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
