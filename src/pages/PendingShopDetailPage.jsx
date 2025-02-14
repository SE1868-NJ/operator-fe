import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useOnePendingShop } from "../hooks/useShop";
import ShopService from "../services/ShopService";
import ErrorPage from "./ErrorPage";

const PendingShopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch } = useForm();

    const { data: response, isLoading, isError } = useOnePendingShop(id);
    const shop = response?.data;
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <ErrorPage />;
    }
    const onSubmit = async (data) => {
        try {
            const shop = ShopService.updatePendingShop(data);
            if (shop) {
                notifications.show({
                    color: "green",
                    title: "Cập nhật thành công!",
                    message: `Shop đã được ${
                        data.status === "accepted" ? "chấp nhận" : "từ chối"
                    }.`,
                });
            } else {
                notifications.show({
                    color: "red",
                    title: "Lỗi câp nhật!",
                    message: "Vui lòng thử lại!",
                });
            }
            navigate("/main/pendingshops");
        } catch (err) {
            console.error(err);
            notifications.show({
                color: "red",
                title: "Lỗi đã xảy ra khi cập nhật!",
                message: "Vui lòng thử lại!",
            });
        }
        navigate("/main/pendingshops");
    };

    const handleDecision = (status) => {
        const description = watch("description");
        handleSubmit(() => onSubmit({ id: id, status, description }))();
    };

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
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.fullName}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh chủ cửa hàng:{" "}
                                {/* hiện chưa có trường thông tin này, sau cần sẽ thêm sau */}
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
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.userEmail}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Số điện thoại:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.userPhone}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ngày sinh:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.dateOfBirth}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Giới tính:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.gender}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Địa chỉ thường trú:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.userAddress}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Trạng thái:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.shopStatus}</td>
                        </tr>
                        {/* <tr> 
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
                        </tr> */}
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Mã số thuế:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">{shop.taxCode}</td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Mã số CCCD:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.Owner.identificationNumber}
                            </td>
                        </tr>
                        {/* <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ảnh chụp mặt trước CCCD:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-96 h-auto object-cover"
                                    src={shop.Owner.idCardFrontImage}
                                    alt="ảnh chụp mặt trước CCCD"
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
                                    src={shop.Owner.idCardBackImage}
                                    alt="ảnh chụp mặt sau CCCD"
                                />
                            </td>
                        </tr> */}
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
                                Ảnh avatar cửa hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                <img
                                    className="w-32 h-auto"
                                    src={shop.shopAvatar}
                                    alt="Shop avatar"
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
                        {/* hiện chưa cần danh mục sản phẩm */}
                        {/* <tr> 
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Danh mục sản phẩm: 
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopCategory}
                            </td>
                        </tr> */}
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Ngày gửi:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopJoinedDate}
                            </td>
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
                        {/* Hiện chưa có trường thông tin này */}
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Số giấy phép kinh doanh:
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
                                {shop.shopBankAccountNumber}
                            </td>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Tên ngân hàng:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopBankName}
                            </td>
                        </tr>
                        {/* Hien chua co truong thong tin nay */}
                        {/* <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Đăng ký thuế GTGT:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.vatRegistration}
                            </td>
                        </tr> */}
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Thời gian mở cửa:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopOperationHours}
                            </td>
                        </tr>
                        {/* <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Chính sách đổi trả:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.returnPolicy}
                            </td>
                        </tr> */}
                        {/* <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left">
                                Liên hệ hỗ trợ:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.supportContact}
                            </td>
                        </tr> */}
                        {/* <tr>
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
                        </tr> */}
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
                        {...register("description", {
                            required: "Vui lòng nhập đánh giá của bạn",
                        })}
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Hãy nhập đánh giá của bạn"
                        className="w-full p-2 rounded border border-gray-300 h-28"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            onClick={() => handleDecision("accepted")}
                        >
                            Đồng ý
                        </button>
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDecision("rejected")}
                        >
                            Từ chối
                        </button>
                    </div>
                </form>
            </div>
            <button
                type="button"
                className="mt-4 mb-20 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate("/main/pendingshops")}
            >
                Back to list
            </button>
        </div>
    );
};

export default PendingShopDetail;
