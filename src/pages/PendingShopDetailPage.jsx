import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../services/Auth";

const PendingShopDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch } = useForm();

    const onSubmit = async (data) => {
        try {
            await AuthService.updatePendingShop(data.id, data.status, data.description); // back-end updatePendingShop
            notifications.show({
                color: "green",
                title: "Cập nhật thành công!",
                message: `Shop đã được ${data.status === "accept" ? "chấp nhận" : "từ chối"}.`,
            });
            navigate("/pendingshoplist");
        } catch (err) {
            console.error(err);
            notifications.show({
                color: "red",
                title: "Lỗi đã xảy ra khi cập nhật!",
                message: "Vui lòng thử lại!",
            });
        }
        navigate("/pendingshoplist");
    };

    const handleDecision = (status) => {
        const description = watch("description");
        handleSubmit(() => onSubmit({ id: shop.id, status, description }))();
    };

    const listShop = [
        {
            id: 1,
            name: "Shop 1",
            owner: "Nguyen Van A",
            email: "nguyenA@example.com",
            phone: "0123456789",
            address: "Toa nha so 1, tang 1, phong so 101",
            date: "01-02-2003",
        },
        {
            id: 2,
            name: "Shop 2",
            owner: "Nguyen van B",
            email: "NguyenB@example.com",
            phone: "0987654321",
            address: "Toa nha so 2, tang 2, phong so 202",
            date: "02-03-2004",
        },
        {
            id: 3,
            name: "Shop 3",
            owner: "Nguyen van C",
            email: "NguyenC@example.com",
            phone: "0987612345",
            address: "Toa nha so 3, tang 3, phong so 303",
            date: "05-03-2004",
        },
        {
            id: 4,
            name: "Shop 4",
            owner: "Nguyen van D",
            email: "NguyenD@example.com",
            phone: "0956784321",
            address: "Toa nha so 4, tang 4, phong so 404",
            date: "02-04-2003",
        },
    ];

    const shop = listShop.find((shop) => shop.id === Number.parseInt(id));
    if (!shop) return <div>Shop not found</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold my-10 text-center">Pending Shop Detail</h1>
            <div className="max-w-lg mx-auto bg-gray-200 p-6 rounded-lg shadow-md items-center">
                <p>
                    <strong>Name:</strong> {shop.name}
                </p>
                <p>
                    <strong>Owner:</strong> {shop.owner}
                </p>
                <p>
                    <strong>Email:</strong> {shop.email}
                </p>
                <p>
                    <strong>Phone:</strong> {shop.phone}
                </p>
                <p>
                    <strong>Address:</strong> {shop.address}
                </p>
                <p>
                    <strong>Date:</strong> {shop.date}
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p className="mt-4">
                        <strong>Đánh giá của Operator:</strong>
                    </p>
                    <textarea
                        {...register("description")}
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Nhận xét"
                        className=" w-full p-2 rounded h-28"
                    />
                    <button
                        type="button"
                        className="mt-4 w-20 bg-green-500 text-white p-2 rounded mr-5"
                        onClick={() => handleDecision("accept")}
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        className="mt-4 w-20 bg-red-500 text-white p-2 rounded"
                        onClick={() => handleDecision("reject")}
                    >
                        Reject
                    </button>
                </form>
                <button
                    type="button"
                    className="mt-4 bg-gray-500 text-white p-2 rounded"
                    onClick={() => navigate("/pendingshoplist")}
                >
                    Back to list
                </button>
            </div>
        </div>
    );
};

export default PendingShopDetail;
