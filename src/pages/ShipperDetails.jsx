import { Button, Modal, Select, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShipper } from "../hooks/useShippers";
import BanService from "../services/BanService";
// import ShipperDashboardChart from "./ShipperDashboardChart";
import ShipperOrdersList from "./ShipperOrdersList";
import { Suspense } from "react";

function translateStatus(status) {
  const statusMap = {
    active: "Đang hoạt động",
    pending: "Đang duyệt",
    inactive: "Dừng hoạt động",
    suspended: "Đình chỉ",
  };
  return statusMap[status] || status;
}

function translateGender(gender) {
  const genderMap = {
    male: "Nam",
    female: "Nữ",
    other: "Khác",
  };
  return genderMap[gender] || gender;
}

export default function ShipperDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [deactivationDuration, setDeactivationDuration] = useState("1 tháng");
  const [customDate, setCustomDate] = useState(null);
  const [deactivationDate, setDeactivationDate] = useState(null);
  const [opened, setOpened] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { data: shipper, error } = useShipper(id);

  

  const queryClient = useQueryClient();
  const [banInfo, setBanInfo] = useState(null);

  useEffect(() => {
    const fetchBanInfo = async () => {
      if (!shipper?.id) return;

      try {
        const isUserBan = await BanService.getBanAccount(shipper.id, "shipper");
        if (isUserBan) {
          setBanInfo(isUserBan);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin ban:", error);
      }
    };

    fetchBanInfo();
  }, [shipper?.id]);

  if (!shipper) {
    return (
      <div className="text-center text-red-500">Không tìm thấy shipper</div>
    );
  }

  const handleChangeStatus = async (status) => {
    if (status === "inactive") {
      navigate(
        `/main/ban_account?userId=${shipper.id}&operatorId=1&accountType=shipper`
      );
    } else {
      const confirmUnban = window.confirm(
        "Bạn có muốn gỡ đình chỉ tài khoản này không?"
      );

      if (confirmUnban) {
        queryClient.setQueryData(["shipper", id], (oldData) => ({
          ...oldData,
          status: "Active",
        }));

        // Nếu người dùng nhấn "OK", tiến hành gỡ ban
        await BanService.unbanAccountManually(shipper.id).then(() => {
          queryClient.invalidateQueries(["shipper", id]);
          queryClient.invalidateQueries(["shipper"]);
        });
      }
    }
  };

  const handleConfirmDeactivation = () => {
    setIsLoading(true);
    const requestBody = {
      status: "Deactive",
      deactivationReason,
      deactivationDuration:
        deactivationDuration === "Tùy chỉnh"
          ? customDate
          : deactivationDuration,
    };

    fetch(`http://localhost:3000/shipperslist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then(() => {
        setIsLoading(false);
        setOpened(false);
        navigate("/main/shipperslist");
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className="flex items-center justify-center pt-10">
      <div className="container px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <img
              className="w-40 h-40 mx-auto rounded-full"
              src="/images/shipper1.jpg"
              alt={shipper.name}
            />
            <h6 className="mt-4 text-sm text-gray-500">ID: {shipper.id}</h6>
            <h5 className="mt-4 text-lg font-semibold">{shipper.name}</h5>
            <h6 className="text-sm text-gray-500">{shipper.email}</h6>
            <div className="mt-6">
              <div
                className={`inline-block px-2 py-1 rounded-md text-sm font-semibold ${
                  shipper.status === "active"
                    ? "text-green-700 bg-green-100 border-green-500"
                    : shipper.status === "pending"
                    ? "text-yellow-700 bg-yellow-100 border-yellow-500"
                    : shipper.status === "suspended"
                    ? "text-orange-700 bg-orange-100 border-orange-500"
                    : "text-red-700 bg-red-100 border-red-500"
                }`}
              >
                {translateStatus(shipper.status)}
              </div>

              {/* Nếu shipper bị đình chỉ, hiển thị thông tin đình chỉ trong một khối riêng biệt */}
              {shipper.status === "suspended" && banInfo && (
                <div className="p-3 mt-3 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
                  <p className="flex items-center gap-2 text-sm font-medium text-red-800">
                    <span className="font-bold text-red-600">&#x21;</span>
                    <span>Tài khoản bị đình chỉ đến:</span>
                    <span className="font-semibold text-red-900">
                      {new Date(banInfo.banEnd).toLocaleString("vi-VN")}
                    </span>
                  </p>
                  <div className="p-2 mt-2 border border-red-300 rounded-md bg-red-50">
                    <p className="text-sm text-red-700">
                      <span className="font-semibold">Lý do: </span>{" "}
                      {banInfo.reason}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
            <h5 className="mb-4 font-semibold text-blue-500">
              Thông tin cá nhân
            </h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="font-bold text-amber-700">Giới tính:</span>{" "}
                {translateGender(shipper.gender)}
              </div>
              <div>
                <span className="font-bold text-amber-700">Ngày sinh:</span>{" "}
                {shipper.dateOfBirth}
              </div>
              <div>
                <span className="font-bold text-amber-700">Quê quán:</span>{" "}
                {shipper.hometown}
              </div>
              <div>
                <span className="font-bold text-amber-700">Địa chỉ:</span>{" "}
                {shipper.address}
              </div>
              <div>
                <span className="font-bold text-amber-700">SĐT:</span>{" "}
                {shipper.phone}
              </div>
              <div>
                <span className="font-bold text-amber-700">
                  Vị trí hoạt động:
                </span>{" "}
                {shipper.activityArea}
              </div>
              <div>
                <span className="font-bold text-amber-700">Phương tiện:</span>{" "}
                {shipper.shippingMethod}
              </div>
              <div>
                <span className="font-bold text-amber-700">CCCD:</span>{" "}
                {shipper.cccd}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-bold">Ảnh căn cước công dân (CCCD):</h3>
              <div className="flex gap-4 mt-2">
                <div className="relative">
                  {" "}
                  {/* Added relative wrapper for positioning */}
                  <img
                    src={
                      "https://image.tinnhanhchungkhoan.vn/w660/Uploaded/2025/WpxlCdjwi/2014_03_17/20_RKNL.jpg"
                    }
                    alt="Mặt trước CCCD"
                    className="w-32 h-20 border cursor-pointer"
                    onClick={() => setSelectedImage(shipper.idCardFrontFile)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedImage(shipper.idCardFrontFile);
                    }}
                    aria-label="CCCD Mặt trước" // Add an accessible label
                  />
                  <span className="absolute px-1 text-xs text-white bg-black bg-opacity-50 rounded bottom-2 left-2">
                    Mặt trước
                  </span>{" "}
                  {/* Added label */}
                </div>
                <div className="relative">
                  {" "}
                  {/* Added relative wrapper for positioning */}
                  <img
                    src={
                      "https://cafefcdn.com/thumb_w/640/203337114487263232/2022/9/12/photo1662955465034-1662955465094777553497.jpg"
                    }
                    alt="Mặt sau CCCD"
                    className="w-32 h-20 border cursor-pointer"
                    onClick={() => setSelectedImage(shipper.idCardBackFile)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedImage(shipper.idCardBackFile);
                    }}
                    aria-label="CCCD Mặt sau" // Add an accessible label
                  />
                  <span className="absolute px-1 text-xs text-white bg-black bg-opacity-50 rounded bottom-2 left-2">
                    Mặt sau
                  </span>{" "}
                  {/* Added label */}
                </div>
              </div>
            </div>

            {selectedImage && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setSelectedImage(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setSelectedImage(null);
                }}
                aria-label="Xem ảnh CCCD" // Add an accessible label
              >
                <img
                  src={selectedImage}
                  alt="Ảnh CCCD"
                  className="max-w-full max-h-full p-4 bg-white rounded-lg shadow-lg"
                />
              </div>
            )}

            <h6 className="mt-6 mb-4 font-semibold text-blue-500">
              Liên lạc khẩn cấp
            </h6>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="font-bold">Họ và tên:</span>{" "}
                {shipper?.EmergencyContact?.name || "N/A"}
              </div>
              <div>
                <span className="font-bold">Mối quan hệ:</span>{" "}
                {shipper?.EmergencyContact?.relation || "N/A"}
              </div>
              <div>
                <span className="font-bold">SĐT:</span>{" "}
                {shipper?.EmergencyContact?.phone || "N/A"}
              </div>
            </div>
            <div className="flex items-center justify-center mt-6 space-x-4">
              <div className="text-left">
                <Button
                  color={shipper?.status === "active" ? "red" : "teal"}
                  onClick={() =>
                    handleChangeStatus(
                      shipper?.status === "active" ? "inactive" : "active"
                    )
                  }
                >
                  {isLoading ? (
                    <span>Đang xử lý...</span>
                  ) : shipper?.status === "active" ? (
                    "Dừng hoạt động"
                  ) : (
                    "Kích hoạt"
                  )}
                </Button>
              </div>
              <div className="text-right">
                <Button onClick={() => navigate("/main/shipperslist")}>
                  Quay lại
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-6 md:flex-row">
          <div className="w-full ">
            <ShipperOrdersList shipperId={shipper.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
