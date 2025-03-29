import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../hooks/useNotification";
import { useEffect } from "react";
import socket from "../lib/socket";
import { NEW_NOTIF } from "../constants/socketMessage";
import { Box, Group, ScrollArea, Stack, Text, UnstyledButton } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";

function Notifications() {
    const { data } = useNotifications();
    const notifications = data?.notifications;
    const queryClient = useQueryClient();

    useEffect(() => {
        socket.on(NEW_NOTIF, () => {
            // reload number of notifications
            queryClient.invalidateQueries("notifications");
        });
    }, [queryClient]);

    return (
        <Stack gap="xs" style={{ overflow: "auto" }}>
            {notifications?.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">
                    Không có thông báo nào!
                </Text>
            ) : (
                <ScrollArea h={800}>
                    {notifications?.map((n) => (
                        <UnstyledButton
                            key={n.id}
                            p="sm"
                            bg={n.status === "unread" ? "gray.3" : ""}
                            className={"rounded-md mb-2"}
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
                    ))}
                </ScrollArea>
            )}
        </Stack>
    )
}

export default Notifications
