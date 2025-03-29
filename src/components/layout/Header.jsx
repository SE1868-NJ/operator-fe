import {
    ActionIcon,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { NEW_NOTIF } from "../../constants/socketMessage";
import { useNotifications } from "../../hooks/useNotification";
import socket from "../../lib/socket";
import { modals } from "@mantine/modals";
<<<<<<< HEAD
import Notifications from "../Notifications";
=======
>>>>>>> a37368c (feat: update)

const Header = () => {
    const { data } = useNotifications();
    const unReadMessage = data?.unReadMessage;
    const queryClient = useQueryClient();

    useEffect(() => {
        socket.on(NEW_NOTIF, () => {
            // reload number of notifications
            queryClient.invalidateQueries("notifications");
        });
    }, [queryClient]);

<<<<<<< HEAD
    const openModal = () => modals.open({
        title: 'Thông báo',
        size: "lg",
        children: (
            <Notifications />
        ),
=======
    const openModal = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        children: (
            <Text size="sm">
                This action is so important that you are required to confirm it with a modal. Please click
                one of these buttons to proceed.
            </Text>
        ),
        labels: { confirm: 'Confirm', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => console.log('Confirmed'),
>>>>>>> a37368c (feat: update)
    });

    return (
        <div className="flex justify-between items-center h-full px-4">
            <p className="text-2xl font-bold text-primary">eCMarket</p>

            {/* Notification Popup */}
            <div className="relative inline-flex">
                <ActionIcon
                    size="lg"
                    radius="xl"
                    className="bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={openModal}
                >
                    <IconMail className="text-gray-700" size={20} />
                </ActionIcon>

                {unReadMessage > 0 && (
                    <div className="absolute -top-1 -right-1">
                        <div className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-xs font-medium text-white bg-red-500 rounded-full">
                            {unReadMessage}
                        </div>
                    </div>
<<<<<<< HEAD
                )}
            </div>
        </div >
=======
                </Popover.Target>
                <Popover.Dropdown bg="var(--mantine-color-body)">
                    <Stack gap="xs" style={{ overflow: "auto" }}>
                        {notifications?.length === 0 ? (
                            <Text c="dimmed" ta="center" py="md">
                                Không có thông báo nào!
                            </Text>
                        ) : (
                            <ScrollArea h={500}>
                                {notifications?.map((n) => (
                                    <UnstyledButton
                                        key={n.id}
                                        p="sm"
                                        onClick={openModal}
                                        className="hover:bg-slate-300 rounded-md"
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
                </Popover.Dropdown>
            </Popover>
        </div>
>>>>>>> a37368c (feat: update)
    );
};

export default Header;
