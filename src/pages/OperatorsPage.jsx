import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const OperatorsPage = () => {
    const [operators, setOperators] = useState([
        {
            id: 1,
            firstname: "Nga",
            lastname: "Nguyen",
            email: "ngant@gmail.com",
            phone: "0123456789",
            dob: "1990-01-01",
            gender: "Female",
            role: "Operator",
            status: "Active",
        },
        {
            id: 2,
            firstname: "Hong",
            lastname: "Hoang",
            email: "honghv@gmail.com",
            phone: "0123456789",
            dob: "1990-01-01",
            gender: "Male",
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
        control,
    } = useForm();
    const navigate = useNavigate();

    // Add Operator
    const handleAddOperator = () => {
        setCurrentOperator(null);
        setModalOpen(true);
    };

    const handleViewDetails = (operator) => {
        navigate(`/main/operators/${operator.id}`, { state: { operator } });
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
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Operator Management</h1>
                <button
                    type="button"
                    onClick={handleAddOperator}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <title>Plus icon</title>
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Add New Operator
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date of Birth
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {operators.map((operator, index) => (
                            <tr key={operator.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${operator.firstname} ${operator.lastname}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {operator.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {operator.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {operator.dob}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {operator.gender}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {operator.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            operator.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {operator.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
                    id="my-modal"
                >
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {currentOperator ? "Edit Operator" : "Add Operator"}
                            </h3>
                            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 text-left">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label
                                            htmlFor="firstname"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            First Name
                                        </label>
                                        <input
                                            id="firstname"
                                            type="text"
                                            {...register("firstname", {
                                                required: "First name is required",
                                            })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.firstname && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.firstname.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="lastname"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Last Name
                                        </label>
                                        <input
                                            id="lastname"
                                            type="text"
                                            {...register("lastname", {
                                                required: "Last name is required",
                                            })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.lastname && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {errors.lastname.message}
                                            </p>
                                        )}
                                    </div>
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
                                        type="email"
                                        {...register("email", { required: "Email is required" })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        {...register("phone", { required: "Phone is required" })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="dob"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Date of Birth
                                    </label>
                                    <input
                                        id="dob"
                                        type="date"
                                        {...register("dob", {
                                            required: "Date of birth is required",
                                        })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.dob && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.dob.message}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Gender
                                    </label>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        rules={{ required: "Gender is required" }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        )}
                                    />
                                    {errors.gender && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.gender.message}
                                        </p>
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
                                        type="text"
                                        value="Operator"
                                        disabled
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="status"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Status
                                    </label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: "Status is required" }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                <option value="">Select status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        )}
                                    />
                                    {errors.status && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.status.message}
                                        </p>
                                    )}
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        {currentOperator ? "Update" : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <title>Close</title>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorsPage;
