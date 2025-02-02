import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const shippersData = [
    { id: 1, name: "Nguyen A", status: "Active", deliveries: 150, date: "2025-02-01" },
    { id: 2, name: "Nguyen B", status: "Deactive", deliveries: 120, date: "2025-01-25" },
    { id: 3, name: "Nguyen C", status: "Active", deliveries: 200, date: "2025-01-30" },
];

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
            <p>
                <strong>ID:</strong> {shipper.id}
            </p>
            <p>
                <strong>Họ tên:</strong> {shipper.name}
            </p>
            <p>
                <strong>Status:</strong> {shipper.status}
            </p>
            <p>
                <strong>Số lần giao hàng:</strong> {shipper.deliveries}
            </p>
            <p>
                <strong>Ngày tham gia:</strong> {shipper.date}
            </p>

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
