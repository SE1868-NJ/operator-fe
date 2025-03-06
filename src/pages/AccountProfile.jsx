import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountProfile = () => {
    const navigate = useNavigate();
    const [editableUser, setEditableUser] = useState({
        user_id: "12345",
        google_id: "",
        email: "admin@gmail.com",
        password: "********",
        phone: "0123456789",
        firstname: "Nguyễn",
        lastname: "Văn A",
        dob: "1990-01-01",
        gender: "Nam",
        status: "Hoạt động",
        role_id: "1",
        createdAt: "2024-01-01",
        avatar: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableUser((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý khi chọn ảnh mới
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setEditableUser((prev) => ({ ...prev, avatar: imageUrl }));
        }
    };

    const handleSave = () => {
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-center pt-10 bg-gray-100 min-h-screen">
            <div className="container px-4">
                <div className="p-6 bg-white rounded-lg shadow-lg text-center border border-gray-300">
                    {/* Avatar */}
                    <div className="relative inline-block">
                        <img
                            className="w-40 h-40 mx-auto rounded-full border border-gray-300"
                            src={editableUser.avatar}
                            alt="Ảnh đại diện"
                        />
                        {isEditing && (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="avatarInput"
                                />
                                <label
                                    htmlFor="avatarInput"
                                    className="absolute bottom-0 right-0 bg-gray-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                                >
                                    Thay ảnh
                                </label>
                            </>
                        )}
                    </div>

                    {/* Thông tin cá nhân */}
                    <h5 className="mt-4 text-lg font-semibold">
                        {editableUser.firstname} {editableUser.lastname}
                    </h5>
                    <h6 className="text-sm text-gray-500">{editableUser.email}</h6>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6 text-left">
                        <div>
                            <label htmlFor="name" className="font-medium text-amber-700">
                                Tên:
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="firstname"
                                value={editableUser.firstname}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor="ho" className="font-medium text-amber-700">
                                Họ:
                            </label>
                            <input
                                id="ho"
                                type="text"
                                name="lastname"
                                value={editableUser.lastname}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="font-medium text-amber-700">
                                Email:
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={editableUser.email}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="font-medium text-amber-700">
                                Số điện thoại:
                            </label>
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                value={editableUser.phone}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className="font-medium text-amber-700">
                                Ngày sinh:
                            </label>
                            <input
                                id="dob"
                                type="date"
                                name="dob"
                                value={editableUser.dob}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="font-medium text-amber-700">
                                Giới tính:
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={editableUser.gender}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                                disabled={!isEditing}
                            >
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="font-medium text-amber-700">
                                Trạng thái:
                            </label>
                            <input
                                id="status"
                                type="text"
                                name="status"
                                value={editableUser.status}
                                className="w-full border p-2 rounded bg-gray-100"
                                disabled
                            />
                        </div>
                        <div>
                            <label htmlFor="id" className="font-medium text-amber-700">
                                Mã vai trò:
                            </label>
                            <input
                                id="id"
                                type="text"
                                name="role_id"
                                value={editableUser.role_id}
                                className="w-full border p-2 rounded bg-gray-100"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center mt-6 space-x-4">
                        {isEditing ? (
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Lưu
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => navigate("/main")}
                            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountProfile;
