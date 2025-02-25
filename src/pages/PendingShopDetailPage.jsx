import { Button, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useOnePendingShop } from "../hooks/useShop";
import ShopService from "../services/ShopService";
import ErrorPage from "./ErrorPage";

const PendingShopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onSubmit", // Xác thực khi submit form
    });
    const [opened, { open, close }] = useDisclosure(false);

    const { data: response, isLoading, isError } = useOnePendingShop(id);
    const shop = response?.data;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (isError) {
        return <ErrorPage />;
    }

    const handleAccept = async () => {
        try {
            await ShopService.updatePendingShop({ id: id, status: "accepted" });
            notifications.show({
                color: "green",
                title: "Shop Accepted",
                message: "The shop has been successfully accepted.",
            });
            navigate("/main/pendingshops");
        } catch (error) {
            console.error("Error accepting shop:", error);
            notifications.show({
                color: "red",
                title: "Error",
                message: "Failed to accept shop. Please try again.",
            });
        }
    };

    const handleReject = () => {
        open();
    };

    const onSubmitReject = async (data) => {
        try {
            await ShopService.updatePendingShop({
                id: id,
                status: "rejected",
                description: data.description, // Sử dụng dữ liệu từ form
            });
            notifications.show({
                color: "green",
                title: "Shop Rejected",
                message: "The shop has been successfully rejected.",
            });
            navigate("/main/pendingshops");
        } catch (error) {
            console.error("Error rejecting shop:", error);
            notifications.show({
                color: "red",
                title: "Error",
                message: "Failed to reject shop. Please try again.",
            });
        } finally {
            close();
        }
    };

    return (
        <div className="w-5/6 mx-auto py-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Cửa hàng: {shop.shopName}
            </h1>
            <div className="bg-gray-200 shadow rounded-lg p-4 md:p-10">
                <table className="table-auto bg-white w-full border-collapse">
                    <tbody>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Chủ cửa hàng:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.fullName}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Ảnh chủ cửa hàng:{" "}
                                {/* hiện chưa có trường thông tin này, sau cần sẽ thêm sau */}
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                <img
                                    className="w-24 h-24 rounded-full object-cover"
                                    src="https://nexus.edu.vn/wp-content/uploads/2024/11/hinh-nen-may-tinh-4k-thien-nhien-bien-ca-672553.webp"
                                    alt="Shop Logo"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Email:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.userEmail}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Số điện thoại:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.userPhone}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Ngày sinh:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.dateOfBirth}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Giới tính:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.gender}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Địa chỉ thường trú:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.userAddress}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Trạng thái:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopStatus}
                            </td>
                        </tr>
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
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
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Mã số thuế:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.taxCode}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Mã số CCCD:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.Owner.identificationNumber}
                            </td>
                        </tr>
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
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
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
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
                                className="border border-gray-400 px-4 py-3 text-center text-2xl font-semibold text-gray-700"
                                colSpan={2}
                            >
                                <p className="my-2">Thông tin cửa hàng</p>
                            </th>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Tên cửa hàng:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopName}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Ảnh avatar cửa hàng:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                <img
                                    className="w-24 h-24 rounded-full object-cover"
                                    // src={shop.shopAvatar}
                                    src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                                    alt="Shop avatar"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Địa chỉ kinh doanh:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopPickUpAddress}
                            </td>
                        </tr>
                        {/* hiện chưa cần danh mục sản phẩm */}
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
                                Danh mục sản phẩm:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.shopCategory}
                            </td>
                        </tr> */}
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Ngày gửi:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopJoinedDate}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Ảnh chụp cửa hàng:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                <img
                                    className="w-48 h-32 object-cover rounded-md"
                                    src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                                    alt="Ảnh của cửa hàng"
                                />
                            </td>
                        </tr>
                        {/* Hiện chưa có trường thông tin này */}
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Số giấy phép kinh doanh:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                <img
                                    className="w-48 h-32 object-cover rounded-md"
                                    src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                                    alt="Ảnh giấy phép kinh doanh"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Loại hình kinh doanh:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.businessType}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Số tài khoản ngân hàng:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopBankAccountNumber}
                            </td>
                        </tr>
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Tên ngân hàng:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopBankName}
                            </td>
                        </tr>
                        {/* Hien chua co truong thong tin nay */}
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
                                Đăng ký thuế GTGT:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.vatRegistration}
                            </td>
                        </tr> */}
                        <tr>
                            <th className="border w-2/5 border-gray-400 px-4 py-2 text-left font-medium text-gray-700">
                                Thời gian mở cửa:
                            </th>
                            <td className="border border-gray-400 px-4 py-2 text-gray-900">
                                {shop.shopOperationHours}
                            </td>
                        </tr>
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
                                Chính sách đổi trả:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.returnPolicy}
                            </td>
                        </tr> */}
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
                                Liên hệ hỗ trợ:
                            </th>
                            <td className="border border-gray-300 px-4 py-2">
                                {shop.supportContact}
                            </td>
                        </tr> */}
                        {/* <tr>
                            <th className="border w-2/5 border-gray-300 px-4 py-2 text-left">
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

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between gap-4">
                <Button
                    color="blue"
                    onClick={() => navigate("/main/pendingshops")}
                    className="flex-grow md:flex-none"
                >
                    Back to List
                </Button>
                <div className="flex gap-4">
                    <Button color="green" onClick={handleAccept}>
                        Accept
                    </Button>
                    <Button color="red" onClick={handleReject}>
                        Reject
                    </Button>
                </div>
            </div>

            {/* Rejection Modal */}
            <Modal opened={opened} onClose={close} withCloseButton={false} centered>
                <form onSubmit={handleSubmit(onSubmitReject)}>
                    <div className="mb-4">
                        <p className="flex items-center text-lg font-semibold mb-2 text-gray-700">
                            <IconAlertCircle className="mr-2 text-red-500" size={20} />
                            Nhập lý do từ chối <span className="text-red-500 ml-1">*</span>
                        </p>
                        <Textarea
                            {...register("description", {
                                required: "Hãy nhập lý do từ chối.",
                            })}
                            placeholder="Nhập lý do từ chối..."
                            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            autosize
                            minRows={3}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" color="gray" onClick={close}>
                            Trở lại
                        </Button>
                        <Button type="submit" color="red">
                            Xác nhận
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PendingShopDetail;
