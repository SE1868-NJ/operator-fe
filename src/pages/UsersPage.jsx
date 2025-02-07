import { useState } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  // Danh sách user mẫu
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyen Van A", email: "a@example.com", phone: "0123456789", status: true, avatar: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg" },
    { id: 2, name: "Tran Thi B", email: "b@example.com", phone: "0987654321", status: false, avatar: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg" },
    { id: 3, name: "Le Van C", email: "c@example.com", phone: "0345678912", status: true, avatar: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg" },
  ]);

  // Hàm toggle trạng thái
  const toggleStatus = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: !user.status } : user));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Danh sách người dùng</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Ảnh đại diện</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Số điện thoại</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center border-b">
              <td className="p-2 border">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mx-auto" />
              </td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.phone}</td>
              <td className="p-2 border">
                <button
                  onClick={() => toggleStatus(user.id)}
                  className={`px-4 py-1 rounded-full text-white text-sm transition-all ${
                    user.status ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {user.status ? "Hoạt động" : "Bị vô hiệu hóa"}
                </button>
              </td>
              <td className="p-2 border">
                <Link to={`/user/${user.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Xem chi tiết</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
