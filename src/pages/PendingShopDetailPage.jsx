import { Button, Modal, Popover, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useOnePendingShop } from "../hooks/useShop";
import ShopService from "../services/ShopService";

const PendingShopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [draftData, setDraftData] = useState([]);
    const [isLoadData, setIsLoadData] = useState(true);
    const [changedValue, setChangedValue] = useState(
        Array(21).fill({
            status: "n",
            reason: "thông tin chưa kiểm tra",
        }),
    ); // Initialize with default values

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const resData = await ShopService.getPendingShopdraft(id);
                setDraftData(resData);
            } catch (error) {
                console.error("Lỗi khi lấy data:", error);
                notifications.show({
                    color: "red",
                    title: "Error fetching data",
                    message: "Failed to load shop details.",
                });
            } finally {
                setIsLoadData(false);
            }
        };
        fetchData(id);
    }, [id]);

    useEffect(() => {
        if (!isLoadData && draftData.length > 0) {
            try {
                const parsedData = JSON.parse(JSON.parse(draftData[0]?.reason)); // cần parse 2 lần mới đc
                if (Array.isArray(parsedData) && parsedData.length === 21) {
                    // Data is valid, use it
                    setChangedValue(parsedData);
                } else {
                    // Data is missing or invalid, use the default array
                    setChangedValue(
                        Array(21).fill({
                            status: "n",
                            reason: "thông tin chưa kiểm tra",
                        }),
                    );
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
                setChangedValue(
                    Array(21).fill({
                        status: "n",
                        reason: "thông tin chưa kiểm tra",
                    }),
                );
                notifications.show({
                    color: "red",
                    title: "Error parsing data",
                    message: "Failed to parse shop details, using default values.",
                });
            }
        }
    }, [isLoadData, draftData]);

    const {
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
    });

    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);
    const [newStatus, setNewStatus] = useState("n");
    const [reason, setReason] = useState("");
    const [openInput, setOpenInput] = useState(false);
    const [selectIndex, setSelectIndex] = useState(null);
    const [approvedStatus, setApprovedStatus] = useState("savedraft");
    const { data: shopData } = useOnePendingShop(id);
    const shop = shopData?.data;

    if (isLoadData) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (!shop) {
        return <div>Không tìm thấy thông tin cửa hàng.</div>;
    }

    const handleSaveDraft = async () => {
        try {
            await ShopService.updatePendingShopDraft(id, {
                status: "savedraft",
                reason: JSON.stringify(changedValue),
            });
            notifications.show({
                color: "green",
                title: "Lưu bản nháp thành công",
                message: "Bản nháp của bạn đã được lưu lại.",
            });
            queryClient.invalidateQueries({ queryKey: ["pendingShops"] });
            queryClient.invalidateQueries({ queryKey: ["approvedShops"] });
            navigate("/main/pendingshops");
        } catch (error) {
            console.error("Lưu bản nháp lỗi:", error);
            notifications.show({
                color: "red",
                title: "Lỗi khi lưu bản nháp",
                message: "Bản nháp của bạn chưa được lưu thành công. Hãy thử lại.",
            });
        }
    };

    const handleApproved = (status) => {
        const count = changedValue.filter((item) => item.status === "n").length;
        if (count > 1) {
            alert(`Có ${count} thông tin chưa kiểm tra. Vui lòng kiểm tra toàn bộ thông tin.`);
        } else {
            setApprovedStatus(status);
            open();
        }
    };

    const onApprovedShop = async () => {
        try {
            await ShopService.updatePendingShopDraft(id, {
                status: approvedStatus,
                reason: JSON.stringify(changedValue),
            });
            notifications.show({
                color: "green",
                title: `${approvedStatus === "accepted" ? "Chấp nhận" : "Từ chối"} cửa hàng`,
                message: `Cửa hàng này đã ${
                    approvedStatus === "accepted" ? "được chấp nhận" : "bị từ chối"
                }!`,
            });
            queryClient.invalidateQueries({ queryKey: ["pendingShops"] });
            queryClient.invalidateQueries({ queryKey: ["approvedShops"] });
            navigate("/main/pendingshops");
        } catch (error) {
            console.error("Lỗi khi cập nhật cửa hàng:", error);
            notifications.show({
                color: "red",
                title: "Có lỗi xảy ra",
                message: "Đã xảy ra lỗi khi cập nhật trạng thái cửa hàng. Hãy thử lại.",
            });
        } finally {
            close();
        }
    };

    const handleSelectChange = (e, index) => {
        const value = e.target.value;
        setSelectIndex(index);

        if (value !== "n") {
            setNewStatus(value);
            setOpenInput(true);
        } else {
            const updatedChangedValue = [...changedValue];
            updatedChangedValue[index] = {
                ...updatedChangedValue[index],
                status: "n",
                reason: "",
            };
            setChangedValue(updatedChangedValue);
            setOpenInput(false);
            setSelectIndex(null);
            setNewStatus("n"); // Reset newStatus when "n" is selected
        }
    };

    const handleInputReason = (e) => {
        setReason(e.target.value);
    };

    const handleSave = async (index) => {
        const updatedChangedValue = [...changedValue];
        updatedChangedValue[index] = {
            ...updatedChangedValue[index],
            status: newStatus,
            reason: reason,
        };

        setChangedValue(updatedChangedValue);
        setOpenInput(false);
        setSelectIndex(null);
        setReason("");
    };

    const getColor = (changed) => {
        if (changed === "n") return "";
        if (changed === "v") return "bg-green-300";
        if (changed === "x") return "bg-red-300";
    };

    const getFieldNameForIndex = (index) => {
        return [
            "",
            "Chủ cửa hàng:",
            "Ảnh chủ cửa hàng:",
            "Email:",
            "Số điện thoại:",
            "Ngày sinh:",
            "Giới tính:",
            "Địa chỉ thường trú:",
            "Trạng thái:",
            "Mã số thuế:",
            "Mã số CCCD:",
            "Tên cửa hàng:",
            "Ảnh avatar cửa hàng:",
            "Địa chỉ kinh doanh:",
            "Ngày gửi:",
            "Ảnh chụp cửa hàng:",
            "Số giấy phép kinh doanh:",
            "Loại hình kinh doanh:",
            "Số tài khoản ngân hàng:",
            "Tên ngân hàng:",
            "Thời gian mở cửa:",
        ][index];
    };

    const getValueForIndex = (index) => {
        // Helper to get dynamic values
        switch (index) {
            case 1:
                return shop?.Owner?.fullName;
            case 2:
                return (
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src="https://nexus.edu.vn/wp-content/uploads/2024/11/hinh-nen-may-tinh-4k-thien-nhien-bien-ca-672553.webp"
                        alt="Shop Logo"
                    />
                );
            case 3:
                return shop?.Owner?.userEmail;
            case 4:
                return shop?.Owner?.userPhone;
            case 5:
                return shop?.Owner?.dateOfBirth;
            case 6:
                return shop?.Owner?.gender;
            case 7:
                return shop?.Owner?.userAddress;
            case 8:
                return shop?.shopStatus;
            case 9:
                return shop?.taxCode;
            case 10:
                return shop?.Owner?.identificationNumber;
            case 11:
                return shop?.shopName;
            case 12:
                return (
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                        alt="Shop avatar"
                    />
                );
            case 13:
                return shop?.shopPickUpAddress;
            case 14:
                return shop?.shopJoinedDate;
            case 15:
                return (
                    <img
                        className="w-48 h-32 object-cover rounded-md"
                        src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                        alt="Ảnh của cửa hàng"
                    />
                );
            case 16:
                return (
                    <img
                        className="w-48 h-32 object-cover rounded-md"
                        src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-anh-thien-nhien-3d-dep-006.jpg"
                        alt="Ảnh giấy phép kinh doanh"
                    />
                );
            case 17:
                return shop?.businessType;
            case 18:
                return shop?.shopBankAccountNumber;
            case 19:
                return shop?.shopBankName;
            case 20:
                return shop?.shopOperationHours;
            default:
                return null;
        }
    };

    return (
        <div className="w-5/6 mx-auto pb-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Cửa hàng: {shop?.shopName}
            </h1>
            <div className="rounded-lg p-4 md:p-10">
                <table className="table-auto bg-white w-full border-collapse">
                    <tbody>
                        {[
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                        ].map((index) => (
                            <tr
                                key={index}
                                className={`border-gray-200 border-x-0 border-t-0 border-[2px] items-center ${getColor(
                                    changedValue[index]?.status,
                                )} hover:bg-blue-200`}
                            >
                                <th className="px-4 py-2 text-left font-bold text-gray-800">
                                    {
                                        [
                                            "",
                                            "Chủ cửa hàng:",
                                            "Ảnh chủ cửa hàng:",
                                            "Email:",
                                            "Số điện thoại:",
                                            "Ngày sinh:",
                                            "Giới tính:",
                                            "Địa chỉ thường trú:",
                                            "Trạng thái:",
                                            "Mã số thuế:",
                                            "Mã số CCCD:",
                                            "Tên cửa hàng:",
                                            "Ảnh avatar cửa hàng:",
                                            "Địa chỉ kinh doanh:",
                                            "Ngày gửi:",
                                            "Ảnh chụp cửa hàng:",
                                            "Số giấy phép kinh doanh:",
                                            "Loại hình kinh doanh:",
                                            "Số tài khoản ngân hàng:",
                                            "Tên ngân hàng:",
                                            "Thời gian mở cửa:",
                                        ][index]
                                    }
                                </th>
                                <td className="py-2 text-gray-900">{getValueForIndex(index)}</td>
                                <td>
                                    <Popover
                                        width={300}
                                        opened={openInput && selectIndex === index}
                                        onChange={setOpenInput}
                                    >
                                        <Popover.Target>
                                            <select
                                                className="border border-black rounded-md w-16 h-8 my-2 float-end mr-6"
                                                onChange={(e) => handleSelectChange(e, index)}
                                                value={changedValue[index]?.status}
                                            >
                                                <option className="bg-white" value="n">
                                                    ⏳
                                                </option>
                                                <option className="bg-green-400" value="v">
                                                    ✅
                                                </option>
                                                <option className="bg-red-400" value="x">
                                                    ❌
                                                </option>
                                            </select>
                                        </Popover.Target>

                                        <Popover.Dropdown>
                                            <Textarea
                                                placeholder="reason..."
                                                onChange={handleInputReason}
                                                value={reason}
                                            />
                                            <Button
                                                disabled={!reason || reason.trim() === ""}
                                                onClick={() => handleSave(index)}
                                            >
                                                Lưu
                                            </Button>
                                        </Popover.Dropdown>
                                    </Popover>
                                </td>
                            </tr>
                        ))}
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
                    Trở lại
                </Button>
                <div className="flex gap-4">
                    <Button color="#999999" onClick={() => handleSaveDraft()}>
                        Lưu bản nháp
                    </Button>
                    <Button color="green" onClick={() => handleApproved("accepted")}>
                        Chấp nhận
                    </Button>
                    <Button color="red" onClick={() => handleApproved("rejected")}>
                        Từ chối
                    </Button>
                </div>
            </div>

            {/* Rejection Modal */}
            <Modal
                opened={opened}
                size="xl"
                padding="xl"
                onClose={close}
                withCloseButton={false}
                centered
            >
                <form onSubmit={handleSubmit(onApprovedShop)}>
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-black mb-6 text-center">
                            Xác nhận thông tin kiểm duyệt
                        </h1>
                        <div className="space-y-4">
                            {changedValue?.map((item, index) =>
                                index === 0 ? null : (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
                                    >
                                        <div
                                            className={`flex flex-col p-2 rounded-lg ${getColor(item.status)}`}
                                        >
                                            <strong className="text-lg">
                                                {getFieldNameForIndex(index)}{" "}
                                                {getValueForIndex(index)}
                                            </strong>
                                            <p className="text-md mt-1">
                                                Lý do: agfuafd helo helo hasd afsas asda gẻ ergv
                                                jkdbcs akjfbk agfuafd helo helo hasd afsas asda gẻ
                                                ergv jkdbcs akjfbk {item?.reason}
                                            </p>
                                        </div>
                                        <div className="min-w-[100px] ml-2 flex justify-center">
                                            <span
                                                className={`px-3 font-semibold py-1 rounded-full text-sm ${
                                                    item?.status === "v"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-red-200 text-red-800"
                                                }`}
                                            >
                                                {item?.status === "v" ? "Chấp nhận" : "Từ chối"}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>

                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            color="gray"
                            onClick={close}
                            className="px-6 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg transition duration-200 bg-gray-200"
                        >
                            Trở lại
                        </Button>
                        <Button
                            type="submit"
                            color={approvedStatus === "accepted" ? "green" : "red"}
                            className="px-6 py-3 font-medium text-white bg-red-600 rounded-lg transition duration-200"
                        >
                            Xác nhận
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PendingShopDetail;
