import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const DetailRow = ({ label, value }) => (
    <div style={{ display: "flex", marginBottom: 12 }}>
        <div style={{ width: 200, fontWeight: 600, color: "#4a5568" }}>{label}:</div>
        <div style={{ color: "#2d3748" }}>{value}</div>
    </div>
);

const ShipperViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [shipper, setShipper] = useState(null);

    useEffect(() => {
        if (location.state?.operator) {
            setShipper(location.state.operator);
        } else {
            const data = {
                1: {
                    id: "1",
                    fullName: "Nguyễn Văn An",
                    gender: "Nam",
                    dateOfBirth: "01/01/2009",
                    hometown: "Hà Nội",
                    temporaryAddress: "Hà Nội",
                    cccd: "024123456789",
                    phoneNumber: "0923457789",
                    email: "nguyenvanan@gmail.com",
                    activityInformation: "Giao hàng chung cư Vincom Park Place",
                    shippingMethod: "Xe máy",
                    emergencyContact: {
                        name: "Nguyễn Văn Bảo",
                        relationship: "Bố",
                        phoneNumber: "0923987654",
                    },
                    photoUrl: "/images/shipper1.jpg",
                },
                2: {
                    id: "2",
                    fullName: "Trần Thị Bích",
                    gender: "Nữ",
                    dateOfBirth: "02/02/2008",
                    hometown: "Hà Nội",
                    temporaryAddress: "Hà Nội",
                    cccd: "024987654321",
                    phoneNumber: "0987654321",
                    email: "tranthibich@gmail.com",
                    activityInformation: "Giao hàng chung cư Keangnam Hanoi Landmark Tower",
                    shippingMethod: "Xe đạp",
                    emergencyContact: {
                        name: "Trần Thị Cúc",
                        relationship: "Mẹ",
                        phoneNumber: "0987123456",
                    },
                    photoUrl: "/images/shipper2.jpg",
                },
                3: {
                    id: "3",
                    fullName: "Lê Văn Cần",
                    gender: "Nam",
                    dateOfBirth: "03/03/2009",
                    hometown: "Hà Nội",
                    temporaryAddress: "Hà Nội",
                    cccd: "024456789123",
                    phoneNumber: "0912345678",
                    email: "levancan@gmail.com",
                    activityInformation: "Giao hàng chung cư Royal City",
                    shippingMethod: "Xe máy",
                    emergencyContact: {
                        name: "Lê Văn Dũng",
                        relationship: "Bố",
                        phoneNumber: "0912765432",
                    },
                    photoUrl: "/images/shipper3.jpg",
                },
            };

            const fallbackShipper = {
                id: "4",
                fullName: "Phạm Thị Dung",
                gender: "Nữ",
                dateOfBirth: "04/04/2008",
                hometown: "Hà Nội",
                temporaryAddress: "Hà Nội",
                cccd: "024789123456",
                phoneNumber: "0901234567",
                email: "phamthidung@gmail.com",
                activityInformation: "Giao hàng chung cư The Link Ciputra",
                shippingMethod: "Xe máy",
                emergencyContact: {
                    name: "Phạm Thị Vân",
                    relationship: "Mẹ",
                    phoneNumber: "0969876543",
                },
                photoUrl: "/images/shipper4.jpg",
            };

            setShipper(data[id] || fallbackShipper);
        }
    }, [id, location.state]);

    if (!shipper)
        return (
            <div style={{ textAlign: "center", marginTop: 40, fontSize: "1.25rem" }}>
                Loading...
            </div>
        );

    return (
        <div
            style={{
                maxWidth: 800,
                margin: "40px auto",
                padding: 30,
                backgroundColor: "#f7f9fc",
                fontFamily: "sans-serif",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 20,
                }}
            >
                Shipper Information
            </h1>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <img
                    src={shipper.photoUrl}
                    alt={shipper.fullName}
                    style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "4px solid #e2e8f0",
                    }}
                />
            </div>
            <div
                style={{
                    padding: 20,
                    backgroundColor: "#fff",
                    marginBottom: 20,
                }}
            >
                <DetailRow label="ID" value={shipper.id} />
                <DetailRow label="Full Name" value={shipper.fullName} />
                <DetailRow label="Gender" value={shipper.gender} />
                <DetailRow label="Date of Birth" value={shipper.dateOfBirth} />
                <DetailRow label="Hometown" value={shipper.hometown} />
                <DetailRow label="Temporary Address" value={shipper.temporaryAddress} />
                <DetailRow label="CCCD" value={shipper.cccd} />
                <DetailRow label="Phone" value={shipper.phoneNumber} />
                <DetailRow label="Email" value={shipper.email} />
                <DetailRow label="Activity" value={shipper.activityInformation} />
                <DetailRow label="Shipping Method" value={shipper.shippingMethod} />
            </div>
            <div
                style={{
                    padding: 15,
                    backgroundColor: "#edf2f7",
                    marginBottom: 20,
                }}
            >
                <h2
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#2d3748",
                        marginBottom: 10,
                    }}
                >
                    Emergency Contact
                </h2>
                <DetailRow label="Name" value={shipper.emergencyContact.name} />
                <DetailRow label="Relationship" value={shipper.emergencyContact.relationship} />
                <DetailRow label="Phone" value={shipper.emergencyContact.phoneNumber} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
                <button
                    type="button"
                    onClick={() => alert("Shipper registration accepted.")}
                    style={{
                        padding: "12px 25px",
                        border: "none",
                        borderRadius: 6,
                        fontSize: "1rem",
                        cursor: "pointer",
                        backgroundColor: "#48bb78",
                        color: "#fff",
                    }}
                >
                    Accept
                </button>
                <button
                    type="button"
                    onClick={() => alert("Shipper registration rejected.")}
                    style={{
                        padding: "12px 25px",
                        border: "none",
                        borderRadius: 6,
                        fontSize: "1rem",
                        cursor: "pointer",
                        backgroundColor: "#f56565",
                        color: "#fff",
                    }}
                >
                    Reject
                </button>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "12px 25px",
                        border: "none",
                        borderRadius: 6,
                        fontSize: "1rem",
                        cursor: "pointer",
                        backgroundColor: "#4299e1",
                        color: "#fff",
                    }}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ShipperViewPage;
