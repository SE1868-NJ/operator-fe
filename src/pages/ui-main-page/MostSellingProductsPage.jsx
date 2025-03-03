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
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-gray-700 font-semibold mb-4">Sản phẩm bán chạy</h3>
            <ul>
                {products.map((product, index) => (
                    <li key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center gap-3">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md"
                            />
                            <span>{product.name}</span>
                        </div>
                        <span className="text-blue-500">{product.sales}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
