import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { usePendingShipper } from "../hooks/useShippers";
import ShipperServices from "../services/ShipperServices";

const ShipperViewPage = () => {
    const { id } = useParams();
    const { data: responeData, isLoading } = usePendingShipper(id);
    const shipper = responeData?.data || {};
    console.log("Lấy ra shipper: ", shipper);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const shipper = ShipperServices.updatePendingShipper(data);
            if (shipper) {
                notifications.show({
                    color: "green",
                    title: "Cập nhật thành công!",
                    message: `Shipper đã được ${
                        data.status === "accepted" ? "chấp nhận" : "từ chối"
                    }.`,
                });
            } else {
                notifications.show({
                    color: "red",
                    title: "Lỗi câp nhật!",
                    message: "Vui lòng thử lại!",
                });
            }
            navigate("/main/pendding-shippers");
        } catch (err) {
            console.error(err);
            notifications.show({
                color: "red",
                title: "Lỗi đã xảy ra khi cập nhật!",
                message: "Vui lòng thử lại!",
            });
        }
        navigate("/main/pendding-shippers");
    };

    const handleDecision = (status) => {
        const description = watch("description");
        handleSubmit(() => onSubmit({ id: id, status, description }));
    };

    return (
        <div className="flex items-center justify-center pt-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
                {/* Profile Section */}
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="text-center mt-4 container">
                        <img
                            src={
                                shipper.avatar ||
                                "https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/anh-avatar-trang-nam-12.jpg"
                            }
                            alt={shipper.name}
                            className="w-32 h-32 rounded-full mx-auto mb-3 border-4 hover:border-8 transition-transform duration-600 hover:scale-150  border-pink-200"
                        />
                        <h6 className="text-gray-500 text-sm mt-2">ID: {shipper.id}</h6>
                        <h5 className="mt-3 font-bold">{shipper.name}</h5>
                        <h6 className="text-gray-500 text-sm">{shipper.email}</h6>
                    </div>
                    <div className="mt-5 text-center">
                        <h5 className="text-blue-500 font-bold">Thông tin hoạt động</h5>
                        <p className="text-sm">{shipper.activityArea}</p>
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
                            <strong>Quê quán:</strong> {shipper.address}
                        </div>
                        <div>
                            <strong>Địa chỉ:</strong> {shipper.address}
                        </div>
                        <div>
                            <strong>CCCD:</strong> {shipper.cccd}
                        </div>
                        <div>
                            <strong>Số điện thoại:</strong> {shipper.phone}
                        </div>
                    </div>

                    <h6 className="text-blue-500 font-bold mt-6 mb-4">Thông tin giao hàng</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <strong>Phương thức vận chuyển:</strong> {shipper.shippingMethod}
                        </div>
                    </div>

                    <h6 className="text-blue-500 font-bold mt-6 mb-4">Liên hệ khẩn cấp</h6>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Họ và tên:</strong> {shipper.emergencyContact.name}
            </div>
            <div>
              <strong>Mối quan hệ:</strong>{" "}
              {shipper.emergencyContact.relationship}
            </div>
            <div>
              <strong>Số điện thoại:</strong>{" "}
              {shipper.emergencyContact.phoneNumber}
            </div>
          </div> */}

                    <div className="mt-5 text-center">
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                            onClick={handleDecision("accepted")}
                        >
                            Chấp nhận
                        </button>
                        <Modal opened={opened} onClose={close} withCloseButton={false} centered>
                            <form>
                                <label className="block mb-4">
                                    <p className="flex text-xl font-semibold mb-2">
                                        Nhập lý do từ chối <p className="text-red-500 ml-2">*</p>
                                    </p>
                                    <textarea
                                        {...register("description", {
                                            required: "Hãy nhập lý do của bạn",
                                        })}
                                        name="description"
                                        className="w-full p-2 border border-4 rounded-md focus:outline-none focus:border-pink-300"
                                        placeholder="Nhập lý do..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </label>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        color="gray"
                                        onClick={close}
                                    >
                                        Trở lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="red"
                                        onClick={handleDecision("rejected")}
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                            </form>
                        </Modal>
                        <button
                            type="button"
                            variant="default"
                            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                            onClick={open}
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
