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
import Notifications from "../Notifications";

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

    const openModal = () => modals.open({
        title: 'Thông báo',
        size: "lg",
        children: (
            <Notifications />
        ),
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
                )}
            </div>
        </div >
    );
};

export default Header;
