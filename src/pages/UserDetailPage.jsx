import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserById } from "../hooks/useUser";
import UserService from "../services/UserService";

const statusStyles = {
    "Hoạt động": "bg-green-100 text-green-700 border-green-500",
    "Không hoạt động": "bg-red-100 text-red-700 border-red-500",
    "Đình chỉ": "bg-yellow-100 text-yellow-700 border-yellow-500",
};

const UserDetail = () => {
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
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">User Detail</h2>
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={user.avatar || "https://via.placeholder.com/100"}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full border cursor-pointer"
                    onClick={() => setSelectedImage(user.avatar)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedImage(user.avatar);
                    }}
                />
                <div>
                    <h3 className="text-xl font-bold">{user.fullName}</h3>
                    <p className="text-gray-500">{user.userEmail}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <strong>User ID:</strong> {user.userID}
                </div>
                <div>
                    <strong>Phone:</strong> {user.userPhone}
                </div>
                <div>
                    <strong>Date of Birth:</strong> {user.dateOfBirth}
                </div>
                <div>
                    <strong>Gender:</strong> {user.gender}
                </div>
                <div>
                    <strong>Address:</strong> {user.userAddress}
                </div>
                <div>
                    <strong>Citizen ID:</strong> {user.userCitizenID}
                </div>
                <div>
                    <strong>Identification Number:</strong> {user.identificationNumber}
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium" htmlFor="status">
                    Status
                </label>
                <div
                    id="status"
                    className={`mt-2 inline-block px-4 py-1 text-sm font-semibold border rounded-full ${
                        statusStyles[user?.status] || "bg-gray-100 text-gray-700 border-gray-500"
                    }`}
                >
                    {user?.status}
                </div>
                <select
                    className="mt-2 p-2 border rounded w-full"
                    value={user?.status}
                    onChange={(e) => {
                        handleStatusChange(e);
                    }}
                >
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                    <option value="Đình chỉ">Đình chỉ</option>
                </select>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Identification Documents</h3>
                <div className="flex gap-4 mt-2">
                    <img
                        src={user.idCardFrontFile}
                        alt="ID Front"
                        className="w-32 h-20 border cursor-pointer"
                        onClick={() => setSelectedImage(user.idCardFrontFile)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                                setSelectedImage(user.idCardFrontFile);
                        }}
                    />
                    <img
                        src={user.idCardBackFile}
                        alt="ID Back"
                        className="w-32 h-20 border cursor-pointer"
                        onClick={() => setSelectedImage(user.idCardBackFile)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                                setSelectedImage(user.idCardBackFile);
                        }}
                    />
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={() => setSelectedImage(null)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedImage(null);
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Enlarged"
                        className="max-w-full max-h-full p-4 bg-white shadow-lg rounded-lg"
                    />
                </div>
            )}
        </div>
    );
};

export default UserDetail;
