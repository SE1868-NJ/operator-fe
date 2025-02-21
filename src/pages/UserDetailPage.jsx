import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserById } from "../hooks/useUser";
import UserService from "../services/UserService";

const statusStyles = {
    "Hoạt động": "bg-green-100 text-green-700 border-green-500",
    "Không hoạt động": "bg-red-100 text-red-700 border-red-500",
    "Đình chỉ": "bg-yellow-100 text-yellow-700 border-yellow-500",
};

const UserDetail = () => {
    const Navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch user data
    const { data: user, isLoading, error } = useUserById(id);
    //   console.log(user)

    // Update user status mutation
    const mutation = useMutation((newStatus) => UserService.updateUserStatus(id, newStatus), {
        onSuccess: () => {
            queryClient.invalidateQueries(["user", id]);
        },
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data</p>;

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        if (window.confirm("Bạn có chắc chắn muốn thay đổi trạng thái này?")) {
            mutation.mutate(newStatus);
        }
    };

    return (
        <div className="flex items-center justify-center pt-10 ">
            <div className="container px-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="p-6 text-center bg-white rounded-lg shadow-md">
                        <img
                            className="w-40 h-40 mx-auto rounded-full"
                            src={user.avatar}
                            alt={`${user.fullName}'s avatar`}
                        />
                        <h5 className="mt-4 text-lg font-semibold">{user.fullName}</h5>
                        <h6 className="text-sm text-gray-500">{user.userEmail}</h6>
                        <div className="mt-6">
                            {/* <h5 className="text-lg font-semibold">Trạng thái</h5> */}
                            <div
                                className={`inline-block mt-2 px-4 py-1 text-sm font-semibold rounded-full ${
                                    user.status === "Hoạt động"
                                        ? "bg-green-100 text-green-700 border-green-500"
                                        : user.status === "Không hoạt động"
                                          ? "bg-red-100 text-red-700 border-red-500"
                                          : "bg-yellow-100 text-yellow-700 border-yellow-500"
                                }`}
                            >
                                {user.status}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                        <h5 className="mb-4 font-semibold text-blue-500">Thông tin cá nhân</h5>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="font-medium text-amber-700">Mã khách hàng:</span>{" "}
                                {user.userID}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Tên khách hàng:</span>{" "}
                                {user.fullName}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Email:</span>{" "}
                                {user.userEmail}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Giới tính:</span>{" "}
                                {user.gender}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Ngày sinh:</span>{" "}
                                {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Quê quán:</span>{" "}
                                {user.userAddress}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">SĐT:</span>{" "}
                                {user.userPhone}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">Mã thẻ chung cư:</span>{" "}
                                {user.userCitizenID}
                            </div>
                            <div>
                                <span className="font-medium text-amber-700">CCCD:</span>{" "}
                                {user.identificationNumber}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Căn cước công dân (CCCD):</h3>
                            <div className="flex gap-4 mt-2">
                                <div className="relative">
                                    {" "}
                                    {/* Added relative wrapper for positioning */}
                                    <img
                                        src={user.idCardFrontFile}
                                        alt="Mặt trước CCCD"
                                        className="w-32 h-20 border cursor-pointer"
                                        onClick={() => setSelectedImage(user.idCardFrontFile)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ")
                                                setSelectedImage(user.idCardFrontFile);
                                        }}
                                        aria-label="CCCD Mặt trước" // Add an accessible label
                                    />
                                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                        Mặt trước
                                    </span>{" "}
                                    {/* Added label */}
                                </div>
                                <div className="relative">
                                    {" "}
                                    {/* Added relative wrapper for positioning */}
                                    <img
                                        src={user.idCardBackFile}
                                        alt="Mặt sau CCCD"
                                        className="w-32 h-20 border cursor-pointer"
                                        onClick={() => setSelectedImage(user.idCardBackFile)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ")
                                                setSelectedImage(user.idCardBackFile);
                                        }}
                                        aria-label="CCCD Mặt sau" // Add an accessible label
                                    />
                                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                                        Mặt sau
                                    </span>{" "}
                                    {/* Added label */}
                                </div>
                            </div>
                        </div>

                        {selectedImage && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                                onClick={() => setSelectedImage(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") setSelectedImage(null);
                                }}
                                aria-label="Xem ảnh CCCD" // Add an accessible label
                            >
                                <img
                                    src={selectedImage}
                                    alt="Ảnh CCCD"
                                    className="max-w-full max-h-full p-4 bg-white shadow-lg rounded-lg"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-center mt-6 space-x-4">
                            <button
                                type="button"
                                onClick={handleStatusChange}
                                className={`${
                                    user.status === "Hoạt động"
                                        ? "bg-yellow-500 hover:bg-yellow-700 text-white"
                                        : user.status === "Đình chỉ"
                                          ? "bg-green-500 hover:bg-green-700 text-white"
                                          : "bg-blue-500 hover:bg-blue-700 text-white" // Nếu là "Không hoạt động"
                                } px-4 py-2 rounded`}
                            >
                                {
                                    user.status === "Hoạt động"
                                        ? "Đình chỉ người dùng"
                                        : user.status === "Đình chỉ"
                                          ? "Gỡ đình chỉ người dùng"
                                          : "Kích hoạt người dùng" // Nếu là "Không hoạt động"
                                }
                            </button>
                            <button
                                type="button"
                                onClick={() => Navigate("/main/users")}
                                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
