import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../components/SideBar/Sidebar";
import adminApi from "../../../api/AdminApi/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";

const BASE_URL = "http://localhost:8000/storage/";

function ManageInvoices() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const accessToken = getAccessTokenFromLS();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getListOrder(accessToken);
            console.log("📢 Fetched Orders:", response);
            if (response.status === 200) {
                setOrders(response.data.orders || []);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("❌ Lỗi tải danh sách đơn hàng:", error);
            Swal.fire("Lỗi!", "Không thể tải danh sách đơn hàng", "error");
        }
        setLoading(false);
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 sm:ml-60 overflow-x-auto min-h-screen mt-24 bg-gray-100">
                <h2 className="text-2xl font-bold text-[#ff6683] mb-6">Quản lý Đơn Hàng</h2>

                {loading ? (
                    <p className="text-center text-[#ff6683] text-lg font-semibold">Đang tải danh sách...</p>
                ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-[#ff6683] text-white text-left">
                                    <th className="py-3 px-4 border">STT</th>
                                    <th className="py-3 px-4 border">Mã Đơn</th>
                                    <th className="py-3 px-4 border">Khách Hàng</th>
                                    <th className="py-3 px-4 border">Số Điện Thoại</th>
                                    <th className="py-3 px-4 border">Tổng Tiền</th>
                                    <th className="py-3 px-4 border">Trạng Thái</th>
                                    <th className="py-3 px-4 border">Thanh Toán</th>
                                    <th className="py-3 px-4 border">Ngày Đặt</th>
                                    <th className="py-3 px-4 border">Chi Tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} className="text-center border bg-gray-50 hover:bg-gray-100">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4 font-semibold">{order.order_number}</td>
                                        <td className="py-3 px-4">{order.shipping_name}</td>
                                        <td className="py-3 px-4">{order.shipping_phone}</td>
                                        <td className="py-3 px-4 font-semibold">{parseFloat(order.total_amount).toLocaleString()}đ</td>
                                        <td className="py-3 px-4 font-bold">
                                            {order.status === "pending" ? (
                                                <span className="text-yellow-500">Chờ xác nhận</span>
                                            ) : order.status === "completed" ? (
                                                <span className="text-green-500">Hoàn thành</span>
                                            ) : (
                                                <span className="text-red-500">Đã hủy</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.payment_method} -{" "}
                                            {order.payment_status === "pending" ? (
                                                <span className="text-yellow-500 font-semibold">Chưa thanh toán</span>
                                            ) : (
                                                <span className="text-green-500 font-semibold">Đã thanh toán</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-[#ff6683] text-xl font-semibold mt-6">Không có đơn hàng nào</p>
                )}
            </div>

            {/* Modal Chi Tiết Đơn Hàng */}
            {selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[70%] overflow-y-auto ml-60">
                        <h2 className="text-xl font-bold mb-4 text-[#ff6683]">Chi Tiết Đơn Hàng</h2>
                        <p><strong>Mã đơn:</strong> {selectedOrder.order_number}</p>
                        <p><strong>Khách hàng:</strong> {selectedOrder.shipping_name}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.shipping_phone}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</p>
                        <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method}</p>
                        <p><strong>Tổng tiền:</strong> {parseFloat(selectedOrder.total_amount).toLocaleString()}đ</p>

                        <h3 className="text-lg font-bold mt-4">Danh sách sản phẩm:</h3>
                        <ul className="border rounded p-3 bg-gray-100">
                            {selectedOrder.items.map((item) => (
                                <li key={item.id} className="mb-2 border-b pb-2 flex gap-5">
                                    <img
                                        src={`${BASE_URL}${item.variation.images[0]?.image_path}`}
                                        alt={item.variation.product.name}
                                        className="w-16 h-16 object-cover rounded-md mt-2"
                                    />
                                    <div>
                                        <p><strong>{item.variation.product.name}</strong></p>
                                        <p>SKU: {item.variation.sku}</p>
                                        <p>Số lượng: {item.quantity}</p>
                                        <p>Giá: {parseFloat(item.price).toLocaleString()}đ</p>

                                        {/* Hiển thị danh sách thuộc tính */}
                                        <p className="mt-2 font-semibold">Thuộc tính:</p>
                                        <ul className="text-sm">
                                            {item.variation.attributes.map((attr) => (
                                                <li key={attr.id} className="text-gray-600">
                                                    - {attr.attribute_value.display_value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-[#ff6683] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageInvoices;
