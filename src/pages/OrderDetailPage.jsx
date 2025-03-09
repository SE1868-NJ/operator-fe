import { useParams } from "react-router-dom";
import { useOneOrder } from "../hooks/useShop";

const OrderDetailPage = () => {
    const { id } = useParams();

    const { data: order, isLoading, error } = useOneOrder(id);
    console.log("order", order);

    return (
        <div>
            <h1 className="text-2xl font-bold">Thông tin chi tiết đơn hàng {order?.id}</h1>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <th>mã đơn</th>
                                <td>Id</td>
                            </td>
                            <td>
                                <th>mã đơn</th>
                                <td>Id</td>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default OrderDetailPage;
