import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const shippersData = [
    {
        id: 1,
        avatar: "https://via.placeholder.com/50",
        name: "Nguyen A",
        gender: "Male",
        birth: "1990-01-01",
        hometown: "Ha Noi",
        address: "123 Street, Ha Noi",
        phone: "0123456789",
        cccd: "123456789012",
        status: "Active",
        deliveries: 150,
        date: "2025-02-01",
        activityArea: "Ha Noi",
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
        birth: "1990-01-20",
        hometown: "Hai Phong",
        address: "456 Street, Hai Phong",
        phone: "0976543210",
        cccd: "098765432109",
        status: "Deactive",
        deliveries: 120,
        date: "2025-01-25",
        activityArea: "Ha Noi",
        emergencyContact: {
            name: "Nguyen Van C",
            relation: "Mẹ",
            phone: "0909876543",
        },
    },
];

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
}

export default function ShipperDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const shipper = shippersData.find((s) => s.id === Number.parseInt(id));

    if (!shipper) {
        return <div className="text-center text-red-500">Shipper not found</div>;
    }

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Shipper Details</h1>
            <div className="flex flex-col items-center">
                <img
                    src={shipper.avatar}
                    alt={shipper.name}
                    className="w-24 h-24 rounded-full mb-4 border shadow"
                />
                <h2 className="text-xl font-semibold">{shipper.name}</h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 grid grid-cols-2 gap-4">
                <span className="font-bold">ID:</span>
                <span>{shipper.id}</span>
                <span className="font-bold">Gender:</span>
                <span>{shipper.gender}</span>
                <span className="font-bold">Date of Birth:</span>
                <span>{formatDate(shipper.birth)}</span>
                <span className="font-bold">Hometown:</span>
                <span>{shipper.hometown}</span>
                <span className="font-bold">Address:</span>
                <span>{shipper.address}</span>
                <span className="font-bold">Phone:</span>
                <span>{shipper.phone}</span>
                <span className="font-bold">CCCD:</span>
                <span>{shipper.cccd}</span>
                <span className="font-bold">Deliveries:</span>
                <span>{shipper.deliveries}</span>
                <span className="font-bold">Join Date:</span>
                <span>{formatDate(shipper.date)}</span>
                <span className="font-bold">Activity Area:</span>
                <span>{shipper.activityArea}</span>
            </div>

            <h2 className="mt-6 font-bold text-lg">Emergency Contact</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4">
                <span className="font-bold">Name:</span>
                <span>{shipper.emergencyContact.name}</span>
                <span className="font-bold">Relationship:</span>
                <span>{shipper.emergencyContact.relation}</span>
                <span className="font-bold">Phone:</span>
                <span>{shipper.emergencyContact.phone}</span>
            </div>

            <button
                type="button"
                className="mt-4 bg-blue-500 text-white p-2 rounded"
                onClick={() => navigate("/shipperslist")}
            >
                Back to List
            </button>
        </div>
    );
}
