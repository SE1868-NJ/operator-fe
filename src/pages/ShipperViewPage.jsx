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
            <div className="grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-4">
                {/* Profile Section */}
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <div className="container mt-4 text-center">
                        <img
                            src={
                                shipper.avatar ||
                                "https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/anh-avatar-trang-nam-12.jpg"
                            }
                            alt={shipper.name}
                            className="w-32 h-32 mx-auto mb-3 transition-transform border-4 border-pink-200 rounded-full hover:border-8 duration-600 hover:scale-150"
                        />
                        <h6 className="mt-2 text-sm text-gray-500">ID: {shipper.id}</h6>
                        <h5 className="mt-3 font-bold">{shipper.name}</h5>
                        <h6 className="text-sm text-gray-500">{shipper.email}</h6>
                    </div>
                    <div className="mt-5 text-center">
                        <h5 className="font-bold text-blue-500">Thông tin hoạt động</h5>
                        <p className="text-sm">{shipper.activityArea}</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-5 bg-white rounded-lg shadow-md md:col-span-3">
                    <h6 className="mb-4 font-bold text-blue-500">Thông tin cá nhân</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Thông tin giao hàng</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Phương thức vận chuyển:</strong> {shipper.shippingMethod}
                        </div>
                    </div>

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Liên hệ khẩn cấp</h6>
                    {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                            className="px-4 py-2 mr-2 text-white bg-green-500 rounded"
                            onClick={handleDecision("accepted")}
                        >
                            Chấp nhận
                        </button>
                        <Modal opened={opened} onClose={close} withCloseButton={false} centered>
                            <form>
                                <label className="block mb-4">
                                    <p className="flex mb-2 text-xl font-semibold">
                                        Nhập lý do từ chối <p className="ml-2 text-red-500">*</p>
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
                                        <p className="mt-1 text-sm text-red-500">
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
                            className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
                            onClick={open}
                        >
                            Từ chối
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 text-white bg-blue-500 rounded"
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
