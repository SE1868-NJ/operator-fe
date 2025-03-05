const statistics = [
    { title: "Tổng doanh thu tháng này", value: "$245,450", change: "+14.9%" },
    { title: "Số lượng đơn hàng hoàn thành", value: "3,200 đơn", change: "+7.8%" },
    { title: "Khách hàng quay lại mua hàng", value: "75.12%", change: "+12.4%" },
    { title: "Tỷ lệ hủy đơn hàng", value: "5.4%", change: "-2.3%" },
    { title: "Thời gian giao hàng trung bình", value: "2.4 ngày", change: "-1.2 ngày" },
];

export default function Statistics() {
    return (
        <div className="grid grid-cols-5 gap-4 mb-6">
            {statistics.map((stat, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg">
                    <h3 className="text-gray-700 font-semibold">{stat.title}</h3>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p
                        className={`text-sm ${stat.change.startsWith("-") ? "text-red-500" : "text-green-500"}`}
                    >
                        {stat.change}
                    </p>
                </div>
            ))}
        </div>
    );
}
