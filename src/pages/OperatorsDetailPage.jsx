import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OperatorsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [operator, setOperator] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchedOperator = {
            id,
            name: id === "1" ? "NgaNT" : "HongHV",
            email: id === "1" ? "ngant@gmail.com" : "honghv@gmail.com",
            role: "Operator",
            status: "Active",
        };
        setOperator(fetchedOperator);
        setName(fetchedOperator.name);
        setEmail(fetchedOperator.email);
        setStatus(fetchedOperator.status);
    }, [id]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setOperator((prevState) => ({
            ...prevState,
            name,
            email,
            status,
        }));
        setIsEditing(false);
    };

    if (!operator) return <div>Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">{operator.name} - Details</h1>
            <div className="mb-6">
                <p>
                    <span className="font-semibold">ID:</span> {operator.id}
                </p>
                <p>
                    <span className="font-semibold">Role:</span> {operator.role}
                </p>

                {isEditing ? (
                    <>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2 font-semibold">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full p-2 border rounded"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 font-semibold">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full p-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block mb-2 font-semibold">
                                Status
                            </label>
                            <select
                                id="status"
                                className="w-full p-2 border rounded"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </>
                ) : (
                    <>
                        <p>
                            <span className="font-semibold">Name:</span> {operator.name}
                        </p>
                        <p>
                            <span className="font-semibold">Email:</span> {operator.email}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span> {operator.status}
                        </p>
                    </>
                )}
            </div>

            <div className="text-center flex justify-center gap-4">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            className="px-6 py-2 bg-green-500 text-white rounded-md"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-500 text-white rounded-md"
                            onClick={handleEditToggle}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="px-6 py-2 bg-yellow-500 text-white rounded-md"
                        onClick={handleEditToggle}
                    >
                        Edit
                    </button>
                )}

                <button
                    type="button"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => navigate(-1)} // Quay tro lai trang truoc
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default OperatorsDetailPage;
