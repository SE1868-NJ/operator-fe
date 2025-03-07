import { Button, Input } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/Auth.js";
import OperatorService from "../services/OperatorService.js";

const ChangePassword = () => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== passwordConfirmation) {
            notifications.show({
                title: "Lỗi!",
                message: "Mật khẩu xác nhận không khớp!",
                color: "red",
            });
            return;
        }

        try {
            const data = await OperatorService.changePassword(password, newPassword);
            if (data) {
                AuthService.logout();
                notifications.show({
                    title: "Đổi mật khẩu thành công!",
                    message: "Bạn sẽ được chuyển hướng sau 2 giây.",
                    color: "green",
                    autoClose: 2000,
                });
                setTimeout(() => navigate("/", { replace: true }), 2000);
            } else {
                console.log("err: ", err);
                notifications.show({
                    title: "Mật khẩu nhập không đúng!",
                    message: "Vui lòng thử lại!",
                    color: "red",
                });
            }
        } catch (err) {
            console.log("err: ", err);
            notifications.show({
                title: "Mật khẩu nhập không đúng!",
                message: "Vui lòng thử lại!",
                color: "red",
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-center text-2xl font-bold text-gray-800">Đổi Mật Khẩu</h2>
                <form onSubmit={onSubmit} className="mt-6">
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="text-gray-700">
                            Mật khẩu hiện tại
                        </label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="text-gray-700">
                            Mật khẩu mới
                        </label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="text-gray-700">
                            Xác nhận mật khẩu
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                        Đổi Mật Khẩu
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
