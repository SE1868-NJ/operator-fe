import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const OperatorsDetailPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [operator, setOperator] = useState(state?.operator || null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (operator) {
            reset(operator);
        }
    }, [operator, reset]);

    const onSubmit = (data) => {
        alert("Operator details updated successfully!");
        navigate("/main/operators");
    };

    if (!operator) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Operator Details</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
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
                            defaultValue={operator.firstname}
                            {...register("firstname", { required: "First name is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.firstname && (
                            <p className="text-red-500 text-sm">{errors.firstname.message}</p>
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
                            defaultValue={operator.lastname}
                            {...register("lastname", { required: "Last name is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.lastname && (
                            <p className="text-red-500 text-sm">{errors.lastname.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            defaultValue={operator.email}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Invalid email format",
                                },
                            })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            defaultValue={operator.phone}
                            {...register("phone", { required: "Phone number is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            id="dob"
                            type="date"
                            defaultValue={operator.dob}
                            {...register("dob", { required: "Date of birth is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <select
                            id="gender"
                            defaultValue={operator.gender}
                            {...register("gender", { required: "Gender is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-sm">{errors.gender.message}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            defaultValue={operator.status}
                            {...register("status", { required: "Status is required" })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Active">Active</option>
                            <option value="Deactive">Deactive</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm">{errors.status.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <input
                            id="role"
                            type="text"
                            defaultValue={operator.role}
                            disabled
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Update Details
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/main/operators")}
                        className="bg-gray-300 text-black py-2 px-6 rounded-md hover:bg-gray-400 transition duration-300"
                    >
                        Back to Operators
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OperatorsDetailPage;
