import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAccountProfile } from "../hooks/useAccountProfile.js";
import BanService from "../services/BanService";

const BanAccountForm = () => {
    const { data } = useAccountProfile();
    const queryClient = useQueryClient();

    const [searchParams] = useSearchParams();

    const Navigate = useNavigate();

    // Lấy thông tin từ data (account profile)
    const operatorName = `${data?.lastName} ${data?.firstName}`;

    // Lấy thông tin từ URL
    const userId = searchParams.get("userId") || "";
    const operatorId = searchParams.get("operatorId") || "";

    const userType = searchParams.get("accountType") || "";
    const userName = searchParams.get("userName") || "";

    // Các lựa chọn lý do theo loại tài khoản
    const reasonOptions = {
        customer: [
            "Bùng hàng nhiều lần",
            "Lăng mạ shipper",
            "Gian lận khuyến mãi",
            "Hủy đơn hàng quá nhiều",
        ],
        shipper: [
            "Không lịch sự với khách",
            "Giao hàng trễ nhiều lần",
            "Làm thất lạc hàng hóa",
            "Từ chối giao hàng không lý do",
        ],
        shop: [
            "Vi phạm vệ sinh an toàn thực phẩm",
            "Bán hàng giả, hàng nhái",
            "Không hỗ trợ khách hàng",
            "Tăng giá không hợp lý",
        ],
        product: [
            "Hàng giả, hàng nhái",
            "Hết hạn sử dụng",
            "Không đúng mô tả",
            "Lỗi kỹ thuật hoặc hư hỏng",
            "Giá không hợp lý",
            "Không đạt tiêu chuẩn chất lượng",
        ]
    };


    const [formData, setFormData] = useState({
        userId,
        operatorId,
        userType,
        reason: reasonOptions[userType]?.[0] || "",
        banStart: "",
        banEnd: "",
    });

    const [customReason, setCustomReason] = useState("");

    const [banStartDuration, setBanStartDuration] = useState("0"); //Default hiện tại
    const [customBanStartDate, setCustomBanStartDate] = useState("");
    const [customBanStartTime, setCustomBanStartTime] = useState("00:00");

    // banEnd
    const [banDuration, setBanDuration] = useState("7"); // Default 7 ngày
    const [customBanDate, setCustomBanDate] = useState("");
    const [customBanTime, setCustomBanTime] = useState("00:00");

    // Tính toán ngày bắt đầu ban
    const calculateBanStartDate = () => {
        let banStartDate;
        if (banStartDuration === "customStart" && customBanStartDate && customBanStartTime) {
            banStartDate = new Date(`${customBanStartDate}T${customBanStartTime}:00`);
        } else {
            const today = new Date();
            today.setDate(today.getDate() + Number.parseInt(banStartDuration));
            banStartDate = today;
        }

        // Format thành 'YYYY-MM-DD HH:mm:ss'
        const year = banStartDate.getFullYear();
        const month = String(banStartDate.getMonth() + 1).padStart(2, "0");
        const day = String(banStartDate.getDate()).padStart(2, "0");
        const hours = String(banStartDate.getHours()).padStart(2, "0");
        const minutes = String(banStartDate.getMinutes()).padStart(2, "0");
        const seconds = String(banStartDate.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Tính toán ngày hết hạn ban
    const calculateBanEndDate = () => {
        let banEndDate;

        if (banDuration === "custom" && customBanDate && customBanTime) {
            banEndDate = new Date(`${customBanDate}T${customBanTime}:00`);
        } else {
            const today = new Date();
            today.setDate(today.getDate() + Number.parseInt(banStartDuration) + Number.parseInt(banDuration));
            banEndDate = today;
        }

        // Format thành 'YYYY-MM-DD HH:mm:ss'
        const year = banEndDate.getFullYear();
        const month = String(banEndDate.getMonth() + 1).padStart(2, "0");
        const day = String(banEndDate.getDate()).padStart(2, "0");
        const hours = String(banEndDate.getHours()).padStart(2, "0");
        const minutes = String(banEndDate.getMinutes()).padStart(2, "0");
        const seconds = String(banEndDate.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleChangeReason = (e) => {
        setFormData({ ...formData, reason: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentTime = new Date();

        const finalBanStart = calculateBanStartDate();
        const finalBanEnd = calculateBanEndDate();

        const payload = {
            ...formData,
            banStart: finalBanStart,
            banEnd: finalBanEnd,
        };

        //Kiểm tra nếu banStart > banEnd
        if (new Date(finalBanStart).getTime() > new Date(finalBanEnd).getTime()) {
            notifications.show({
                title: "Lỗi!",
                message: "Thời gian bắt đầu không thể lớn hơn thời gian kết thúc!",
                color: "red",
            });
            return; // Dừng lại không tiếp tục gửi form
        }

        // Kiểm tra nếu banStart hoặc banEnd là thời gian trong quá khứ
        if (
            new Date(finalBanStart).getTime() + 1000 < currentTime ||
            new Date(finalBanEnd).getTime() + 1000 < currentTime
        ) {
            notifications.show({
                title: "Lỗi!",
                message: "Thời gian bắt đầu và kết thúc không thể là thời gian trong quá khứ!",
                color: "red",
            });
            return; // Dừng lại không tiếp tục gửi form
        }

        try {
            // Gọi service để thực hiện hành động ban tài khoản

            const response = await BanService.banUser(payload);
            if (response?.success) {

                if (userType === "shipper") {
                    queryClient.invalidateQueries(["shipper", userId]);
                    Navigate(`/main/shipperslist/${userId}`);
                } else if (userType === "shop") {
                    queryClient.invalidateQueries(["shop", userId]);
                    Navigate(`/main/shop/${userId}`);
                } else if (userType === "customer") {
                    queryClient.invalidateQueries(["user", userId]);
                    Navigate(`/main/user_detail/${userId}`);
                } else if (userType === "product") {
                    queryClient.invalidateQueries(["product", userId]);
                    Navigate(`/main/shops`);
                }
            } else {
                notifications.show({
                    title: "Lỗi!",
                    message: "Có lỗi xảy ra, vui lòng thử lại!",
                    color: "red",
                });
            }
        } catch (error) {
            console.error("Lỗi:", error);
            notifications.show({
                title: "Lỗi!",
                message: "Lỗi kết nối đến máy chủ",
                color: "red",
            });
        }
    };

    return (
        <div className="max-w-lg p-6 mx-auto mt-5 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-red-600">Đình Chỉ Người Dùng</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Các trường thông tin như trước */}
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium">
                        Tên người bị đình chỉ
                    </label>
                    <input
                        id="userId"
                        type="hidden"
                        value={formData.userId}
                        disabled
                        className="w-full p-2 bg-gray-200 border rounded"
                    />
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        disabled
                        className="w-full p-2 bg-gray-200 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="userType" className="block text-sm font-medium">
                        Loại tài khoản
                    </label>
                    <input
                        id="userType"
                        type="text"
                        value={formData.userType}
                        disabled
                        className="w-full p-2 bg-gray-200 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="operatorId" className="block text-sm font-medium">
                        Tên người đình chỉ
                    </label>
                    <input
                        id="operatorId"
                        type="hidden"
                        value={formData.operatorId}
                        disabled
                        className="w-full p-2 bg-gray-200 border rounded"
                    />
                    <input
                        id="operatorName"
                        type="text"
                        value={operatorName}
                        disabled
                        className="w-full p-2 bg-gray-200 border rounded"
                    />
                </div>

                {/* Lý do đình chỉ */}
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium">
                        Lý do đình chỉ
                    </label>
                    <select
                        id="reason"
                        name="reason"
                        onChange={(e) => {
                            setCustomReason(e.target.value);
                            handleChangeReason(e);
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="" disabled>
                            -- Chọn lý do --
                        </option>
                        {reasonOptions[userType]?.map((reason) => (
                            <option key={reason} value={reason}>
                                {reason}
                            </option>
                        ))}
                        <option value="custom">Lý do khác</option>
                    </select>
                    {customReason === "custom" && (
                        <input
                            type="text"
                            name="customReason"
                            value={formData.customReason}
                            onChange={(e) => {
                                handleChangeReason(e);
                            }}
                            placeholder="Nhập lý do khác"
                            className="w-full p-2 mt-2 border rounded"
                        />
                    )}
                </div>

                {/* Thời gian bắt đầu đình chỉ */}
                <div>
                    <label htmlFor="banStartTime" className="block text-sm font-medium">
                        Thời gian bắt đầu đình chỉ
                    </label>
                    <div className="flex gap-2">
                        {["0", "1", "7", "30", "customStart"].map((value) => (
                            <button
                                key={`value ${value}`}
                                type="button"
                                className={`px-4 py-2 rounded-lg border transition ${
                                    banStartDuration === value
                                        ? "bg-red-600 text-white border-red-600"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => setBanStartDuration(value)}
                            >
                                {value === "0" && "Hiện tại"}
                                {value === "1" && "1 ngày"}
                                {value === "7" && "7 ngày"}
                                {value === "30" && "1 tháng"}
                                {value === "customStart" && "Tùy chỉnh"}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Chọn ngày & giờ bắt đầu ban nếu tùy chỉnh */}
                {banStartDuration === "customStart" && (
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <label
                            htmlFor="customBanStartDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Chọn ngày & giờ
                        </label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label
                                    htmlFor="customBanStartDate"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Ngày
                                </label>
                                <input
                                    id="customBanStartDate"
                                    type="date"
                                    value={customBanStartDate}
                                    onChange={(e) => setCustomBanStartDate(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="customBanStartTime"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Giờ
                                </label>
                                <input
                                    id="customBanStartTime"
                                    type="time"
                                    value={customBanStartTime}
                                    onChange={(e) => setCustomBanStartTime(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Thời gian đình chỉ */}
                <div>
                    <label htmlFor="banTime" className="block text-sm font-medium">
                        Thời gian đình chỉ
                    </label>
                    <input id="banTime" disabled hidden />
                    <div className="flex gap-2">
                        {["1", "7", "15", "30", "90", "custom"].map((value) => (
                            <button
                                key={value}
                                type="button"
                                className={`px-4 py-2 rounded-lg border transition ${
                                    banDuration === value
                                        ? "bg-red-600 text-white border-red-600"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                                onClick={() => setBanDuration(value)}
                            >
                                {value === "1" && "1 ngày"}
                                {value === "7" && "7 ngày"}
                                {value === "15" && "15 ngày"}
                                {value === "30" && "1 tháng"}
                                {value === "90" && "3 tháng"}
                                {value === "custom" && "Tùy chỉnh"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chọn ngày & giờ nếu tùy chỉnh */}
                {banDuration === "custom" && (
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <label
                            htmlFor="customBanDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Chọn ngày & giờ
                        </label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label
                                    htmlFor="customBanDate"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Ngày
                                </label>
                                <input
                                    id="customBanDate"
                                    type="date"
                                    value={customBanDate}
                                    onChange={(e) => setCustomBanDate(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="customBanTime"
                                    className="text-sm font-medium text-gray-600"
                                >
                                    Giờ
                                </label>
                                <input
                                    id="customBanTime"
                                    type="time"
                                    value={customBanTime}
                                    onChange={(e) => setCustomBanTime(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Nút submit */}
                <button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                >
                    Đình chỉ
                </button>
            </form>
        </div>
    );
};

export default BanAccountForm;
