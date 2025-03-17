import { GoogleGenerativeAI } from "@google/generative-ai";
import { ActionIcon, Button, Modal, Popover, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications, showNotification } from "@mantine/notifications";
import { IconEye } from "@tabler/icons-react";
import { IconRobot } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAccountProfile } from "../hooks/useAccountProfile.js";
import { useIndexReasonItem, useOnePendingShop } from "../hooks/useShop";
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
    const [openedDetail, { open: openDetail, close: closeDetail }] = useDisclosure(false);
    const [onOpened, { open: onOpen, close: onClose }] = useDisclosure(false);
    const [detailIndex, setDetailIndex] = useState(0);
    const [newStatus, setNewStatus] = useState("n");
    const [reason, setReason] = useState("");
    const [openInput, setOpenInput] = useState(false);
    const [selectIndex, setSelectIndex] = useState(null);
    const [approvedStatus, setApprovedStatus] = useState("savedraft");
    const { data: shopData } = useOnePendingShop(id);
    const shop = shopData?.data;

    const { data: listDetail } = useIndexReasonItem(id, detailIndex);
    const [fieldName, setFieldName] = useState("");
    const [sendMailReason, setSendMailReason] = useState("");
    const { data: operator } = useAccountProfile();

    const handleOpenReasonTable = (index) => {
        setDetailIndex(index);
        setFieldName(getFieldNameForIndex(index));
        openDetail();
    };

    if (isLoadData) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (!shop) {
        return <div>Không tìm thấy thông tin cửa hàng.</div>;
    }

    const handleApproved = (status) => {
        const count = changedValue.filter((item) => item.status === "n").length;
        if (count > 1) {
            showNotification({
                title: (
                    <p className="font-bold text-xl text-red-500">
                        Chưa kiểm tra hết toàn bộ thông tin
                    </p>
                ),
                color: "red",
                message: (
                    <>
                        <strong className="font-semibold text-black text-md">
                            Còn {count - 1} thông tin chưa kiểm tra.
                        </strong>
                        <p className="text-gray-700">
                            Vui lòng kiểm tra toàn bộ thông tin trước khi cập nhật thông tin xử lý.
                        </p>
                    </>
                ),
            });
            return;
        }
        setApprovedStatus(status);
        open();
    };

    const onApprovedShop = async () => {
        try {
            await ShopService.updatePendingShopDraft(id, {
                operatorID: operator?.operatorID,
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
            e.preventDefault();
            ShopService.updatePendingShopDraft(id, {
                operatorID: operator?.operatorID,
                status: "savedraft",
                reason: JSON.stringify(updatedChangedValue),
            });
            setChangedValue(updatedChangedValue);
            setOpenInput(false);
            setSelectIndex(null);
            setNewStatus("n"); // Reset newStatus when "n" is selected
        }
    };

    const handleInputReason = (e) => {
        setReason(e.target.value);
    };

    const handleSave = async (e, index) => {
        const updatedChangedValue = [...changedValue];
        updatedChangedValue[index] = {
            ...updatedChangedValue[index],
            status: newStatus,
            reason: reason,
        };
        e.preventDefault();
        ShopService.updatePendingShopDraft(id, {
            operatorID: operator?.operatorID,
            status: "savedraft",
            reason: JSON.stringify(updatedChangedValue),
        });
        ShopService.updateIndexReasonItem(operator?.operatorID, id, index, reason, newStatus);

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

    const writeByAI = async () => {
        const genAI = new GoogleGenerativeAI("AIzaSyBT9W5ncWV1wD_6IpUYR6hsrnot1N-P3yo");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`
        Please rewrite the following email in Vietnamese, requesting the user to update the incorrect information used to sign up for the new shop account. Include a polite tone and clear instructions for them to make the necessary corrections.
From this information: ${sendMailReason}
        `);
            const response = await result.response;
            const text = await response.text();
            setSendMailReason(text);
        } catch (error) {
            console.log("Something Went Wrong!", error);
        }
    };

    const doSendMail = () => {};

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
                                                onClick={(e) => handleSave(e, index)}
                                            >
                                                Lưu
                                            </Button>
                                        </Popover.Dropdown>
                                    </Popover>
                                </td>
                                <td>
                                    <ActionIcon
                                        variant="default"
                                        onClick={() => handleOpenReasonTable(index)}
                                    >
                                        <IconEye />
                                    </ActionIcon>
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
                    <Button color="blue" onClick={() => onOpen()}>
                        Gửi mail
                    </Button>
                    <Button color="green" onClick={() => handleApproved("accepted")}>
                        Chấp nhận
                    </Button>
                    <Button color="red" onClick={() => handleApproved("rejected")}>
                        Từ chối
                    </Button>
                </div>
            </div>

            {/* Detail reason by time modal */}
            <Modal
                opened={openedDetail}
                size="xl"
                padding="xl"
                onClose={closeDetail}
                withCloseButton={false}
                centered
            >
                <div className="text-xl font-bold text-gray-800 pb-8">
                    Bảng cập nhật trạng thái của: {fieldName}
                </div>
                <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                    <table className="w-full text-sm text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">
                                    Thời gian
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">
                                    Mã quản trị viên
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">
                                    Lý do
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">
                                    Trạng thái
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listDetail?.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-200 hover:bg-blue-50 transition duration-150"
                                >
                                    <td className="px-5 py-3">
                                        {new Date(item.createdAt).toLocaleString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </td>
                                    <td className="px-5 py-3">{item.operator_id}</td>
                                    <td className="px-5 py-3">{item.reason}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`px-3 py-1 text-sm font-medium rounded-full
                  ${
                      item.status.toLowerCase().includes("accept")
                          ? "bg-green-100 text-green-800"
                          : item.status.toLowerCase().includes("reject")
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                  }
                `}
                                        >
                                            {item.status === "accept" ? "Chấp nhận" : "Từ chối"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={closeDetail}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg shadow-md transition duration-150"
                    >
                        Đóng
                    </button>
                </div>
            </Modal>

            {/* Update Modal */}
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
                                            className={`flex flex-col p-2 rounded-lg ${getColor(
                                                item.status,
                                            )}`}
                                        >
                                            <strong className="text-lg">
                                                {getFieldNameForIndex(index)}{" "}
                                                {getValueForIndex(index)}
                                            </strong>
                                            <p className="text-md mt-1">Lý do: {item?.reason}</p>
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
            <Modal
                opened={onOpened}
                onClose={() => onClose()} // Đóng modal khi nhấn ngoài modal
                withCloseButton={false}
                centered
                size={"xl"}
                classNames={{
                    modal: "max-w-lg w-full p-6 rounded-lg shadow-xl bg-white", // Thêm padding, bo góc, và bóng cho modal
                    title: "text-2xl font-semibold text-gray-800 mb-4", // Tiêu đề to và rõ ràng
                }}
            >
                <p className="font-bold text-xl text-gray-800 mb-6">Nhập nội dung mail</p>
                <div className="space-y-4">
                    {changedValue?.map(
                        (item, index) =>
                            item.status === "x" && (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
                                >
                                    <div className="flex flex-col">
                                        <strong className={`${getColor(item.status)} text-lg`}>
                                            {getFieldNameForIndex(index)} {getValueForIndex(index)}
                                        </strong>
                                        <p className="text-md mt-1">Lý do: {item?.reason}</p>
                                    </div>
                                    <div className="min-w-[100px]">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
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
                <Textarea
                    value={sendMailReason}
                    rows={10}
                    cols={100}
                    className="mt-4"
                    onChange={(e) => setSendMailReason(e.target.value)} // Cập nhật lý do khi người dùng nhập
                />
                <div className="flex justify-end mt-4">
                    <Button
                        color="green"
                        rightSection={<IconRobot />}
                        onClick={writeByAI} // Đóng modal khi nhấn Quay lại
                        className="bg-gray-300 mr-5 text-gray-800 py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    >
                        Viết bằng AI
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => onClose()} // Đóng modal khi nhấn Quay lại
                        className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    >
                        Quay lại
                    </Button>
                    <Button
                        color="red"
                        onClick={() => doSendMail()} // gửi mail
                        className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                    >
                        Gửi
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default PendingShopDetail;
