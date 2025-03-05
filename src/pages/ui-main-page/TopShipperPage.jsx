export default function TopShippers() {
    const shippers = [
        {
            name: "Nguyễn Văn A",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            rating: 4.9,
            deliveries: 120,
        },
        {
            name: "Trần Thị B",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            rating: 4.8,
            deliveries: 105,
        },
        {
            name: "Lê Văn C",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            rating: 4.7,
            deliveries: 98,
        },
        {
            name: "Hoàng Văn D",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            rating: 4.6,
            deliveries: 90,
        },
        {
            name: "Phạm Thị E",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
            rating: 4.5,
            deliveries: 85,
        },
    ];

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-gray-700 font-semibold mb-4">
                Shipper được đánh giá cao trong tháng
            </h3>
            <ul>
                {shippers.map((shipper, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                src={shipper.image}
                                alt={shipper.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <span className="block font-medium">{shipper.name}</span>
                                <span className="text-sm text-gray-500">
                                    {shipper.deliveries} đơn hàng | ⭐ {shipper.rating}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md"
                        >
                            Xem
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
