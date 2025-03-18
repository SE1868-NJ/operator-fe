import { Button, Modal, Popover, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications, showNotification } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDraftShipper, usePendingShipper } from "../hooks/useShippers.js";
import ShipperServices from "../services/ShipperServices.js";

const ShipperViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [draftData, setDraftData] = useState([]);
    const [isLoadData, setIsLoadData] = useState(true);
    const [changedValue, setChangedValue] = useState(
        Array(21).fill({
            status: "n",
            reason: "thông tin chưa kiểm tra",
        }),
    );

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const resData = await ShipperServices.getPendingShipperDraft(id);
                setDraftData(resData);
            } catch (error) {
                console.error("Lỗi khi lấy data:", error);
                notifications.show({
                    color: "red",
                    title: "Error fetching data",
                    message: "Failed to load shipper details.",
                });
            } finally {
                setIsLoadData(false);
            }
        };
        fetchData(id);
    }, [id]);

    useEffect(() => {
        if (!isLoadData && draftData?.length > 0) {
            try {
                const parsedData = JSON.parse(JSON.parse(draftData[0]?.reason)); // cần parse 2 lần mới đc
                if (Array.isArray(parsedData) && parsedData?.length === 21) {
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
        register,
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
    const { data: responseData } = usePendingShipper(id);
    const shipper = responseData?.data || {};

    if (isLoadData) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (!shipper) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Không tìm thấy thông tin shipper</p>
            </div>
        );
    }

    const handleSaveDraft = async () => {
        console.log("final: ", changedValue);
        try {
            await ShipperServices.updatePendingShipperDraft(id, {
                status: "savedraft",
                reason: JSON.stringify(changedValue),
            });
            notifications.show({
                color: "green",
                title: "Lưu bản nháp thành công",
                message: "Bản nháp của bạn đã được lưu lại.",
            });
            queryClient.invalidateQueries({ queryKey: ["shippers"] });
            queryClient.invalidateQueries({ queryKey: ["pendingShippers"] });
            navigate("/main/pendding-shippers");
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
        if (count > 0) {
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
                            Còn {count} thông tin chưa kiểm tra.
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
        console.log("approved: ", changedValue);
        open();
    };

    const onApprovedShipper = async () => {
        try {
            console.log("xác nhận: ", approvedStatus);
            await ShipperServices.updatePendingShipperDraft(id, {
                status: approvedStatus,
                reason: JSON.stringify(changedValue),
            });
            notifications.show({
                color: "green",
                title: `${approvedStatus === "accepted" ? "Chấp nhận" : "Từ chối"} shipper`,
                message: `Shipper này đã ${
                    approvedStatus === "accepted" ? "được chấp nhận" : "bị từ chối"
                }!`,
            });
            queryClient.invalidateQueries({ queryKey: ["shippers"] });
            queryClient.invalidateQueries({ queryKey: ["pendingShippers"] });
            navigate("/main/pendding-shippers");
        } catch (error) {
            console.error("Lỗi khi cập nhật shipper:", error);
            notifications.show({
                color: "red",
                title: "Có lỗi xảy ra",
                message: "Đã xảy ra lỗi khi cập nhật trạng thái shipper. Hãy thử lại.",
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
            ShipperServices.updatePendingShipperDraft(id, {
                status: "savedraft",
                reason: JSON.stringify(updatedChangedValue),
            });
            setChangedValue(updatedChangedValue);
            setOpenInput(false);
            setSelectIndex(null);
            setNewStatus("n");
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
        ShipperServices.updatePendingShipperDraft(id, {
            status: "savedraft",
            reason: JSON.stringify(updatedChangedValue),
        });
        setChangedValue(updatedChangedValue);
        setOpenInput(false);
        setSelectIndex(null);
        setReason("");
    };

    const getColor = (status) => {
        if (status === "n") return "text-black";
        if (status === "v") return "text-green-500";
        if (status === "x") return "text-red-500";
    };

    const getFieldNameForIndex = (index) => {
        // có 21 phần tử, đồng bộ với số phần phần tử changedvalue
        switch (index) {
            case 0:
                return `Giới tính: ${shipper.gender}`;
            case 1:
                return `Ngày sinh: ${shipper.dateOfBirth}`;
            case 2:
                return `Quê quán: ${shipper.address}`;
            case 3:
                return `Địa chỉ: ${shipper.address}`;
            case 4:
                return `CCCD: ${shipper.cccd}`;
            case 5:
                return `Số·điện thoại: ${shipper.phone}`;
            case 6:
                return `Số tài khoản ngân hàng: ${shipper.bankAccount}` || "Chưa có";
            case 7:
                return `Phạm vi hoạt động: ${shipper.activityArea}`;
            case 8:
                return `Kinh nghiệm: ${shipper.experience}` || "Chưa có";
            case 9:
                return `Thời gian làm việc: ${shipper.workingTime}` || "Full-time/Part-time";
            case 10:
                return `Loại xe: ${shipper.vehicleType}` || "Chưa có";
            case 11:
                return `Biển số xe: ${shipper.vehicleNumber}` || "Chưa có";
            case 12:
                return <img src={shipper.cccdImage} alt="Ảnh CCCD/CMND" />;
            case 13:
                return <img src={shipper.criminalRecord} alt="Ảnh lý lịch tư pháp" />;
            case 14:
                return shipper.driverLicense ? (
                    <img src={shipper.driverLicense} alt="Ảnh bằng lái xe" />
                ) : (
                    <span>Ảnh bằng lái xe</span>
                );
            case 15:
                return `Ngày nộp đơn: ${shipper.submissionDate}` || "Chưa có";
            case 16:
                return `Trạng thái trước đây: ${shipper.previousStatus}` || "Chưa có";
            case 17:
                return (
                    `Họ và tên (Liên hệ khẩn cấp): ${shipper.emergencyContact?.name}` || "Chưa có"
                );
            case 18:
                return `Mối quan hệ: ${shipper.emergencyContact?.relationship}` || "Chưa có";
            case 19:
                return (
                    `Số điện thoại (Liên hệ khẩn cấp): ${shipper.emergencyContact?.phoneNumber}` ||
                    "Chưa có"
                );
            case 20:
                return (
                    `Địa chỉ liên lạc khẩn cấp: ${shipper.emergencyContact?.address}` || "Chưa có"
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center justify-center pt-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-6xl">
                {/* Profile Section */}
                <div className="bg-white p-5 rounded-lg shadow-md">
                    <div className="text-center mt-4 container">
                        <img
                            src={
                                shipper.avatar ||
                                "https://xabuon.com/uploads1/news/31-10-18/xabuon-girl-xinh-haivl-xemvn-sex-31-10-20181540959376626.jpg"
                            }
                            alt={shipper.name}
                            className="w-32 h-32 mx-auto mb-3 transition-transform border-4 border-pink-200 rounded-full hover:border-8 duration-600 hover:scale-150"
                        />
                        <h6 className="mt-2 text-sm text-gray-500">ID: {shipper.id}</h6>
                        <h5 className="mt-3 font-bold">{shipper.name}</h5>
                    </div>
                    <div className="mt-5 text-center">
                        <h5 className="font-bold text-blue-500">Trạng thái shipper</h5>
                        <p className="text-sm">{shipper.status || "Chưa có trạng thái"}</p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-5 bg-white rounded-lg shadow-md md:col-span-3">
                    <h6 className="mb-4 font-bold text-blue-500">Thông tin cá nhân</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong className={getColor(changedValue[0].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 0}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 0)}
                                            value={changedValue[0]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 0)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Giới tính:
                            </strong>{" "}
                            <span>{shipper?.gender}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[1].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 1}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 1)}
                                            value={changedValue[1]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 1)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Ngày sinh:
                            </strong>{" "}
                            <span>{shipper.dateOfBirth}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[2].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 2}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 2)}
                                            value={changedValue[2]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 2)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Quê quán:
                            </strong>{" "}
                            <span>{shipper.address}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[3].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 3}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 3)}
                                            value={changedValue[3]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 3)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Địa chỉ:
                            </strong>{" "}
                            <span>{shipper?.address}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[4].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 4}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 4)}
                                            value={changedValue[4]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 4)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                CCCD:
                            </strong>{" "}
                            <span>{shipper.cccd}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[5].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 5}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 5)}
                                            value={changedValue[5]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 5)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Số điện thoại:
                            </strong>{" "}
                            <span>{shipper.phone}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[6].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 6}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 6)}
                                            value={changedValue[6]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 6)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Số tài khoản ngân hàng:
                            </strong>{" "}
                            <span>{shipper.bankAccount || "Chưa có"}</span>
                        </div>
                    </div>

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Thông tin hoạt động</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong className={getColor(changedValue[7].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 7}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 7)}
                                            value={changedValue[7]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 7)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Phạm vi hoạt động:
                            </strong>{" "}
                            <span>{shipper.activityArea}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[8].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 8}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 8)}
                                            value={changedValue[8]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 8)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Kinh nghiệm làm việc:
                            </strong>{" "}
                            <span>{shipper.experience || "Chưa có"}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[9].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 9}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 9)}
                                            value={changedValue[9]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 9)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Thời gian làm việc:
                            </strong>{" "}
                            <span>{shipper.workingTime || "Full-time/Part-time"}</span>
                        </div>
                    </div>

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Thông tin phương tiện</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong className={getColor(changedValue[10].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 10}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 10)}
                                            value={changedValue[10]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 10)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Loại xe:
                            </strong>{" "}
                            <span>{shipper.vehicleType || "Chưa có"}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[11].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 11}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 11)}
                                            value={changedValue[11]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 11)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Biển số xe:
                            </strong>{" "}
                            <span>{shipper.vehicleNumber || "Chưa có"}</span>
                        </div>
                    </div>

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Tài liệu đính kèm</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong className={getColor(changedValue[12].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 12}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 12)}
                                            value={changedValue[12]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 12)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                CMND/CCCD:
                            </strong>{" "}
                            <a href={shipper.cccdImage} target="_blank" rel="noopener noreferrer">
                                Xem ảnh
                            </a>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[13].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 13}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 13)}
                                            value={changedValue[13]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 13)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Lý lịch tư pháp:
                            </strong>{" "}
                            <a
                                href={shipper.criminalRecord}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Xem ảnh
                            </a>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[14].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 14}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 14)}
                                            value={changedValue[14]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 14)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Bằng lái xe:
                            </strong>{" "}
                            {shipper.driverLicense ? (
                                <a
                                    href={shipper.driverLicense}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Xem ảnh
                                </a>
                            ) : (
                                <span>Chưa có</span>
                            )}
                        </div>
                    </div>

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Lịch sử đăng ký</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong className={getColor(changedValue[15].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 15}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 15)}
                                            value={changedValue[15]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 15)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Ngày nộp đơn:
                            </strong>{" "}
                            <span>{shipper.submissionDate || "Chưa có"}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[16].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 16}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 16)}
                                            value={changedValue[16]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 16)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Trạng thái trước đây:
                            </strong>{" "}
                            <span>{shipper.previousStatus || "Chưa có"}</span>
                        </div>
                    </div>

                    <h6 className="mt-6 mb-4 font-bold text-blue-500">Liên hệ khẩn cấp</h6>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong className={getColor(changedValue[17].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 17}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 17)}
                                            value={changedValue[17]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 17)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Họ và tên:
                            </strong>{" "}
                            <span>{shipper.emergencyContact?.name || "Chưa có"}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[18].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 18}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 18)}
                                            value={changedValue[18]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 18)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Mối quan hệ:
                            </strong>{" "}
                            <span>{shipper.emergencyContact?.relationship || "Chưa có"}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[19].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 19}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 19)}
                                            value={changedValue[19]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 19)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Số điện thoại:
                            </strong>{" "}
                            <span>{shipper.emergencyContact?.phoneNumber || "Chưa có"}</span>
                        </div>
                        <div>
                            <strong className={getColor(changedValue[20].status)}>
                                <Popover
                                    opened={openInput && selectIndex === 20}
                                    onChange={setOpenInput}
                                >
                                    <Popover.Target>
                                        <select
                                            className="border border-gray-700 rounded"
                                            onChange={(e) => handleSelectChange(e, 20)}
                                            value={changedValue[20]?.status}
                                        >
                                            <option value="n">⏳</option>
                                            <option value="v">✅</option>
                                            <option value="x">❌</option>
                                        </select>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <Textarea
                                            placeholder="Lý do..."
                                            onChange={handleInputReason}
                                            value={reason}
                                        />
                                        <Button
                                            disabled={!reason || reason.trim() === ""}
                                            onClick={(e) => handleSave(e, 20)}
                                        >
                                            Lưu
                                        </Button>
                                    </Popover.Dropdown>
                                </Popover>{" "}
                                Địa chỉ liên lạc khẩn cấp:
                            </strong>{" "}
                            <span>{shipper.emergencyContact?.address || "Chưa có"}</span>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <button
                            onClick={() => handleApproved("accepted")}
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                        >
                            Chấp nhận
                        </button>
                        <Modal
                            size="xl" // Tăng kích thước modal lên "lg" hoặc "full" nếu muốn modal to hơn nữa
                            padding="xl" // Tăng padding để modal có khoảng cách rộng hơn
                            opened={opened}
                            onClose={close}
                            withCloseButton={false}
                            centered
                        >
                            <form
                                onSubmit={handleSubmit(onApprovedShipper)}
                                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
                            >
                                <h1 className="text-3xl font-bold text-black mb-6 text-center">
                                    Xác nhận thông tin kiểm duyệt
                                </h1>

                                <div className="space-y-4">
                                    {changedValue?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
                                        >
                                            <div className="flex flex-col">
                                                <strong
                                                    className={`${getColor(item.status)} text-lg`}
                                                >
                                                    {getFieldNameForIndex(index)}
                                                </strong>
                                                <p className="text-md mt-1">
                                                    Lý do: {item?.reason}
                                                </p>
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
                                    ))}
                                </div>

                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-4">
                                        {errors.description.message}
                                    </p>
                                )}

                                <div className="flex justify-end gap-4 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        color="gray"
                                        onClick={close}
                                        className="px-6 py-3 font-medium text-gray-700 border border-gray-300 rounded-lg transition duration-200 hover:bg-gray-100"
                                    >
                                        Trở lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="red"
                                        className="px-6 py-3 font-medium text-white bg-red-600 rounded-lg transition duration-200 hover:bg-red-500"
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                            </form>
                        </Modal>
                        <button
                            type="button"
                            className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
                            onClick={() => handleApproved("rejected")}
                        >
                            Từ chối
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipperViewPage;
