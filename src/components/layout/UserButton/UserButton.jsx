import { Avatar, Button, Group, Menu, Modal, Popover, Text, UnstyledButton } from "@mantine/core";
import { IconChevronRight, IconLock, IconLogout, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/Auth.js";
import classes from "./UserButton.module.css";

export function UserButton() {
    const [opened, setOpened] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/");
    };

    const handleChangePassword = () => {
        navigate("/changepassword");
    };

    const handleProfile = () => {
        navigate("/profile");
    };

    return (
        <>
            <Popover
                opened={opened}
                onChange={setOpened}
                position="bottom-end"
                withArrow
                shadow="md"
            >
                {/* Nút User */}
                <Popover.Target>
                    <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.user}>
                        <Group>
                            <Avatar
                                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                                radius="xl"
                            />

                            <div style={{ flex: 1 }}>
                                <Text size="sm" fw={500}>
                                    Harriette Spoonlicker
                                </Text>

                                <Text c="dimmed" size="xs">
                                    hspoonlicker@outlook.com
                                </Text>
                            </div>

                            <IconChevronRight size={14} stroke={1.5} />
                        </Group>
                    </UnstyledButton>
                </Popover.Target>

                {/* Menu xuất hiện khi nhấn */}
                <Popover.Dropdown>
                    <Menu>
                        <Menu.Item icon={<IconUser size={16} />} onClick={handleProfile}>
                            Xem thông tin
                        </Menu.Item>
                        <Menu.Item icon={<IconLock size={16} />} onClick={handleChangePassword}>
                            Đổi mật khẩu
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconLogout size={16} />}
                            color="red"
                            onClick={() => setLogoutModalOpen(true)}
                        >
                            Đăng xuất
                        </Menu.Item>
                    </Menu>
                </Popover.Dropdown>
            </Popover>

            {/* Modal xác nhận đăng xuất */}
            <Modal
                opened={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                title="Xác nhận"
            >
                <Text>Bạn có chắc chắn muốn đăng xuất không?</Text>
                <Group position="right" mt="md">
                    <Button variant="default" onClick={() => setLogoutModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button color="red" onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </Group>
            </Modal>
        </>
    );
}
