import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAccountProfile } from "../hooks/useAccountProfile.js";
import BanService from "../services/BanService";

const BanAccountForm = () => {
    const { data, isLoading, error } = useAccountProfile();
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
    };

    const [formData, setFormData] = useState({
        userId,
        operatorId,
        userType,
        reason: "Bùng hàng nhiều lần",
        banEnd: "",
    });

    const [customReason, setCustomReason] = useState("");

    const [banDuration, setBanDuration] = useState("7"); // Default 7 ngày
    const [customBanDate, setCustomBanDate] = useState("");
    const [customBanTime, setCustomBanTime] = useState("00:00");

    // Tính toán ngày hết hạn ban
    const calculateBanEndDate = () => {
        let banEndDate;

        if (banDuration === "custom" && customBanDate && customBanTime) {
            banEndDate = new Date(`${customBanDate}T${customBanTime}:00`);
        } else {
            const today = new Date();
            today.setDate(today.getDate() + Number.parseInt(banDuration));
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
        const finalBanEnd = calculateBanEndDate();

        const payload = {
            ...formData,
            banEnd: finalBanEnd,
        };

        try {
            // Gọi service để thực hiện hành động ban tài khoản
            const response = await BanService.banUser(payload);
            if (response?.success) {
                alert("Đình chỉ thành công!");

                // xóa cache và refetch dữ liệu user
                queryClient.invalidateQueries(["user", userId]);
                Navigate(`/main/user_detail/${userId}`);
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Lỗi kết nối đến server!");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-5">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Đình Chỉ Người Dùng</h2>
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
                        className="w-full p-2 border rounded bg-gray-200"
                    />
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        disabled
                        className="w-full p-2 border rounded bg-gray-200"
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
                        className="w-full p-2 border rounded bg-gray-200"
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
                        className="w-full p-2 border rounded bg-gray-200"
                    />
                    <input
                        id="operatorName"
                        type="text"
                        value={operatorName}
                        disabled
                        className="w-full p-2 border rounded bg-gray-200"
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
                            className="w-full p-2 border rounded mt-2"
                        />
                    )}
                </div>

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
                    className="w-full bg-red-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
                >
                    Đình chỉ
                </button>
            </form>
        </div>
    );
};

export default BanAccountForm;
