import ShipperServices from "../../services/ShipperServices";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TopShippers() {
    const [shipper, setShipper] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTopShippers();
    }, [])

    const fetchTopShippers = async () => {
        let response = await ShipperServices.top5ShipperInMonth();
        setShipper(response);
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-gray-700 font-semibold mb-4">
                Shipper được đánh giá cao trong tháng
            </h3>
            <ul>
                {shipper?.map((s, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                src={s.avatar}
                                alt={s.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <span className="block font-medium">{shipper.name}</span>
                                <span className="text-sm text-gray-500">
                                    {s.total_order} đơn hàng | ⭐ {s.avg_rating}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md"
                            onClick={() =>
                                navigate(`/main/shipperslist/${s.shipper_id}`)
                            }
                        >
                            Xem
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}
