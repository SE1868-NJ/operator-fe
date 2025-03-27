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
                setTimeout(() => navigate("/"), 2000);
            } else {
                console.log("err: ", data);
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
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Đổi Mật Khẩu</h2>
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
                    <div className="flex flex-col gap-2 mt-3">
                        <Button
                            type="submit"
                            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Đổi Mật Khẩu
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full py-2 text-gray-700 border-gray-400 rounded-lg hover:bg-gray-200"
                            onClick={() => navigate(-1)}
                        >
                            Quay lại
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
