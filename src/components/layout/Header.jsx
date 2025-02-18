import { ActionIcon, Box, Group, Popover, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { IconCircleCheck } from "@tabler/icons-react";
import { IconAlertCircle } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { NEW_NOTIF } from "../../constants/socketMessage";
import { useNotifications } from "../../hooks/useNotification";
import socket from "../../lib/socket";

const Header = () => {
    const { data, loading, error } = useNotifications();
    const notifications = data?.notifications;
    const unReadMessage = data?.unReadMessage;
    const queryClient = useQueryClient();

    useEffect(() => {
        socket.on(NEW_NOTIF, () => {
            // reload number of notifications
            queryClient.invalidateQueries("notifications");
            console.log("message");
        });
    }, [queryClient]);

    return (
        <div className="flex justify-between items-center h-full px-4">
            <p className="text-2xl font-bold text-primary">eCMarket</p>
            <Popover width={300} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <div className="relative inline-flex">
                        <ActionIcon
                            size="lg"
                            radius="xl"
                            className="bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <IconMail className="text-gray-700" size={20} />
                        </ActionIcon>

                        {unReadMessage > 0 && (
                            <div className="absolute -top-1 -right-1">
                                <div className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-medium text-white bg-red-500 rounded-full">
                                    {unReadMessage}
                                </div>
                            </div>
                        )}
                    </div>
                </Popover.Target>
                <Popover.Dropdown bg="var(--mantine-color-body)">
                    <Stack gap="xs" style={{ overflow: "auto" }}>
                        {notifications?.length === 0 ? (
                            <Text c="dimmed" ta="center" py="md">
                                Không có thông báo nào!
                            </Text>
                        ) : (
                            notifications?.map((n) => (
                                <UnstyledButton
                                    key={n.id}
                                    p="sm"
                                    style={(theme) => ({
                                        borderRadius: theme.radius.sm,
                                        "&:hover": {
                                            backgroundColor: "var(--mantine-color-default-hover)",
                                        },
                                    })}
                                >
                                    <Group wrap="nowrap" gap="sm">
                                        {n.type === "success" ? (
                                            <IconCircleCheck
                                                size={20}
                                                color="var(--mantine-color-green-6)"
                                            />
                                        ) : (
                                            <IconAlertCircle
                                                size={20}
                                                color="var(--mantine-color-blue-6)"
                                            />
                                        )}
                                        <Box style={{ flex: 1 }}>
                                            <Text size="sm" fw={500} lineClamp={2}>
                                                {n.message}
                                            </Text>
                                            <Text size="xs" c="dimmed" mt={4}>
                                                {new Date(n.createdAt).toLocaleTimeString()}
                                            </Text>
                                        </Box>
                                    </Group>
                                </UnstyledButton>
                            ))
                        )}
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </div>
    );
};

export default Header;
