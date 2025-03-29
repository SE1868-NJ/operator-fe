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
import EmailService from "../services/Email.js";
import ShopService from "../services/ShopService";
import { useRef } from "react";

const PendingShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fieldToCheck = 
  [
    "Trạng thái hoạt động:",
      "Mã số thuế:",
      "Tên cửa hàng:",
      "Mô tả cửa hàng:",
      "Ảnh đại diện cửa hàng:",
      "Ảnh chụp cửa hàng:",
      "Số điện thoại cửa hàng:",
      "Email cửa hàng:",
      "Loại hình kinh doanh:",
      "Địa chỉ kinh doanh:",
      "Thời gian mở cửa:",
      "Số giấy phép kinh doanh:",
      "Ảnh giấy phép kinh doanh:",
      "Ngày gửi yêu cầu:",
      "Số tài khoản ngân hàng:",
      "Tên ngân hàng:",
];
  const length = fieldToCheck.length;

  const [draftData, setDraftData] = useState([]);
  const [isLoadData, setIsLoadData] = useState(true);
  const [changedValue, setChangedValue] = useState(
    Array(length).fill({
      status: "n",
      reason: "thông tin chưa kiểm tra",
    })
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
        if (Array.isArray(parsedData) && parsedData.length === length) {
          // Data is valid, use it
          setChangedValue(parsedData);
        } else {
          // Data is missing or invalid, use the default array
          setChangedValue(
            Array(length).fill({
              status: "n",
              reason: "thông tin chưa kiểm tra",
            })
          );
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setChangedValue(
          Array(length).fill({
            status: "n",
            reason: "thông tin chưa kiểm tra",
          })
        );
        notifications.show({
          color: "red",
          title: "Error parsing data",
          message: "Failed to parse shop details, using default values.",
        });
      }
    }
  }, [isLoadData, draftData, length]);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [openedDetail, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [onOpened, { open: onOpen, close: onClose }] = useDisclosure(false);
  const [openedZoom, {open: openZoom, close: closeZoom}] = useDisclosure(false);
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
  const [sendMailContent, setSendMailContent] = useState("");
  const [AILoading, setAILoading] = useState(false);
  const { data: operator } = useAccountProfile();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenReasonTable = (index) => {
    setDetailIndex(index);
    setFieldName(getFieldNameForIndex(index));
    openDetail();
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (openInput) {
      setTimeout(() => {
        textareaRef.current?.focus({ preventScroll: true });
      }, 100);
    }
  }, [openInput]);

  if (isLoadData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!shop) {
    return <div>Không tìm thấy thông tin cửa hàng.</div>;
  }

  const handleApproved = (status) => {
    const indexs = changedValue.filter((item) => item.status === "n");
    console.log("approved: ", indexs);
    const count = indexs.length;

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
              Vui lòng kiểm tra toàn bộ thông tin trước khi cập nhật thông tin
              xử lý.
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
        title: `${
          approvedStatus === "accepted" ? "Chấp nhận" : "Từ chối"
        } cửa hàng`,
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
      queryClient.invalidateQueries({ queryKey: ["indexReasonItem"] });
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
    await ShopService.updateIndexReasonItem(
      operator?.operatorID,
      id,
      index,
      reason,
      newStatus
    );
    queryClient.invalidateQueries({ queryKey: ["indexReasonItem"] });

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
    return fieldToCheck[index];
  };

  const getValueForIndex = (index) => {
    // Helper to get dynamic values
    switch (index) {
      case 0:
        return shop?.Owner?.status === "active"
          ? "Đang hoạt động"
          : "Đang khóa";
      case 1:
        return shop?.taxCode;
      case 2:
        return shop?.shopName;
      case 3:
        return (
          <p className="inline-block max-w-xs max-h-24 overflow-hidden overflow-y-auto text-ellipsis whitespace-normal">
            {shop?.shopDescription}
          </p>
        );
      case 4:
        return (
          <img
            onClick={() => zoomImage(shop?.shopAvatar)}
            className="w-24 h-24 rounded-full object-cover"
            src={shop?.shopAvatar}
            alt="Shop Avatar"
          />
        );
      case 5:
        return (
          <>
            {shop?.shopImage ? (
              <img
              onClick={() => zoomImage(shop?.shopImage)}
                className="w-48 h-32 object-cover rounded-md"
                src={
                  shop?.shopImage ||
                  "https://png.pngtree.com/png-clipart/20231003/original/pngtree-shop-cartoon-illustration-png-image_13083139.png"
                }
                alt="Ảnh của cửa hàng"
              />
            ) : (
              <p className="text-red-500 text-xl font-bold">Chưa có hình ảnh</p>
            )}
          </>
        );
      case 6:
        return shop?.shopPhone;
      case 7:
        return shop?.shopEmail;
      case 8:
        return shop?.businessType;
      case 9:
        return shop?.shopPickUpAddress;
      case 10:
        return shop?.shopOperationHours;
      case 11:
        return (
          shop?.businessLicenseNumber || (
            <p className="text-red-500 text-md font-semibold">
              Chưa có số giấy phép kinh doanh
            </p>
          )
        );
      case 12:
        return (
          <>
            {shop?.businessLicenseImage ? (
              <img
              onClick={() => zoomImage(shop?.businessLicenseImage)}
                className="w-48 h-32 object-cover rounded-md"
                src={
                  shop?.businessLicenseImage ||
                  "https://png.pngtree.com/png-clipart/20231003/original/pngtree-shop-cartoon-illustration-png-image_13083139.png"
                }
                alt="Shop Image"
              />
            ) : (
              <p className="text-red-500 text-xl font-bold">Chưa có hình ảnh</p>
            )}
          </>
        );
      case 13:
        return FormatDate(shop?.createdAt);
      case 14:
        return shop?.shopBankAccountNumber;
      case 15:
        return shop?.shopBankName;
      default:
        return null;
    }
  };

  const writeByAI = async () => {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyBT9W5ncWV1wD_6IpUYR6hsrnot1N-P3yo"
    );
    setAILoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const subject = await model.generateContent(`
                Viết duy nhất một dòng subject email bằng tiếng Việt với giọng điệu lịch sự, rõ ràng, 
                để yêu cầu người dùng cập nhật thông tin không chính xác đã sử dụng khi 
                đăng ký tài khoản cửa hàng mới. Từ thông tin: ${sendMailReason}
                `);
      const response = await subject.response;
      const text = await response.text();
      setSendMailReason(text);

      const content = await model.generateContent(`
                Please rewrite the following email without the subject in Vietnamese, requesting the user to update the incorrect information used to sign up for the new shop account. Include a polite tone and clear instructions for them to make the necessary corrections.
        From this information: ${sendMailReason}
                `);
      const responseContent = await content.response;
      const contentText = await responseContent.text();
      setSendMailContent(contentText);
    } catch (error) {
      console.log("Something Went Wrong!", error);
    }
    setAILoading(false);
  };

  const doSendMail = () => {
    try {
      EmailService.sendEmail(id, sendMailReason, sendMailContent);
      notifications.show({
        color: "green",
        title: "Thành công",
        message: "Email đã được gửi thành công",
      });
    } catch (error) {
      console.log("Something Went Wrong!", error);
      notifications.show({
        color: "red",
        title: "Lỗi",
        message: "Lỗi khi gửi email",
      });
    }
    onClose();
  };

  const FormatDate = (date) => {
    const olddate = new Date(date);
    const formattedDate = olddate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return <div>{formattedDate}</div>;
  };

  const isIncluded = (status) => {
    return changedValue.some(item => item.status === status);
  }

  const zoomImage = (src) => {
    setSelectedImage(src);
    openZoom();
  }
    
  return (
    <div className="w-5/6 mx-auto pb-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Cửa hàng: {shop?.shopName}
      </h1>
      <div className="rounded-lg p-4 md:p-10">
        <table className="table-auto bg-white w-full border-collapse">
          <tbody>
            <tr className="bg-gray-200 border-gray-600 border-b-[2px]">
              <td colSpan={4} className="text-center text-2xl font-bold py-2">
                Thông tin chủ cửa hàng
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Tên chủ cửa hàng:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {shop?.Owner?.fullName}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Ảnh chủ cửa hàng:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                <img
                  onClick={() => zoomImage(shop?.Owner?.avatar)}
                  className="w-24 h-24 rounded-full object-cover"
                  src={shop?.Owner?.avatar}
                  alt="Owner Avatar"
                />
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Email chủ cửa hàng:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {shop?.Owner?.userEmail}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Số điện thoại:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {shop?.Owner?.userPhone}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Ngày sinh:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {new Date(shop?.Owner?.dateOfBirth).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Giới tính:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {shop?.Owner?.gender === "female"
                  ? "Nữ"
                  : shop?.Owner?.gender === "male"
                  ? "Nam"
                  : "Khác"}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Địa chỉ thường trú:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {shop?.Owner?.userAddress}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Số CMND/CCCD:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                {shop?.Owner?.identificationNumber}
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Ảnh mặt trước CMND/CCCD:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                <img
                    onClick={() => zoomImage(shop?.Owner?.idCardFrontFile)}
                  className="w-48 h-32 object-cover rounded-md"
                  src={shop?.Owner?.idCardFrontFile}
                  alt="ID Card Front File"
                />
              </td>
            </tr>
            <tr className="border-gary-200 border-x-0 border-t-0 border-[2px] items-center hover:bg-blue-100">
              <th className="px-4 py-2 text-left font-bold text-gray-800">
                Ảnh mặt sau CMND/CCCD:
              </th>
              <td colSpan={3} className="py-2 text-gray-900">
                <img
                    onClick={() => zoomImage(shop?.Owner?.idCardBackFile)}
                  className="w-48 h-32 object-cover rounded-md"
                  src={shop?.Owner?.idCardBackFile}
                  alt="ID Card Front File"
                />
              </td>
            </tr>
            <tr>
              <td
                colSpan={4}
                className="text-center bg-gray-200 border-y-[2px] border-gray-600 text-2xl font-bold py-4"
              >
                Thông tin cửa hàng
              </td>
            </tr>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
              (index) => (
                <tr
                  key={index}
                  className={`border-gray-200 border-x-0 border-t-0 border-[2px] items-center ${getColor(
                    changedValue[index]?.status
                  )} hover:bg-blue-100`}
                >
                  <th className="px-4 py-2 text-left font-bold text-gray-800">
                    {
                      fieldToCheck[index]
                    }
                  </th>
                  <td className="py-2 text-gray-900">
                    {getValueForIndex(index)}
                  </td>

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
                          ref={textareaRef}
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
              )
            )}
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
          <Button color="green" disabled={isIncluded("n") || isIncluded("x")} onClick={() => handleApproved("accepted")}>
            Chấp nhận
          </Button>
          <Button disabled={isIncluded("n") || !isIncluded("x")} color="red" onClick={() => handleApproved("rejected")}>
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
              {changedValue?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
                >
                  <div
                    className={`flex flex-col p-2 rounded-lg ${getColor(
                      item.status
                    )}`}
                  >
                    <strong className="text-lg">
                      {getFieldNameForIndex(index)} {getValueForIndex(index)}
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
              ))}
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
        <p className="font-bold text-xl text-gray-800 mb-6">
          Nhập nội dung mail
        </p>
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
              )
          )}
        </div>
        <div>
          <p className="font-bold text-lg text-gray-800 my-2">
            Lý do gửi mail:
          </p>
        </div>
        <input
          type="text"
          value={sendMailReason}
          onChange={(e) => setSendMailReason(e.target.value)}
          placeholder="Nhập lý do gửi mail..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
        />
        <Textarea
          value={sendMailContent}
          rows={10}
          cols={100}
          className="mt-4"
          onChange={(e) => setSendMailContent(e.target.value)} // Cập nhật lý do khi người dùng nhập
        />
        <div className="flex justify-end mt-4">
          <Button
            color="green"
            loading={AILoading}
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
      <Modal
        opened={openedZoom}
        size="xl"
        padding="xl"
        onClose={closeZoom}
        withCloseButton={false}
        centered
      >
        <div className="w-full h-full flex justify-center items-center">
          <img src={selectedImage} alt="Zoom image" />
        </div>
      </Modal>
    </div>
  );
};

export default PendingShopDetail;
