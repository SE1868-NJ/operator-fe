import { Button, Input } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/Auth";
import { useUserStore } from "../stores/UserStore";

const ChangePassPage = () => {
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
        const { password, newpassword, passwordconfirmation } = data;

        try {
            console.log("Mật khẩu cũ: ", password);
            console.log("Mật khẩu mới", newpassword);
            console.log("Mật khẩu mới nhập lại: ", passwordconfirmation);
            //   await AuthService.changePassword(
            //     password,
            //     newpassword,
            //     passwordconfirmation
            //   );
            notifications.show({
                title: "Đổi mật khẩu thành công!",
                message: "Bạn sẽ được chuyển hướng sau 2 giây.",
                color: "green",
                autoClose: 2000, // Thông báo sẽ tự động đóng sau 2 giây
                loading: true, // Hiển thị trạng thái loading
            });

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);
        } catch (err) {
            console.error(err);
            notifications.show({
                title: "Đổi mật khẩu thất bại!",
                message: "Vui lòng thử lại!",
                color: "red",
            });
        }

        // await AuthService.login(password, newpassword, passwordconfirmation)
        //     .then(({ token }) => {
        //         notifications.show({
        //             title: "Đổi mật khẩu thành công!",
        //         });
        //         navigate("/main");
        //         setToken(token);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //         notifications.show({
        //             color: "red",
        //             title: "Đổi mật khẩu thất bại!",
        //             message: "Vui lòng thử lại!",
        //         });
        //     });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
                    Change Password
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="my-8 text-sm">
                    <div className="flex flex-col my-4">
                        <label htmlFor="password" className="text-gray-700">
                            Current Password
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
                    <div className="flex flex-col my-4">
                        <label htmlFor="newpassword" className="text-gray-700">
                            New Password
                        </label>
                        <Input
                            id="newpassword"
                            type="newpassword"
                            placeholder="Enter your password"
                            {...register("newpassword", {
                                required: "Không được để trống mục này!",
                            })}
                            className="mt-2"
                        />
                        <p className="text-red-500 text-xs mt-1">
                            {Boolean(errors?.newpassword?.message) && errors?.newpassword?.message}
                        </p>
                    </div>
                    <div className="flex flex-col my-4">
                        <label htmlFor="passwordconfirmation" className="text-gray-700">
                            Password Confirmation
                        </label>
                        <Input
                            id="passwordconfirmation"
                            type="passwordconfirmation"
                            placeholder="Enter your password again"
                            {...register("passwordconfirmation", {
                                required: "Không được để trống mục này!",
                            })}
                            className="mt-2"
                        />
                        <p className="text-red-500 text-xs mt-1">
                            {Boolean(errors?.passwordconfirmation?.message) &&
                                errors?.passwordconfirmation?.message}
                        </p>
                    </div>
                    <div className="my-4 flex items-center justify-end">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 text-white rounded-lg transition duration-150"
                        >
                            Change Password
                        </Button>
                    </div>
                </form>

                <div className="flex items-center justify-between my-4">
                    <div className="w-full h-[1px] bg-gray-300" />

                    <div className="w-full h-[1px] bg-gray-300" />
                </div>
            </div>
        </div>
    );
};

export default ChangePassPage;
