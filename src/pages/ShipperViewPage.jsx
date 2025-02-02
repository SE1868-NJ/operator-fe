import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ShipperViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [shipper, setShipper] = useState(null);

    useEffect(() => {
        if (location.state?.operator) {
            setShipper(location.state.operator);
        } else {
            const fetchedShipper = {
                id,
                name:
                    id === "1" ? "TamNV" : id === "2" ? "TrangTT" : id === "3" ? "HoaVT" : "TramNT",
                email:
                    id === "1"
                        ? "tamnv@gmail.com"
                        : id === "2"
                          ? "trangtt@gmail.com"
                          : id === "3"
                            ? "hoavt@gmail.com"
                            : "tramnt@gmail.com",
                role: "Shipper",
                status: "Pending",
            };
            setShipper(fetchedShipper);
        }
    }, [id, location.state]);

    const handleAccept = () => {
        alert("Shipper registration accepted.");
    };

    const handleRefuse = () => {
        alert("Shipper registration refused.");
    };

    if (!shipper) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">Shipper Information</h1>
            <div className="mb-6">
                <p>
                    <span className="font-semibold">ID:</span> {shipper.id}
                </p>
                <p>
                    <span className="font-semibold">Name:</span> {shipper.name}
                </p>
                <p>
                    <span className="font-semibold">Email:</span> {shipper.email}
                </p>
                <p>
                    <span className="font-semibold">Role:</span> {shipper.role}
                </p>
                <p>
                    <span className="font-semibold">Status:</span> {shipper.status}
                </p>
            </div>
            <div className="flex justify-center gap-4">
                <button
                    type="button"
                    className="px-6 py-2 bg-green-500 text-white rounded-md"
                    onClick={handleAccept}
                >
                    Accept
                </button>
                <button
                    type="button"
                    className="px-6 py-2 bg-red-500 text-white rounded-md"
                    onClick={handleRefuse}
                >
                    Refuse
                </button>
                <button
                    type="button"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ShipperViewPage;
