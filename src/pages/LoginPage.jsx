import { Button, Input } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/Auth";
import { useUserStore } from "../stores/UserStore";

const LoginPage = () => {
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
                    title: "Đăng nhập thành công!",
                });
                navigate("/main");
                setToken(token);
            })
            .catch((err) => {
                console.error(err);
                notifications.show({
                    color: "red",
                    title: "Notification with custom styles",
                    message: "It is red",
                });
            });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-screen-sm mx-auto px-20 my-20 space-y-5"
        >
            <div>
                <label htmlFor="email">Email</label>
                <Input
                    id="email"
                    placeholder="abc@gmail.com"
                    {...register("email", {
                        required: "Không được để trống mục này!",
                    })}
                />
                <p className="text-blue-300">
                    {Boolean(errors?.email?.message) && errors?.email?.message}
                </p>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <Input
                    id="password"
                    type="password"
                    {...register("password", {
                        required: "Không được để trống mục này!",
                    })}
                />
                {Boolean(errors?.password?.message) && errors?.password?.message}
            </div>
            <Button type="submit">Login</Button>
        </form>
    );
};

export default LoginPage;
