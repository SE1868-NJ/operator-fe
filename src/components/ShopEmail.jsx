import { Button, Group, Modal, ScrollArea, TextInput, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

const EmailModal = ({ opened, onClose, shopId, handleSendEmail }) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!subject || !message) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        setLoading(true);
        try {
            await handleSendEmail(shopId, subject, message);
            alert("📩 Email đã được gửi!");
            onClose();
        } catch (error) {
            alert("❌ Gửi email thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    onClick={handleSubmit}
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
    );
};

export default EmailModal;
