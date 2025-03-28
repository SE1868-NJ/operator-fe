import { Button, Input } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/Auth";
import { useUserStore } from "../stores/UserStore";

const ForgotPassPage = () => {
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
        const { email } = data;

        await AuthService.resetPassword(email, "operator")
            .then(({ data }) => {
                notifications.show({
                    olor: "green",
                    title: "Mật khẩu mới đã được gửi đến gmail của bạn!",
                    message: "Vui lòng mở gmail để nhận mật khẩu!",
                });
                navigate("/main");
                
            })
            .catch((err) => {
                console.error(err);
                notifications.show({
                    color: "red",
                    title: "Nhập sai gmail!",
                    message: "Vui lòng thử lại!",
                });
            });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
                    Forgot Password
                </h2>
                <p className="text-center text-sm text-gray-600 mt-2">
                    Cung cấp địa chỉ email được liên kết với tài khoản của bạn để khôi phục mật
                    khẩu.
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="my-8 text-sm">
                    <div className="flex flex-col my-4">
                        <label htmlFor="email" className="text-gray-700">
                            Email
                        </label>
                        <Input
                            id="email"
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
                    <div className="my-4 flex items-center justify-end">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-white rounded-lg transition duration-150"
                        >
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassPage;
