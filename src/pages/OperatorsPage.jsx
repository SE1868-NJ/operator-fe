import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const OperatorsPage = () => {
    const [operators, setOperators] = useState([
        {
            id: 1,
            name: "NgaNT",
            email: "ngant@gmail.com",
            role: "Operator",
            status: "Active",
        },
        {
            id: 2,
            name: "HongHV",
            email: "honghv@gmail.com",
            role: "Operator",
            status: "Deactive",
        },
    ]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentOperator, setCurrentOperator] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    // Add Operator
    const handleAddOperator = () => {
        setCurrentOperator(null);
        setModalOpen(true);
    };

    const handleViewDetails = (operator) => {
        navigate(`/main/operators/${operator.id}`, { state: { operator } }); // Pass operator to state for use in detail page
    };

    const onSubmit = (data) => {
        if (currentOperator) {
            setOperators((prev) =>
                prev.map((op) =>
                    op.id === currentOperator.id ? { ...op, ...data, role: "Operator" } : op,
                ),
            );
            alert("Operator updated successfully");
        } else {
            setOperators((prev) => [
                ...prev,
                { id: prev.length + 1, ...data, role: "Operator", status: "Active" },
            ]);
            alert("New operator added successfully");
        }
        reset();
        setModalOpen(false);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Operator Management</h1>
            <button
                type="button"
                onClick={handleAddOperator}
                className="bg-green-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-green-600 transition duration-300"
            >
                Add New Operator
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Role</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {operators.map((operator, index) => (
                        <tr key={operator.id}>
                            <td className="border px-4 py-2 text-center">{index + 1}</td>
                            <td className="border px-4 py-2">{operator.name}</td>
                            <td className="border px-4 py-2">{operator.email}</td>
                            <td className="border px-4 py-2">{operator.role}</td>
                            <td className="border px-4 py-2">{operator.status}</td>
                            <td className="border px-4 py-2 flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => handleViewDetails(operator)}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {currentOperator ? "Edit Operator" : "Add Operator"}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    placeholder="Name"
                                    {...register("name", { required: "Name is required" })}
                                    defaultValue={currentOperator?.name || ""}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    placeholder="Email"
                                    {...register("email", { required: "Email is required" })}
                                    defaultValue={currentOperator?.email || ""}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Role
                                </label>
                                <input
                                    id="role"
                                    value="Operator"
                                    disabled
                                    className="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-200"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>
                                <select
                                    id="status"
                                    {...register("status", { required: "Status is required" })}
                                    defaultValue={currentOperator?.status || "Active"}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Deactive">Deactive</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-500 text-xs">{errors.status.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                            >
                                {currentOperator ? "Update" : "Add"}
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorsPage;
