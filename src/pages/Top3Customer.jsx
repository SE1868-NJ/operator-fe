import { FaMedal } from "react-icons/fa";
import { useGetTop3Customer } from "../hooks/useUser.js";

const Top3Customer = () => {
    // Dữ liệu tĩnh về top 3 khách hàng

    const { data, isLoading, error } = useGetTop3Customer();
    if (data) console.log(data);

    const topCustomers = data
        ? data.map((item, index) => ({
              name: item.Customer.fullName,
              email: item.Customer.userEmail,
              phone: item.Customer.userPhone,
              orders: item.totalOrders,
              rank: index === 0 ? "gold" : index === 1 ? "silver" : "bronze",
          }))
        : [];

    // Màu sắc theo thứ hạng
    const rankColors = {
        gold: "bg-yellow-300 text-yellow-900",
        silver: "bg-gray-300 text-gray-900",
        bronze: "bg-orange-300 text-orange-900",
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md mb-10">
            {/* Bảng hiển thị danh sách top 3 khách hàng */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Hạng</th>
                        <th className="border p-2">Tên</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Số điện thoại</th>
                        <th className="border p-2">Số lượng Order</th>
                    </tr>
                </thead>
                <tbody>
                    {topCustomers.map((customer, index) => (
                        <tr key={index} className={`${rankColors[customer.rank]} border`}>
                            <td className="border p-2 text-center">
                                {customer.rank === "gold" && (
                                    <FaMedal className="text-yellow-500 text-xl" />
                                )}
                                {customer.rank === "silver" && (
                                    <FaMedal className="text-gray-500 text-xl" />
                                )}
                                {customer.rank === "bronze" && (
                                    <FaMedal className="text-orange-500 text-xl" />
                                )}
                            </td>
                            <td className="border p-2">{customer.name}</td>
                            <td className="border p-2">{customer.email}</td>
                            <td className="border p-2">{customer.phone}</td>
                            <td className="border p-2 text-center">{customer.orders} đơn</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Top3Customer;
