export default function TopCustomers() {
    const customers = [
        {
            name: "Marks Hoverson",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
        },
        {
            name: "Jhony Peters",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
        },
        {
            name: "David Beckham",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
        },
        {
            name: "Marks Hoverson",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
        },
        {
            name: "Marks Hoverson",
            image: "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg",
        },
    ];

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-gray-700 font-semibold mb-4">Khách hàng hàng đầu trong tuần</h3>
            <ul>
                {customers.map((customer, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                src={customer.image}
                                alt={customer.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <span>{customer.name}</span>
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
