
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";



const products = [
    {
        name: "Giày Snicker Vento",
        sales: "128 lượt bán",
        image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg", // Thay bằng URL ảnh thật
    },
    {
        name: "Ba lô xanh",
        sales: "401 lượt bán",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlVPlmhCCyBzE9aHOeIU8qrGWkchoxUTcMXQ&s",
    },
    {
        name: "Bình nước",
        sales: "1K+ lượt bán",
        image: "https://homafy.com/wp-content/uploads/2023/03/school-water-bottle.jpeg",
    },
    {
        name: "Giày Snicker Vento",
        sales: "128 lượt bán",
        image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg", // Thay bằng URL ảnh thật
    },
    {
        name: "Ba lô xanh",
        sales: "401 lượt bán",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlVPlmhCCyBzE9aHOeIU8qrGWkchoxUTcMXQ&s",
    },
];

export default function MostSellingProducts() {

    const [product, setProduct] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTopProduct();
    }, [])

    const fetchTopProduct = async () => {
        const data = await ProductService.getTopProductInWeek();
        setProduct(data);
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-gray-700 font-semibold mb-4">Sản phẩm bán chạy</h3>
            <ul>
                {product.map((p, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                src={p?.Product.main_image}
                                alt={p?.Product.product_name}
                                className="w-12 h-12 object-cover rounded-md"
                            />
                            <span>{p?.Product.product_name}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-blue-500">{p?.total_sold} lượt bán</span>
                            <button
                                type="button"
                                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md"
                                onClick={() =>
                                    navigate(`/main/shop/1/product/${p?.product_id}`)
                                }
                            >
                                Xem
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
