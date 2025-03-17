import { Button, Group, Modal, Notification, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";
import EmailService from "../services/Email.js";

const SendBulkEmailModal = ({ opened, onClose }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleSendEmail = async () => {
        if (!subject.trim() || !message.trim()) {
            setNotification({ type: "error", text: "Vui lòng nhập tiêu đề và nội dung email." });
            return;
        }

        setLoading(true);
        try {
            const response = await EmailService.sendEmailToAll(subject, message);
            setNotification({ type: "success", text: response.message });
            setSubject("");
            setMessage("");
            onClose();
        } catch (error) {
            setNotification({ type: "error", text: "Lỗi khi gửi email, vui lòng thử lại." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {notification && (
                <Notification color={notification.type === "success" ? "green" : "red"}>
                    {notification.text}
                </Notification>
            )}

            <Modal
                opened={opened}
                onClose={onClose}
                title="📧 Gửi Email"
                size="xl" // ✅ Modal rộng hơn
                centered
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <TextInput
                    label="✉️ Tiêu đề"
                    placeholder="Nhập tiêu đề email..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    size="md"
                    mt="sm"
                />
                <Textarea
                    label="📝 Nội dung"
                    placeholder="Nhập nội dung email..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    autosize
                    minRows={8} // ✅ Ô nhập nội dung to hơn
                    maxRows={15}
                    size="md"
                    mt="md"
                />
                <Group position="right" mt="xl">
                    <Button
                        onClick={handleSendEmail}
                        loading={loading}
                        variant="gradient"
                        gradient={{ from: "blue", to: "cyan" }}
                        radius="md"
                        leftIcon={<IconSend size={20} />}
                    >
                        Gửi Email
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

export default SendBulkEmailModal;
