import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const UserDetailPage = () => {
  const { id: paramId } = useParams();  // Lấy id từ URL (hoặc tham số)
  const [user, setUser] = useState(null);
  const id = paramId || 1;  // Nếu không có id, mặc định sẽ là 1

  useEffect(() => {
    // Dữ liệu mẫu, có thể thay bằng API thực tế
    const userData = [
      { id: 1, name: "Nguyen Van A", email: "a@example.com", phone: "0123456789", status: true, avatar: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg", gender: "Nam", createdAt: "2024-01-01" },
      
    ];

    const foundUser = userData.find(user => user.id === parseInt(id));  // Tìm user theo id
    setUser(foundUser);
  }, [id]);

  if (!user) {
    return <div className="text-center mt-10 text-red-500">User không tồn tại!</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Chi tiết người dùng</h2>
      <div className="flex flex-col items-center">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
        <p className="text-lg font-semibold">ID: {user.id}</p>
        <p className="text-lg font-semibold">Tên: {user.name}</p>
        <p className="text-gray-600">Email: {user.email}</p>
        <p className="text-gray-600">Số điện thoại: {user.phone}</p>
        <p className="text-gray-600">Giới tính: {user.gender}</p>
        <p className="text-gray-600">Ngày tạo: {user.createdAt}</p>
        <p className="mt-4">
          Trạng thái: 
          <span className={`ml-2 px-3 py-1 rounded-full text-white ${user.status ? "bg-green-500" : "bg-red-500"}`}>
            {user.status ? "Hoạt động" : "Bị vô hiệu hóa"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserDetailPage;
