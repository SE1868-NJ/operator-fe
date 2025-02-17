import { Button } from "@mantine/core";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShipper } from "../hooks/useShippers";

const shippersData = [
    {
        id: 1,
        avatar: "/images/shipper1.jpg",
        name: "Nguyen A",
        gender: "Male",
        dateOfBirth: "1990-01-01",
        hometown: "Ha Noi",
        address: "123 Street, Ha Noi",
        phone: "0123456789",
        cccd: "123456789012",
        email: "0aM9X@example.com",
        status: "Active",
        activityArea: "Ha Noi",
        shippingMethod: "Xe máy",
        emergencyContact: {
            name: "Nguyen Van B",
            relation: "Anh trai",
            phone: "0912345678",
        },
    },
    {
        id: 2,
        avatar: "https://via.placeholder.com/50",
        name: "Nguyen B",
        gender: "Female",
        dateOfBirth: "1995-02-02",
        hometown: "Hai Phong",
        address: "456 Street, Hai Phong",
        phone: "0976543210",
        cccd: "098765432109",
        email: "V4r3t@example.com",
        status: "Deactive",
        activityArea: "Ha Noi",
        shippingMethod: "Xe máy",
        emergencyContact: {
            name: "Nguyen Van C",
            relation: "Mẹ",
            phone: "0909876543",
        },
    },
];

function formatDate(dateString) {
    const [year, month, day] = dateString.split("/");
    return `${day}/${month}/${year}`;
}

export default function ShipperDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { data: shipper, error } = useShipper(id);
    console.log(shipper);

    if (!shipper) {
        return <div className="text-center text-red-500">Shipper not found</div>;
    }

    const handleChangeStatus = (status) => {
        setIsLoading(true);
        fetch(`http://localhost:3000/shippers/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: status }),
        })
            .then(() => {
                setIsLoading(false);
                navigate("/main/shipperslist");
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className=" bg-white p-6">
            <h1 className="text-2xl font-bold mb-4">Thông tin người giao hàng</h1>
            <div className="flex flex-col items-center">
                <img
                    src={"/images/shipper1.jpg"}
                    alt={shipper.name}
                    className="w-24 h-24 rounded-full mb-4 border"
                />
                <h2 className="text-xl font-semibold">{shipper.name}</h2>
            </div>

            <div className=" p-4  mb-4 grid grid-cols-2 gap-4">
                <span className="font-bold">ID:</span>
                <span>{shipper.id}</span>
                <span className="font-bold">Giới tính:</span>
                <span>{shipper.gender}</span>
                <span className="font-bold">Ngày sinh:</span>
                <span>{shipper.dateOfBirth.split("T")[0]}</span>
                <span className="font-bold">Quê quán:</span>
                <span>{shipper.hometown}</span>
                <span className="font-bold">Địa chỉ:</span>
                <span>{shipper.address}</span>
                <span className="font-bold">SDT:</span>
                <span>{shipper.phone}</span>
                <span className="font-bold">CCCD:</span>
                <span>{shipper.cccd}</span>
                <span className="font-bold">Email:</span>
                <span>{shipper.email}</span>
                <span className="font-bold">Trạng thái:</span>
                <span>{shipper.status}</span>
                <span className="font-bold">Vị trí hoạt động:</span>
                <span>{shipper.activityArea}</span>
                <span className="font-bold">Phương tiện</span>
                <span>{shipper.shippingMethod}</span>
            </div>

            <h2 className="mt-6 font-bold text-lg">Liên lạc khẩn cấpcấp</h2>
            <div className=" p-4 mb-6 grid grid-cols-2 gap-4">
                <span className="font-bold">Họ và tên:</span>
                <span>{shipper.emergencyContact?.name}</span>
                <span className="font-bold">Mối quan hệ:</span>
                <span>{shipper.emergencyContact?.relation}</span>
                <span className="font-bold">SDT:</span>
                <span>{shipper.emergencyContact?.phone}</span>
            </div>

            <Button
                color={shipper?.status === "Active" ? "red" : "teal"}
                onClick={() =>
                    handleChangeStatus(shipper?.status === "Active" ? "Inactive" : "Active")
                }
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-t-2 border-b-2 border-red-500 rounded-full animate-spin" />
                        <span>Đang xử lý...</span>
                    </div>
                ) : null}
                {shipper?.status === "Active" ? "Dừng hoạt động" : "Kích hoạt"}
            </Button>
        </div>
    );
}
