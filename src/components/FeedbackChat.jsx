import { Box, Button, Card, Drawer, ScrollArea, Stack, Textarea, Tooltip } from "@mantine/core";
import { Text as MantineText } from "@mantine/core"; // Đổi tên tránh conflict
import { IconMessageCircle, IconSend } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Hỗ trợ markdown nâng cao
import ShopService from "../services/ShopService";

const FeedbackChat = ({ shopId }) => {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: "ai", content: "Xin chào bạn! Tôi có thể giúp gì cho bạn về cửa hàng này?" },
    ]);
    const [loading, setLoading] = useState(false);
    const [opened, setOpened] = useState(false);
    const chatContainerRef = useRef(null);

    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, []);
    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setLoading(true);

        const userMessage = { role: "user", content: prompt };
        setChatHistory((prev) => [...prev, userMessage]);

        try {
            const aiReview = await ShopService.generateAIReview(shopId, prompt);
            const aiMessage = { role: "ai", content: aiReview };
            setChatHistory((prev) => [...prev, aiMessage]);
        } catch (error) {
            setChatHistory((prev) => [
                ...prev,
                { role: "ai", content: "Đã có lỗi xảy ra, vui lòng thử lại." },
            ]);
        } finally {
            setLoading(false);
            setPrompt("");
        }
    };

    return (
        <>
            {/* Icon chat box ở góc phải */}
            <Box style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
                <Tooltip label="Bạn có cần tìm hiểu thông tin gì về shop này không?">
                    <Button
                        leftIcon={<IconMessageCircle />}
                        size="lg"
                        onClick={() => setOpened(true)}
                    >
                        Chat với AI
                    </Button>
                </Tooltip>
            </Box>

            {/* Drawer Chat */}
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="Trò chuyện với AI"
                padding="md"
                size="md"
                position="right"
            >
                <Stack justify="space-between" style={{ height: "100%" }}>
                    <ScrollArea style={{ flex: 1, paddingBottom: 10 }} ref={chatContainerRef}>
                        {chatHistory.map((msg, index) => (
                            <Card
                                key={index}
                                shadow="xs"
                                padding="sm"
                                mt="sm"
                                style={{
                                    backgroundColor: msg.role === "user" ? "#e0f7fa" : "#f1f1f1",
                                    textAlign: msg.role === "user" ? "right" : "left",
                                }}
                            >
                                {msg.role === "ai" ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                ) : (
                                    <MantineText>{msg.content}</MantineText>
                                )}
                            </Card>
                        ))}
                    </ScrollArea>

                    {/* Ô nhập prompt và nút gửi luôn ghim dưới cùng */}
                    <Box
                        style={{
                            position: "sticky",
                            bottom: 0,
                            background: "white",
                            padding: "10px",
                            width: "100%",
                        }}
                    >
                        <Textarea
                            placeholder="Nhập câu hỏi của bạn..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            minRows={2}
                        />
                        <Button
                            leftIcon={<IconSend />}
                            onClick={handleSubmit}
                            loading={loading}
                            fullWidth
                            mt="sm"
                        >
                            Gửi
                        </Button>
                    </Box>
                </Stack>
            </Drawer>
        </>
    );
};

export default FeedbackChat;
