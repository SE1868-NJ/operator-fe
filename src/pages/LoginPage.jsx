import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLogin } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import AuthService from "../services/Auth";

const LoginPage = () => {
    const { error } = useCurrentUser();
    const { register, handleSubmit, formState } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    //  if authenticated, navigate to dashboard
    // useEffect(() => {
    //     if (!error) navigate("/main");
    // }, [error, navigate]);

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
                    title: "Sai tài khoảng hoặc mật khẩu!",
                    message: "Vui lòng thử lại!",
                });
            });
    };

    return (
        <div className="flex flex-col justify-center h-screen max-w-md p-6 mx-auto space-y-4">
            <Text size="xl" ta={"center"} fw={600} c={"blue"}>
                Admin Dashboard
            </Text>

            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                <TextInput
                    required
                    label="Tên đăng nhập"
                    placeholder="Your username"
                    type="email"
                    name="email"
                    className="mb-4"
                    {...register("email")}
                />

                <PasswordInput
                    required
                    label="Mật khẩu"
                    placeholder="Your password"
                    type="password"
                    name="password"
                    className="mb-6"
                    {...register("password")}
                />

                <Button
                    mb={10}
                    type="submit"
                    fullWidth
                    loading={isLoading}
                    rightSection={<IconLogin size={20} />}
                >
                    Login
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
