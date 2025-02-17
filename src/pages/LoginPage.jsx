import { Button, Input, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import AuthService from "../services/Auth";

const LoginPage = () => {
    const { error } = useCurrentUser();
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    //  if authenticated, navigate to dashboard
    useEffect(() => {
        if (!error) navigate("/main");
    }, [error, navigate]);

    const onSubmit = async (data) => {
        // destructuring
        const { email, password } = data;
        setIsLoading(true);

        await AuthService.login(email, password)
            .then(() => {
                notifications.show({
                    title: "Đăng nhập thành công!",
                });
                setIsLoading(false);
                navigate("/main");
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
                notifications.show({
                    color: "red",
                    title: "Đăng nhập thất bại!",
                    message: "Vui lòng thử lại!",
                });
            });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
                    Operator Login
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="my-8 text-sm">
                    <div className="flex flex-col my-4">
                        <label htmlFor="email" className="text-gray-700">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="abc@gmail.com"
                            {...register("email", {
                                required: "Không được để trống mục này!",
                            })}
                            className="mt-2"
                        />
                        <p className="text-red-500 text-xs mt-1">
                            {Boolean(errors?.email?.message) && errors?.email?.message}
                        </p>
                    </div>
                    <div className="flex flex-col my-4">
                        <label htmlFor="password" className="text-gray-700">
                            Mật khẩu
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Không được để trống mục này!",
                            })}
                            className="mt-2"
                        />
                        <p className="text-red-500 text-xs mt-1">
                            {Boolean(errors?.password?.message) && errors?.password?.message}
                        </p>
                    </div>

                    <div className="my-4 flex items-center justify-end">
                        <Button
                            fullWidth
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-white rounded-lg transition duration-150 flex items-center justify-center"
                        >
                            {isLoading ? <Loader color="white" size="sm" /> : <p>Đăng nhập</p>}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
