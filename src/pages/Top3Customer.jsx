import { Title } from "@mantine/core";
import { FaMedal } from "react-icons/fa";
import { useGetTop3Customer } from "../hooks/useUser.js";

const Top3Customer = () => {
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

    const rankColors = {
        gold: "bg-yellow-300 text-yellow-900",
        silver: "bg-gray-300 text-gray-900",
        bronze: "bg-orange-300 text-orange-900",
    };

    return (
        <div className="w-3/4 p-6 mx-auto mb-10 bg-white rounded-lg shadow-md">
            <Title order={3} align="center" mb="md" className="text-xl font-bold text-gray-700">
                Top 3 khách hàng thân thiết nhất
            </Title>
            <div className="overflow-x-auto">
                <table className="w-full text-center border border-collapse border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border">Hạng</th>
                            <th className="p-3 border">Tên</th>
                            <th className="p-3 border">Email</th>
                            <th className="p-3 border">Số điện thoại</th>
                            <th className="p-3 border">Số lượng Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topCustomers.map((customer, index) => (
                            <tr key={index} className={`${rankColors[customer.rank]} border`}>
                                <td className="p-3 border">
                                    {customer.rank === "gold" && (
                                        <FaMedal className="text-2xl text-yellow-500" />
                                    )}
                                    {customer.rank === "silver" && (
                                        <FaMedal className="text-2xl text-gray-500" />
                                    )}
                                    {customer.rank === "bronze" && (
                                        <FaMedal className="text-2xl text-orange-500" />
                                    )}
                                </td>
                                <td className="p-3 border">{customer.name}</td>
                                <td className="p-3 border">{customer.email}</td>
                                <td className="p-3 border">{customer.phone}</td>
                                <td className="p-3 border">{customer.orders} đơn</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Top3Customer;
