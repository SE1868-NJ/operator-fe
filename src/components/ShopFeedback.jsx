import { Accordion, Avatar, Button, Card, Image, Progress, Rating, Select } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion"; // 🎯 Import framer-motion
import React, { useState } from "react";

//Feedback:
const FeedbackList = ({ feedbacks }) => {
    const [selectedStar, setSelectedStar] = useState("all");
    const [visibleCount, setVisibleCount] = useState(3);

    // Tính tổng số feedback
    const totalFeedback = feedbacks.length;

    // Lọc feedback theo số sao
    const filteredFeedbacks =
        selectedStar === "all"
            ? feedbacks
            : feedbacks.filter((fb) => fb.star === Number.parseInt(selectedStar));

    // Chỉ hiển thị số lượng feedback theo visibleCount
    const displayedFeedbacks = filteredFeedbacks.slice(0, visibleCount);

    const averageRating = () => {
        if (feedbacks.length === 0) return 0;
        const totalStars = feedbacks.reduce((sum, fb) => sum + fb.star, 0);
        return (totalStars / feedbacks.length).toFixed(1);
    };

    const starCounts = [5, 4, 3, 2, 1].map((star) => {
        const count = feedbacks.filter((fb) => fb.star === star).length;
        const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
        return { star, count, percentage: percentage.toFixed(1) }; // Giữ 1 chữ số thập phân
    });

    return (
        <div className="mt-6">
            {/* Hiển thị số sao trung bình */}
            <div className="mb-4 flex items-center gap-4">
                <h2 className="text-2xl font-bold">📢 Tất cả Feedback ({totalFeedback})</h2>
                <div className="flex items-center gap-2 text-lg font-medium">
                    <span className="text-gray-600 font-medium">⭐ Đánh giá trung bình:</span>
                    <span className="text-lg font-bold text-blue-600">{averageRating()} / 5</span>
                </div>
            </div>

            {/* Biểu đồ đánh giá tổng quan */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Tổng quan đánh giá</h3>
                {starCounts.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2 mb-2">
                        <span className="w-10 text-gray-700">⭐{star}</span>
                        <Progress
                            value={percentage}
                            color={star >= 4 ? "green" : "orange"}
                            className="flex-1"
                        />
                        <span className="text-gray-600">{count} đánh giá</span>
                    </div>
                ))}
            </div>

            {/* Bộ lọc feedback theo sao */}
            <div className="mb-4 flex items-center gap-4">
                <span className="text-gray-600 font-medium">Lọc theo sao:</span>
                <Select
                    value={selectedStar}
                    onChange={setSelectedStar}
                    data={[
                        { value: "all", label: "🌟 Tất cả" },
                        ...starCounts.map(({ star, count }) => ({
                            value: String(star),
                            label: `⭐${star} (${count})`,
                        })),
                    ]}
                    radius="lg"
                    size="md"
                />
            </div>

            {/* Danh sách feedback với animation */}
            <div className="space-y-6 w-full lg:w-2/3">
                <AnimatePresence>
                    {displayedFeedbacks.map((fb) => (
                        <motion.div
                            key={fb.ID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card
                                shadow="md"
                                p="lg"
                                className="border rounded-xl hover:shadow-lg transition-all"
                            >
                                {/* Header Feedback */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Avatar src={fb.Customer.avatar} size="lg" radius="xl" />
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {fb.Customer.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {fb.Customer.userEmail}
                                            </p>
                                            <Rating value={fb.star} readOnly size="sm" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        🕒{" "}
                                        {formatDistanceToNow(new Date(fb.createdAt), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </p>
                                </div>

                                {/* Nội dung feedback */}
                                <p className="mt-3 text-gray-700">{fb.content}</p>

                                {/* Hình ảnh feedback (nếu có) */}
                                {fb.Media?.MediaItems?.length > 0 && (
                                    <div className="mt-2 flex space-x-2">
                                        {fb.Media.MediaItems.map((img) => (
                                            <Image
                                                key={img.ID}
                                                src={img.mediaItemURL}
                                                alt="Feedback image"
                                                className="w-20 h-20 rounded-lg object-cover border"
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Chi tiết sản phẩm đã mua */}
                                <Accordion variant="separated" className="mt-4">
                                    <Accordion.Item value="product">
                                        <Accordion.Control>
                                            📦 Chi tiết sản phẩm đã mua
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold">
                                                        {fb.OrderItem?.Product?.product_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {fb.OrderItem?.Product?.description}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Số lượng: {fb.OrderItem?.quantity}
                                                    </p>
                                                    <p className="text-sm font-bold text-blue-600">
                                                        💰 Giá:{" "}
                                                        {fb.OrderItem?.price.toLocaleString()} VND
                                                    </p>
                                                    <p className="text-sm font-bold">
                                                        Trạng thái giao hàng:{" "}
                                                        <span className="text-red-500 uppercase">
                                                            {fb.OrderItem?.Order?.status}
                                                        </span>
                                                    </p>
                                                </div>
                                                <Image
                                                    src="https://shopmebi.com/wp-content/uploads/2023/07/ao-so-mi-nam-dai-tay-uniqlo-goods_57_453156_edited.jpeg"
                                                    alt="Ảnh sản phẩm"
                                                    className="w-20 h-20 rounded-md object-cover border"
                                                />
                                            </div>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                </Accordion>

                                {/* Phản hồi từ shop */}
                                {fb.Reply && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="text-sm font-bold">💬 Phản hồi từ shop</h4>
                                        <p className="text-gray-700">{fb.Reply.content}</p>
                                        <div className="flex items-center mt-2">
                                            <Avatar
                                                src={fb.Reply.ReplyUser.avatar}
                                                size="sm"
                                                radius="xl"
                                            />
                                            <span className="ml-2 text-sm text-gray-500">
                                                {fb.Reply.ReplyUser.fullName}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Nút Xem thêm / Thu gọn với animation */}
            <div className="mt-6 text-center">
                {visibleCount < filteredFeedbacks.length ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Button
                            onClick={() => setVisibleCount(visibleCount + 2)}
                            radius="xl"
                            size="md"
                            variant="filled"
                            className="bg-blue-500 text-white hover:bg-blue-600 transition-all"
                        >
                            Xem thêm
                        </Button>
                    </motion.div>
                ) : (
                    visibleCount >= 5 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button
                                onClick={() => setVisibleCount(3)}
                                radius="xl"
                                size="md"
                                variant="outline"
                                color="red"
                            >
                                Thu gọn
                            </Button>
                        </motion.div>
                    )
                )}
            </div>
        </div>
    );
};

export default FeedbackList;
