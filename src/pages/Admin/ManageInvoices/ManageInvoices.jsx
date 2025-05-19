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
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({
        shipping_name: "",
        shipping_phone: "",
        shipping_address: "",
        payment_method: "",
        notes: "",
    });
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

    const handleSearch = async () => {
        setLoading(true);
        try {
            const filters = {
                keyword: searchTerm,
                status: statusFilter,
                date_from: dateFrom || null,
                date_to: dateTo || null,
            };

            const response = await adminApi.searchOrders(accessToken, filters);
            if (response.status === 200) {
                setOrders(response.data.orders.data || []);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("❌ Lỗi tìm kiếm đơn hàng:", error);
            Swal.fire("Lỗi!", "Không thể tìm kiếm đơn hàng", "error");
        }
        setLoading(false);
    };

    const handleResetSearch = () => {
        setSearchTerm("");
        setStatusFilter("");
        setDateFrom("");
        setDateTo("");
        fetchOrders();
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const result = await Swal.fire({
                title: `Xác nhận chuyển trạng thái?`,
                text: `Chuyển đơn hàng sang "${translateStatus(newStatus)}"?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy bỏ",
            });

            if (result.isConfirmed) {
                const response = await adminApi.updateOrderStatus(accessToken, orderId, newStatus);
                if (response.status === 200) {
                    Swal.fire("Thành công!", "Cập nhật trạng thái đơn hàng thành công!", "success");
                    // Cập nhật lại danh sách đơn hàng
                    fetchOrders();
                    // Đóng modal chi tiết nếu đang mở
                    setSelectedOrder(null);
                }
            }
        } catch (error) {
            console.error("❌ Lỗi cập nhật trạng thái:", error);
            Swal.fire(
                "Lỗi!",
                error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng",
                "error"
            );
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận xóa?",
                text: "Bạn sẽ không thể khôi phục đơn hàng này!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xác nhận xóa",
                cancelButtonText: "Hủy bỏ",
            });

            if (result.isConfirmed) {
                const response = await adminApi.deleteOrder(accessToken, orderId);
                if (response.status === 200) {
                    Swal.fire("Đã xóa!", "Đơn hàng đã được xóa thành công.", "success");
                    // Cập nhật lại danh sách đơn hàng
                    fetchOrders();
                    // Đóng modal chi tiết nếu đang mở
                    setSelectedOrder(null);
                }
            }
        } catch (error) {
            console.error("❌ Lỗi xóa đơn hàng:", error);
            Swal.fire(
                "Lỗi!",
                error.response?.data?.message || "Không thể xóa đơn hàng",
                "error"
            );
        }
    };

    const handleEditClick = () => {
        if (selectedOrder) {
            setEditFormData({
                shipping_name: selectedOrder.shipping_name,
                shipping_phone: selectedOrder.shipping_phone,
                shipping_address: selectedOrder.shipping_address,
                payment_method: selectedOrder.payment_method,
                notes: selectedOrder.notes || "",
            });
            setEditMode(true);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await adminApi.updateOrder(accessToken, selectedOrder.id, editFormData);
            if (response.status === 200) {
                Swal.fire("Thành công!", "Cập nhật thông tin đơn hàng thành công!", "success");
                setEditMode(false);
                // Cập nhật lại selected order và danh sách đơn hàng
                const updatedOrderResponse = await adminApi.getOrderDetail(accessToken, selectedOrder.id);
                setSelectedOrder(updatedOrderResponse.data.order);
                fetchOrders();
            }
        } catch (error) {
            console.error("❌ Lỗi cập nhật đơn hàng:", error);
            Swal.fire(
                "Lỗi!",
                error.response?.data?.message || "Không thể cập nhật thông tin đơn hàng",
                "error"
            );
        }
    };

    // Hàm chuyển đổi trạng thái thành văn bản tiếng Việt
    const translateStatus = (status) => {
        const translations = {
            pending: "Chờ xác nhận",
            processing: "Đang chờ vận chuyển",
            shipped: "Đã vận chuyển",
            delivered: "Đã giao thành công",
            cancelled: "Đã hủy",
        };
        return translations[status] || status;
    };

    // Hàm xác định trạng thái tiếp theo có thể chuyển đến
    const getNextPossibleStatuses = (currentStatus) => {
        const validTransitions = {
            pending: ["processing", "cancelled"],
            processing: ["shipped", "cancelled"],
            shipped: ["delivered", "cancelled"],
            delivered: [],
            cancelled: [],
        };
        return validTransitions[currentStatus] || [];
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 sm:ml-60 overflow-x-auto min-h-screen mt-20 bg-gray-100">
                <h2 className="text-2xl font-bold text-[#ff6683] mb-6">Quản lý Đơn Hàng</h2>

                {/* Tìm kiếm và lọc */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tên, SĐT, địa chỉ..."
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Tất cả</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="processing">Đang chờ vận chuyển</option>
                                <option value="shipped">Đã vận chuyển</option>
                                <option value="delivered">Đã giao thành công</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleResetSearch}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                        >
                            Đặt lại
                        </button>
                        <button
                            onClick={handleSearch}
                            className="bg-[#ff6683] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>

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
                                    <th className="py-3 px-4 border">Thao Tác</th>
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
                                            ) : order.status === "processing" ? (
                                                <span className="text-blue-500">Đang chờ vận chuyển</span>
                                            ) : order.status === "shipped" ? (
                                                <span className="text-purple-500">Đã vận chuyển</span>
                                            ) : order.status === "delivered" ? (
                                                <span className="text-green-500">Đã giao thành công</span>
                                            ) : (
                                                <span className="text-red-500">Đã hủy</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.payment_method} -{" "}
                                            {order.payment_status === "pending" ? (
                                                <span className="text-yellow-500 font-semibold">Chưa thanh toán</span>
                                            ) : order.payment_status === "paid" ? (
                                                <span className="text-green-500 font-semibold">Đã thanh toán</span>
                                            ) : (
                                                <span className="text-red-500 font-semibold">Đã hoàn tiền</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
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
            {selectedOrder && !editMode && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 mt-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 max-h-[80%] overflow-y-auto ml-32">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-[#ff6683]">Chi Tiết Đơn Hàng</h2>
                            <div className="flex gap-2">
                                {/* Button trạng thái tiếp theo */}
                                {getNextPossibleStatuses(selectedOrder.status).map((nextStatus) => (
                                    <button
                                        key={nextStatus}
                                        onClick={() => handleUpdateStatus(selectedOrder.id, nextStatus)}
                                        className={`px-3 py-1 rounded-md text-white ${nextStatus === "cancelled"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-green-500 hover:bg-green-600"
                                            }`}
                                    >
                                        {nextStatus === "processing"
                                            ? "Xác nhận đơn"
                                            : nextStatus === "shipped"
                                                ? "Đã vận chuyển"
                                                : nextStatus === "delivered"
                                                    ? "Xác nhận giao hàng"
                                                    : nextStatus === "cancelled"
                                                        ? "Hủy đơn"
                                                        : translateStatus(nextStatus)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded border">
                                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Thông tin đơn hàng</h3>
                                <p><strong>Mã đơn:</strong> {selectedOrder.order_number}</p>
                                <p><strong>Trạng thái:</strong> {translateStatus(selectedOrder.status)}</p>
                                <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                                <p><strong>Tổng tiền:</strong> {parseFloat(selectedOrder.total_amount).toLocaleString()}đ</p>
                                <p><strong>Phương thức thanh toán:</strong> {selectedOrder.payment_method}</p>
                                <p><strong>Trạng thái thanh toán:</strong> {selectedOrder.payment_status === "pending" ? "Chưa thanh toán" : selectedOrder.payment_status === "paid" ? "Đã thanh toán" : "Đã hoàn tiền"}</p>
                                {selectedOrder.notes && <p><strong>Ghi chú:</strong> {selectedOrder.notes}</p>}
                            </div>

                            <div className="bg-gray-50 p-3 rounded border">
                                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Thông tin giao hàng</h3>
                                <p><strong>Người nhận:</strong> {selectedOrder.shipping_name}</p>
                                <p><strong>Số điện thoại:</strong> {selectedOrder.shipping_phone}</p>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</p>

                                {/* Nút sửa thông tin */}
                                <button
                                    onClick={handleEditClick}
                                    className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                                >
                                    Sửa thông tin
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold mt-4">Danh sách sản phẩm:</h3>
                        <ul className="border rounded p-3 bg-gray-100">
                            {selectedOrder.items.map((item) => (
                                <li key={item.id} className="mb-2 border-b pb-2 flex gap-5">
                                    <img
                                        src={`${BASE_URL}${item.variation?.images[0]?.image_path || 'placeholder.jpg'}`}
                                        alt={item.variation?.product?.name || "Sản phẩm"}
                                        className="w-16 h-16 object-cover rounded-md mt-2"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
                                    />
                                    <div>
                                        <p><strong>{item.variation?.product?.name || "Sản phẩm không xác định"}</strong></p>
                                        <p>SKU: {item.variation?.sku || "N/A"}</p>
                                        <p>Số lượng: {item.quantity}</p>
                                        <p>Giá: forr</p>

                                        {/* Hiển thị danh sách thuộc tính */}
                                        {item.variation?.attributes && item.variation.attributes.length > 0 && (
                                            <>
                                                <p className="mt-2 font-semibold">Thuộc tính:</p>
                                                <ul className="text-sm">
                                                    {item.variation.attributes.map((attr) => (
                                                        <li key={attr.id} className="text-gray-600">
                                                            - {attr.attribute_value?.display_value || "N/A"}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}
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

            {/* Modal Sửa Thông Tin Đơn Hàng */}
            {selectedOrder && editMode && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form
                        onSubmit={handleSubmitEdit}
                        className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2 max-h-[80%] overflow-y-auto ml-32"
                    >
                        <h2 className="text-xl font-bold mb-4 text-[#ff6683]">Sửa Thông Tin Đơn Hàng</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên người nhận</label>
                                <input
                                    type="text"
                                    name="shipping_name"
                                    value={editFormData.shipping_name}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="shipping_phone"
                                    value={editFormData.shipping_phone}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                            <textarea
                                name="shipping_address"
                                value={editFormData.shipping_address}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded-md"
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                                <select
                                    name="payment_method"
                                    value={editFormData.payment_method}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                    <option value="Bank Transfer">Chuyển khoản ngân hàng</option>
                                    <option value="Momo">Ví điện tử Momo</option>
                                    <option value="VNPay">VNPay</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <textarea
                                    name="notes"
                                    value={editFormData.notes}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded-md"
                                    rows="2"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-[#ff6683] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Pagination would go here if needed */}
        </>
    );
}

export default ManageInvoices;