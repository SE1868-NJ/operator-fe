import { Button, Input } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/Auth";
import { useUserStore } from "../stores/UserStore";

const OTPPage = () => {
    const { setToken } = useUserStore();
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const navigate = useNavigate();

    //  if authenticated, navigate to dashboard
    // useEffect(() => {
    //     if (!isAuthenticated) navigate("/main");
    // }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        // destructuring
        const { email, password } = data;

        await AuthService.login(email, password)
            .then(({ token }) => {
                notifications.show({
                    title: "Nhập mã OTP thành công!",
                });
                navigate("/main");
                setToken(token);
            })
            .catch((err) => {
                console.error(err);
                notifications.show({
                    color: "red",
                    title: "Nhập mã OTP không thành công",
                    message: "Vui lòng thử lại!",
                });
            });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
                    Xác nhận OTP
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="my-8 text-sm">
                    <div className="flex flex-col my-4">
                        <label htmlFor="password" className="text-gray-700">
                            Nhập mã OTP
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your OTP code"
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
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-white rounded-lg transition duration-150"
                        >
                            Confirm
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPPage;
