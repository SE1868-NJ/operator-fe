import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PendingShopListPage = () => {
    const navigate = useNavigate();
    const [searchOwner, setSearchOwner] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    const listShop = [
        // all status = pending
        {
            id: 1,
            shopName: "Shop 1",
            ownerName: "Nguyen Van A",
            ownerEmail: "nguyenA@example.com",
            ownerPhone: "0123456789",
            shopPickUpAddress: "Toa nha so 1, tang 1, phong so 101",
            registrationDate: "01-02-2003",
            shopStatus: "pending",
            contractFile: "contract.pdf",
            taxIdentificationNumber: "123456789",
            ownerCitizenID: "0123456789233",
            businessRegistrationAddress: "Ha Noi, Viet Nam",
            shopCategory: "Thời trang", // [ , , , ] tạo các category rồi cho các shop chọn
            shopImage: "shop1.jpg", // để shipper tìm đc cửa hàng
            shopDescription: "Chuyên bán quần áo thời trang nam nữ cao cấp", // chưa cần
            websiteURL: "https://shop1.com", // chưa cần
            socialMediaLinks: {
                // chưa cần
                facebook: "https://facebook.com/shop1",
                instagram: "https://instagram.com/shop1",
            },
            dateOfBirth: "01-01-1980", // lấy từ register
            gender: "Male", // lấy từ register
            ownerAddress: "123 Đường ABC, Quận XYZ, TP.HCM", // lấy từ register
            businessLicenseNumber: "123456789",
            businessType: "Hộ kinh doanh cá thể",
            bankAccountNumber: "0123456789",
            bankName: "Vietcombank",
            vatRegistration: "Đã đăng ký",
            shopOperationHours: "08:00 - 22:00",
            // "shippingPartners": ["Giao Hàng Nhanh", "Giao Hàng Tiết Kiệm"],
            returnPolicy: "Đổi trả trong vòng 7 ngày",
            supportContact: "support@shop1.com", // có thể dùng owner email
            businessLicenseFile: "business_license.pdf",
            idCardFrontFile: "id_front.jpg",
            idCardBackFile: "id_back.jpg",
            shopLogoFile: "logo.jpg", // chưa cần
            createdAt: "2023-01-01",
        },
        {
            id: 2,
            shopName: "Shop 2",
            ownerName: "Tran Thi B",
            ownerEmail: "tranB@example.com",
            ownerPhone: "0987654321",
            shopPickUpAddress: "Toa nha so 2, tang 2, phong so 202",
            registrationDate: "15-03-2010",
            shopStatus: "pending",
            contractFile: "contract_shop2.pdf",
            taxIdentificationNumber: "987654321",
            ownerCitizenID: "9876543212345",
            businessRegistrationAddress: "Hai Duong, Viet Nam",
            shopCategory: "Điện tử",
            shopImage: "shop2.jpg",
            websiteURL: "https://shop2.com",
            socialMediaLinks: {
                facebook: "https://facebook.com/shop2",
                instagram: "https://instagram.com/shop2",
            },
            dateOfBirth: "12-05-1985",
            gender: "Female",
            ownerAddress: "456 Đường DEF, Quận ABC, Hà Nội",
            businessLicenseNumber: "987654321",
            businessType: "Công ty TNHH",
            bankAccountNumber: "987654321",
            bankName: "VietinBank",
            vatRegistration: "Chưa đăng ký",
            shopOperationHours: "09:00 - 18:00",
            returnPolicy: "Đổi trả trong vòng 14 ngày",
            supportContact: "support@shop2.com",
            businessLicenseFile: "business_license_shop2.pdf",
            idCardFrontFile: "id_front_shop2.jpg",
            idCardBackFile: "id_back_shop2.jpg",
            shopLogoFile: "logo_shop2.jpg",
            createdAt: "2023-02-01",
        },
        {
            id: 3,
            shopName: "Shop 3",
            ownerName: "Le Thi C",
            ownerEmail: "leC@example.com",
            ownerPhone: "0123459876",
            shopPickUpAddress: "Toa nha so 3, tang 3, phong so 303",
            registrationDate: "10-11-2015",
            shopStatus: "pending",
            contractFile: "contract_shop3.pdf",
            taxIdentificationNumber: "1122334455",
            ownerCitizenID: "1122334455667",
            businessRegistrationAddress: "Da Nang, Viet Nam",
            shopCategory: "Mỹ phẩm",
            shopImage: "shop3.jpg",
            websiteURL: "https://shop3.com",
            socialMediaLinks: {
                facebook: "https://facebook.com/shop3",
                instagram: "https://instagram.com/shop3",
            },
            dateOfBirth: "20-06-1990",
            gender: "Female",
            ownerAddress: "789 Đường GHI, Quận DEF, TP.HCM",
            businessLicenseNumber: "1122334455",
            businessType: "Doanh nghiệp tư nhân",
            bankAccountNumber: "1122334455",
            bankName: "Techcombank",
            vatRegistration: "Đã đăng ký",
            shopOperationHours: "10:00 - 19:00",
            returnPolicy: "Đổi trả trong vòng 30 ngày",
            supportContact: "support@shop3.com",
            businessLicenseFile: "business_license_shop3.pdf",
            idCardFrontFile: "id_front_shop3.jpg",
            idCardBackFile: "id_back_shop3.jpg",
            shopLogoFile: "logo_shop3.jpg",
            createdAt: "2023-03-01",
        },
        {
            id: 4,
            shopName: "Shop 4",
            ownerName: "Nguyen Thi D",
            ownerEmail: "nguyenD@example.com",
            ownerPhone: "0987651234",
            shopPickUpAddress: "Toa nha so 4, tang 4, phong so 404",
            registrationDate: "25-12-2008",
            shopStatus: "pending",
            contractFile: "contract_shop4.pdf",
            taxIdentificationNumber: "2233445566",
            ownerCitizenID: "2233445566778",
            businessRegistrationAddress: "Quang Ninh, Viet Nam",
            shopCategory: "Sách & Văn phòng phẩm",
            shopImage: "shop4.jpg",
            websiteURL: "https://shop4.com",
            socialMediaLinks: {
                facebook: "https://facebook.com/shop4",
                instagram: "https://instagram.com/shop4",
            },
            dateOfBirth: "14-08-1975",
            gender: "Male",
            ownerAddress: "123 Đường XYZ, Quận UVW, Hà Nội",
            businessLicenseNumber: "2233445566",
            businessType: "Công ty Cổ phần",
            bankAccountNumber: "2233445566",
            bankName: "Vietcombank",
            vatRegistration: "Chưa đăng ký",
            shopOperationHours: "08:00 - 17:00",
            returnPolicy: "Đổi trả trong vòng 7 ngày",
            supportContact: "support@shop4.com",
            businessLicenseFile: "business_license_shop4.pdf",
            idCardFrontFile: "id_front_shop4.jpg",
            idCardBackFile: "id_back_shop4.jpg",
            shopLogoFile: "logo_shop4.jpg",
            createdAt: "2023-04-01",
        },
        {
            id: 5,
            shopName: "Shop 5",
            ownerName: "Pham Thi E",
            ownerEmail: "phamE@example.com",
            ownerPhone: "0987771234",
            shopPickUpAddress: "Toa nha so 5, tang 5, phong so 505",
            registrationDate: "03-06-2020",
            shopStatus: "pending",
            contractFile: "contract_shop5.pdf",
            taxIdentificationNumber: "3344556677",
            ownerCitizenID: "3344556677889",
            businessRegistrationAddress: "Bac Ninh, Viet Nam",
            shopCategory: "Thực phẩm & Đồ uống",
            shopImage: "shop5.jpg",
            websiteURL: "https://shop5.com",
            socialMediaLinks: {
                facebook: "https://facebook.com/shop5",
                instagram: "https://instagram.com/shop5",
            },
            dateOfBirth: "28-09-1992",
            gender: "Female",
            ownerAddress: "321 Đường JKL, Quận PQR, TP.HCM",
            businessLicenseNumber: "3344556677",
            businessType: "Doanh nghiệp tư nhân",
            bankAccountNumber: "3344556677",
            bankName: "Sacombank",
            vatRegistration: "Đã đăng ký",
            shopOperationHours: "07:00 - 22:00",
            returnPolicy: "Đổi trả trong vòng 14 ngày",
            supportContact: "support@shop5.com",
            businessLicenseFile: "business_license_shop5.pdf",
            idCardFrontFile: "id_front_shop5.jpg",
            idCardBackFile: "id_back_shop5.jpg",
            shopLogoFile: "logo_shop5.jpg",
            createdAt: "2023-05-01",
        },
    ];

    const [pendingshoplist, setPendingshoplist] = useState([]);
    useEffect(() => {
        setPendingshoplist(listShop.filter((shop) => shop.shopStatus === "pending"));
    }, []);

    const handleFilter = () => {
        const newList = pendingshoplist.filter((shop) => {
            const owner = searchOwner
                ? shop.ownerName.toLowerCase().includes(searchOwner.toLowerCase())
                : true;
            const email = searchEmail
                ? shop.ownerEmail.toLowerCase().includes(searchEmail.toLowerCase())
                : true;
            const phone = searchPhone
                ? shop.ownerPhone.toLowerCase().includes(searchPhone.toLowerCase())
                : true;
            return owner && email && phone;
        });
        return newList;
    };

    return (
        <div className="justify-center w-full">
            <h1 className="mt-10 text-center font-bold text-3xl">Pending Shop List</h1>
            <div className="my-10 mx-20">
                <div className="flex mb-4 justify-between">
                    <label className="w-1/4">
                        <p className="font-bold">Tìm kiếm bằng tên chủ cửa hàng:</p>
                        <input
                            type="text"
                            placeholder="Tên chủ cửa hàng"
                            className="border p-2 rounded w-full"
                            value={searchOwner}
                            onChange={(e) => setSearchOwner(e.target.value)}
                        />
                    </label>
                    <label className="w-1/4">
                        <p className="font-bold">Tìm kiếm bằng email:</p>
                        <input
                            type="text"
                            placeholder="Email của chủ cửa hàng"
                            className="border p-2 rounded w-full"
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                    </label>
                    <label className="w-1/4">
                        <p className="font-bold">Tìm kiếm bằng số điện thoại:</p>
                        <input
                            type="text"
                            placeholder="0987654321"
                            className="border p-2 rounded w-full"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                        />
                    </label>
                </div>
            </div>
            <div className="mx-3 lg:mx-10">
                <table className=" w-full table-auto text-left">
                    <thead className="text-center bg-gray-200 border-black">
                        <tr>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">STT</th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Tên cửa hàng
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Chủ cửa hàng
                            </th>
                            <th className="max-w-28 border-[2px] border-black p-2 text-xl">
                                Email
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Số điện thoại
                            </th>
                            <th className="max-w-40 border-[2px] border-black p-2 text-xl">
                                Địa chỉ cửa hàng
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Ngày gửi
                            </th>
                            <th className="max-w-20 border-[2px] border-black p-2 text-xl">
                                Chi tiết
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {handleFilter().map((shop, index) => (
                            <tr key={shop.id}>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2 text-center">
                                    {index + 1}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.shopName}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.ownerName}
                                </td>
                                <td className="max-w-28 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.ownerEmail}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.ownerPhone}
                                </td>
                                <td className="max-w-40 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.shopPickUpAddress}
                                </td>
                                <td className="max-w-20 overflow-hidden text-ellipsis border-[2px] border-black p-2">
                                    {shop.createdAt}
                                </td>
                                <td className="border-[2px] border-black p-2">
                                    {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Accept
                  </button> */}
                                    <button
                                        type="button"
                                        className="text-blue-500 underline"
                                        onClick={() => navigate(`/main/pendingshoplist/${shop.id}`)}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingShopListPage;
