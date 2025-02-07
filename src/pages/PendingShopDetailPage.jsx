import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/Auth";

const PendingShopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch } = useForm();

    const onSubmit = async (data) => {
        try {
            await AuthService.updatePendingShop(data.id, data.status, data.description); // back-end updatePendingShop
            notifications.show({
                color: "green",
                title: "Cập nhật thành công!",
                message: `Shop đã được ${data.status === "accept" ? "chấp nhận" : "từ chối"}.`,
            });
            navigate("/main/pendingshoplist");
        } catch (err) {
            console.error(err);
            notifications.show({
                color: "red",
                title: "Lỗi đã xảy ra khi cập nhật!",
                message: "Vui lòng thử lại!",
            });
        }
        navigate("/main/pendingshoplist");
    };

    const handleDecision = (status) => {
        const description = watch("description");
        handleSubmit(() => onSubmit({ id: shop.id, status, description }))();
    };

    const listShop = [
        // all status = pending
        {
            id: 1,
            shopName: "Shop 1",
            ownerName: "Nguyen Van A",
            ownerImage: "ownerImage.jpg",
            ownerEmail: "nguyenA@example.com",
            ownerPhone: "0123456789",
            shopPickUpAddress: "Toa nha so 1, tang 1, phong so 101",
            registrationDate: "01-02-2003",
            shopStatus: "pending",
            contractFile: "contract.pdf",
            taxIdentificationNumber: "123456789",
            ownerCitizenID: "0123456789233",
            dateOfIssue: "01-02-2003",
            placeOfIssue: "Ha Noi",
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
            ownerImage: "ownerImage.jpg",
            ownerEmail: "tranB@example.com",
            ownerPhone: "0987654321",
            shopPickUpAddress: "Toa nha so 2, tang 2, phong so 202",
            registrationDate: "15-03-2010",
            shopStatus: "pending",
            contractFile: "contract_shop2.pdf",
            taxIdentificationNumber: "987654321",
            ownerCitizenID: "9876543212345",
            dateOfIssue: "01-02-2003",
            placeOfIssue: "Ha Noi",
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
            ownerImage: "ownerImage.jpg",
            ownerEmail: "leC@example.com",
            ownerPhone: "0123459876",
            shopPickUpAddress: "Toa nha so 3, tang 3, phong so 303",
            registrationDate: "10-11-2015",
            shopStatus: "pending",
            contractFile: "contract_shop3.pdf",
            taxIdentificationNumber: "1122334455",
            ownerCitizenID: "1122334455667",
            dateOfIssue: "01-02-2003",
            placeOfIssue: "Ha Noi",
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
            ownerImage: "ownerImage.jpg",
            ownerEmail: "nguyenD@example.com",
            ownerPhone: "0987651234",
            shopPickUpAddress: "Toa nha so 4, tang 4, phong so 404",
            registrationDate: "25-12-2008",
            shopStatus: "pending",
            contractFile: "contract_shop4.pdf",
            taxIdentificationNumber: "2233445566",
            ownerCitizenID: "2233445566778",
            dateOfIssue: "01-02-2003",
            placeOfIssue: "Ha Noi",
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
            ownerImage: "ownerImage.jpg",
            ownerEmail: "phamE@example.com",
            ownerPhone: "0987771234",
            shopPickUpAddress: "Toa nha so 5, tang 5, phong so 505",
            registrationDate: "03-06-2020",
            shopStatus: "pending",
            contractFile: "contract_shop5.pdf",
            taxIdentificationNumber: "3344556677",
            ownerCitizenID: "3344556677889",
            dateOfIssue: "01-02-2003",
            placeOfIssue: "Ha Noi",
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

    const shop = listShop.find((shop) => shop.id === Number.parseInt(id));
    if (!shop) return <div>Shop not found</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold my-10 text-center">Cửa hàng: {shop.shopName}</h1>
            <div className="flex justify-center">
                <table className="table-auto border-collapse w-2/3">
                    <tbody>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Chủ cửa hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.ownerName}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh chủ cửa hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-32 h-auto"
                                    src="https://nexus.edu.vn/wp-content/uploads/2024/11/hinh-nen-may-tinh-4k-thien-nhien-bien-ca-672553.webp"
                                    alt="Shop Logo"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Email:</th>
                            <td className="border border-gray-300 px-4 py-2">{shop.ownerEmail}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Số điện thoại:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.ownerPhone}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ngày sinh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.dateOfBirth}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Giới tính:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.gender}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Địa chỉ thường trú:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.ownerAddress}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Trạng thái:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.shopStatus}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Hợp đồng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <a
                                    href={shop.contractFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {shop.contractFile}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Mã số thuế:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.taxIdentificationNumber}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Mã số CCCD:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.ownerCitizenID}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ngày cấp:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.dateOfIssue}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">Nơi cấp:</th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.placeOfIssue}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh chụp mặt trước CCCD:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-96 h-auto object-cover"
                                    src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-thien-nhien-22.jpg"
                                    alt=""
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh chụp mặt sau CCCD:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-96 h-auto object-cover"
                                    src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-thien-nhien-22.jpg"
                                    alt=""
                                />
                            </td>
                        </tr>
                        <tr>
                            <th
                                className="border border-gray-300 px-4 py-2 text-center text-3xl"
                                colSpan={2}
                            >
                                <p className="my-4">Thông tin cửa hàng</p>
                            </th>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Tên cửa hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.shopName}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh logo cửa hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-32 h-auto"
                                    src="https://nexus.edu.vn/wp-content/uploads/2024/11/hinh-nen-may-tinh-4k-thien-nhien-bien-ca-672553.webp"
                                    alt="Shop Logo"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Địa chỉ kinh doanh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopPickUpAddress}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Địa chỉ đăng ký kinh doanh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.businessRegistrationAddress}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Danh mục sản phẩm:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopCategory}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ngày gửi:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.createdAt}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh chụp cửa hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-96 h-auto object-cover"
                                    src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                                    alt=""
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Trang web:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <a href={shop.websiteURL} target="_blank" rel="noreferrer">
                                    {shop.websiteURL}
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Liên kết mạng xã hội:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <a
                                    href={shop.socialMediaLinks.facebook}
                                    className="block"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {shop.socialMediaLinks.facebook}
                                </a>
                                <a
                                    href={shop.socialMediaLinks.instagram}
                                    className="block"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {shop.socialMediaLinks.instagram}
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Số giấy phép kinh doanh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.businessLicenseNumber}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Loại hình kinh doanh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.businessType}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Số tài khoản ngân hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.bankAccountNumber}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Tên ngân hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.bankName}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Đăng ký thuế GTGT:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.vatRegistration}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Thời gian mở cửa:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopOperationHours}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Chính sách đổi trả:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.returnPolicy}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Liên hệ hỗ trợ:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.supportContact}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Hồ sơ giấy phép kinh doanh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <a
                                    href={shop.contractFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {shop.businessLicenseFile}
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 border border-black p-6 w-5/6"
                >
                    <p className="font-semibold mb-2">Đánh giá của Operator:</p>
                    <textarea
                        {...register("description")}
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Nhận xét"
                        className="w-full p-2 rounded border border-gray-300 h-28"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => handleDecision("accept")}
                        >
                            Accept
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDecision("reject")}
                        >
                            Reject
                        </button>
                    </div>
                </form>
            </div>
            <button
                type="button"
                className="mt-4 mb-20 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate("/main/pendingshoplist")}
            >
                Back to list
            </button>
        </div>
    );
};

export default PendingShopDetail;
