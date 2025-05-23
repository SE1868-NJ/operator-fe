import { Button, Group, Modal, Text, Textarea } from "@mantine/core";
import { NavigationProgress, nprogress } from "@mantine/nprogress";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccountProfile } from "../../hooks/useAccountProfile.js";
import { useUserById } from "../../hooks/useUser";
import BanService from "../../services/BanService";
import CustomerDashboardChart from "./CustomerDashboardChart.jsx";
import CustomerOrderList from "./CustomerOrderList.jsx";

const UserDetail = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [unbantModalOpen, setUnbanModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  // Fetch user data
  const { data: user, isLoading, error } = useUserById(id);
  const {
    data: operatorData,
    isLoadingOperator,
    errorOperator,
  } = useAccountProfile();

  //   console.log(user)

  const [banInfo, setBanInfo] = useState(null);
  useEffect(() => {
    const fetchBanInfo = async () => {
      if (!user?.userID) return;

      try {
        const isUserBan = await BanService.getBanAccount(
          user.userID,
          "customer"
        );
        if (isUserBan) {
          setBanInfo(isUserBan);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin ban:", error);
      }
    };

    fetchBanInfo();
  }, [user?.userID]);

  console.log(banInfo);

  if (isLoading || isLoadingOperator) return <p>Loading...</p>;
  if (error || errorOperator) return <p>Error loading user data</p>;

  const handleStatusChange = async () => {
    if (user?.status === "active" && !banInfo) {
      // Điều hướng đến trang đình chỉ, truyền userId & operatorId qua URL
      Navigate(
        `/main/ban_account?userId=${user.userID}&userName=${user.fullName}&operatorId=${operatorData.operatorID}&accountType=customer`
      ); // sau này chỉnh lại thành operatorID
    } else {
      if (banInfo?.status === "banned") {
        //nprogress.start();
        await BanService.unbanAccountManually(user.userID, "customer", reason);

        //setUnbanModalOpen(false);
        //nprogress.complete();

        // if (confirmUnban) {
        //     // Nếu người dùng nhấn "OK", tiến hành gỡ ban
        //     await BanService.unbanAccountManually(user.userID);
        //     window.location.reload();
        // }
      } else if (banInfo?.status === "scheduled") {
        await BanService.cancelBanScheduled(user.userID, "customer", reason);
      }
      window.location.reload();
    }
    queryClient.invalidateQueries(["users"]); // Invalidate cache danh sách users
    queryClient.invalidateQueries(["exportUsers"]); // Invalidate cache danh sách users cho việc export excel
  };

  return (
    <div className="flex items-center justify-center pt-10">
      <div className="container  px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <img
              className="w-40 h-40 mx-auto rounded-full"
              src={
                user.avatar ||
                "https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg"
              }
              alt={`${user.fullName}'s avatar`}
            />
            <h5 className="mt-4 text-lg font-semibold">{user.fullName}</h5>
            <h6 className="text-sm text-gray-500">{user.userEmail}</h6>
            <div className="mt-6">
              {/* <h5 className="text-lg font-semibold">Trạng thái</h5> */}
              <div
                className={`inline-block mt-2 px-4 py-1 text-sm font-semibold rounded-full ${
                  user?.status === "active"
                    ? "bg-green-100 text-green-700 border-green-500"
                    : user?.status === "suspended"
                    ? "bg-yellow-100 text-yellow-700 border-yellow-500"
                    : "bg-red-100 text-red-700 border-red-500"
                }`}
              >
                {user?.status === "active" ? "Hoạt động" : "Đình chỉ"}
              </div>

              {/* Nếu status là "Hoạt động", hiển thị thêm thời gian đặt lịch ban */}
              {user?.status === "active" && banInfo && (
                <div className="mt-3 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded-md shadow-md">
                  <div className="text-sm text-yellow-800 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-bold">
                        &#x26A0;
                      </span>
                      <span>Tài khoản của bạn sẽ bị đình chỉ từ:</span>
                      <span className="font-semibold text-yellow-900">
                        {new Date(banInfo.banStart).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 font-bold">
                        &#x26A0;
                      </span>
                      <span>Tài khoản của bạn sẽ bị đình chỉ đến:</span>
                      <span className="font-semibold text-yellow-900">
                        {new Date(banInfo.banEnd).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded-md">
                    <p className="text-sm text-yellow-700">
                      <span className="font-semibold">⚠ Lý do: </span>{" "}
                      {banInfo.reason}
                    </p>
                  </div>
                </div>
              )}

              {/* Nếu status là "Đình chỉ", hiển thị thêm thời gian ban */}
              {user?.status === "suspended" && banInfo && (
                <div className="mt-3 p-3 bg-red-100 border-l-4 border-red-500 rounded-md shadow-md">
                  <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                    <span className="text-red-600 font-bold">&#x21;</span>
                    <span>Tài khoản bị đình chỉ đến:</span>
                    <span className="font-semibold text-red-900">
                      {new Date(banInfo.banEnd).toLocaleString("vi-VN")}
                    </span>
                  </p>
                  <div className="mt-2 p-2 bg-red-50 border border-red-300 rounded-md">
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
                <span className="font-medium text-amber-700">
                  Mã khách hàng:
                </span>{" "}
                {user.userID}
              </div>
              <div>
                <span className="font-medium text-amber-700">
                  Tên khách hàng:
                </span>{" "}
                {user.fullName}
              </div>
              <div>
                <span className="font-medium text-amber-700">Email:</span>{" "}
                {user.userEmail}
              </div>
              <div>
                <span className="font-medium text-amber-700">Giới tính:</span>{" "}
                {user.gender}
              </div>
              <div>
                <span className="font-medium text-amber-700">Ngày sinh:</span>{" "}
                {new Date(user.dateOfBirth).toLocaleDateString("vi-VN")}
              </div>
              <div>
                <span className="font-medium text-amber-700">Quê quán:</span>{" "}
                {user.userAddress}
              </div>
              <div>
                <span className="font-medium text-amber-700">SĐT:</span>{" "}
                {user.userPhone}
              </div>
              <div>
                <span className="font-medium text-amber-700">
                  Mã thẻ chung cư:
                </span>{" "}
                {user.userCitizenID}
              </div>
              <div>
                <span className="font-medium text-amber-700">CCCD:</span>{" "}
                {user.identificationNumber}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Căn cước công dân (CCCD):
              </h3>
              <div className="flex gap-4 mt-2">
                <div className="relative">
                  {" "}
                  {/* Added relative wrapper for positioning */}
                  <img
                    src={user.idCardFrontFile}
                    alt="Mặt trước CCCD"
                    className="w-32 h-20 border cursor-pointer"
                    onClick={() => setSelectedImage(user.idCardFrontFile)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedImage(user.idCardFrontFile);
                    }}
                    aria-label="CCCD Mặt trước" // Add an accessible label
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                    Mặt trước
                  </span>{" "}
                  {/* Added label */}
                </div>
                <div className="relative">
                  {" "}
                  {/* Added relative wrapper for positioning */}
                  <img
                    src={user.idCardBackFile}
                    alt="Mặt sau CCCD"
                    className="w-32 h-20 border cursor-pointer"
                    onClick={() => setSelectedImage(user.idCardBackFile)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSelectedImage(user.idCardBackFile);
                    }}
                    aria-label="CCCD Mặt sau" // Add an accessible label
                  />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                    Mặt sau
                  </span>{" "}
                  {/* Added label */}
                </div>
              </div>
            </div>

            {selectedImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
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
                  className="max-w-full max-h-full p-4 bg-white shadow-lg rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center justify-center mt-6 space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (user?.status === "active" && !banInfo) {
                    handleStatusChange();
                  } else if (
                    banInfo?.status === "banned" ||
                    banInfo?.status === "scheduled"
                  ) {
                    setUnbanModalOpen(true);
                  }
                }}
                className={`${
                  user?.status === "active" && !banInfo
                    ? "bg-yellow-500 hover:bg-yellow-700 text-white"
                    : banInfo?.status === "banned"
                    ? "bg-green-500 hover:bg-green-700 text-white"
                    : "bg-blue-500 hover:bg-blue-700 text-white" // Nếu là "Không hoạt động"
                } px-4 py-2 rounded`}
              >
                {
                  user?.status === "active" && !banInfo
                    ? "Đình chỉ người dùng"
                    : banInfo?.status === "banned"
                    ? "Gỡ đình chỉ người dùng"
                    : "Hủy lịch đình chỉ người dùng" // Nếu là "Không hoạt động"
                }
              </button>
              <button
                type="button"
                onClick={() => {
                  Navigate("/main/users");
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-6 md:flex-row">
          <div className="w-full md:w-1/2">
            <CustomerDashboardChart id={user?.userID} />
          </div>
          <div className="w-full md:w-1/2">
            <CustomerOrderList id={user?.userID} />
          </div>
        </div>
      </div>
      {/* Modal xác nhận gỡ ban người dùng */}
      <Modal
        opened={unbantModalOpen}
        onClose={() => setUnbanModalOpen(false)}
        title="Xác nhận"
      >
        <Text>Bạn có chắc chắn muốn gỡ đình chỉ người dùng này?</Text>
        <Textarea
          label="Lý do gỡ đình chỉ"
          placeholder="Nhập lý do..."
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          mt="md"
          required
        />
        <Group position="right" mt="md">
          <Button variant="default" onClick={() => setUnbanModalOpen(false)}>
            Hủy
          </Button>
          <Button color="green" onClick={handleStatusChange}>
            Xác nhận
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default UserDetail;
