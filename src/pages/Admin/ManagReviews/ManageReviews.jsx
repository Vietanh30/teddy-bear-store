import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../components/SideBar/Sidebar";
import { getAccessTokenFromLS } from "../../../utils/auth";
import adminApi from "../../../api/AdminApi/adminApi";

function ManageReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [editingReply, setEditingReply] = useState(null);
    const [filters, setFilters] = useState({
        status: "",
        product_id: "",
    });
    const accessToken = getAccessTokenFromLS();

    useEffect(() => {
        fetchReviews();
    }, []);

    // 📌 Fetch danh sách đánh giá với bộ lọc
    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getReviews(accessToken, filters);
            console.log("📢 Fetched Reviews:", response);
            if (response.status === 200) {
                setReviews(response.data.reviews.data || []);

                // Update selectedReview if it exists in the new data
                if (selectedReview) {
                    const updatedReview = response.data.reviews.data.find(
                        review => review.id === selectedReview.id
                    );
                    if (updatedReview) {
                        setSelectedReview(updatedReview);
                    }
                }
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("❌ Lỗi tải danh sách đánh giá:", error);
            Swal.fire("Lỗi!", "Không thể tải danh sách đánh giá", "error");
        }
        setLoading(false);
    };

    // 📌 Fetch chi tiết đánh giá
    const fetchReviewDetail = async (reviewId) => {
        try {
            const response = await adminApi.getReviewById(accessToken, reviewId);
            if (response.status === 200) {
                setSelectedReview(response.data.review);
            }
        } catch (error) {
            console.error("❌ Lỗi tải chi tiết đánh giá:", error);
        }
    };

    // 📌 Cập nhật bộ lọc và áp dụng lọc
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 📌 Áp dụng bộ lọc
    const applyFilters = () => {
        fetchReviews();
    };

    // 📌 Xóa bộ lọc
    const clearFilters = () => {
        setFilters({
            status: "",
            product_id: "",
        });
        setTimeout(() => {
            fetchReviews();
        }, 0);
    };

    // 📌 Xem chi tiết đánh giá
    const handleViewReview = (review) => {
        setSelectedReview(review);
    };

    // 📌 Cập nhật trạng thái đánh giá
    const handleUpdateStatus = async (reviewId, status) => {
        try {
            await adminApi.updateReviewStatus(accessToken, reviewId, status);
            Swal.fire("Thành công!", "Cập nhật trạng thái thành công.", "success");
            fetchReviews();

            // Cập nhật thông tin chi tiết đánh giá nếu đang được hiển thị
            if (selectedReview && selectedReview.id === reviewId) {
                fetchReviewDetail(reviewId);
            }
        } catch (error) {
            console.error("❌ Lỗi cập nhật trạng thái:", error);
            Swal.fire("Lỗi!", "Không thể cập nhật trạng thái", "error");
        }
    };

    // 📌 Gửi phản hồi mới
    const handleReply = async () => {
        if (!replyContent.trim()) {
            Swal.fire("Lỗi!", "Nội dung phản hồi không được để trống.", "warning");
            return;
        }

        try {
            await adminApi.replyToReview(accessToken, selectedReview.id, replyContent);
            Swal.fire("Thành công!", "Phản hồi đã được gửi.", "success");
            setReplyContent("");

            // Cập nhật thông tin chi tiết đánh giá và danh sách
            fetchReviewDetail(selectedReview.id);
            fetchReviews();
        } catch (error) {
            console.error("❌ Lỗi gửi phản hồi:", error);
            Swal.fire("Lỗi!", "Không thể gửi phản hồi", "error");
        }
    };

    // 📌 Bắt đầu chỉnh sửa phản hồi
    const startEditReply = (reply) => {
        setEditingReply({
            id: reply.id,
            content: reply.content
        });
    };

    // 📌 Cập nhật nội dung phản hồi đang chỉnh sửa
    const handleEditReplyChange = (e) => {
        setEditingReply(prev => ({
            ...prev,
            content: e.target.value
        }));
    };

    // 📌 Cập nhật phản hồi
    const handleUpdateReply = async () => {
        if (!editingReply || !editingReply.content.trim()) {
            Swal.fire("Lỗi!", "Nội dung phản hồi không được để trống.", "warning");
            return;
        }

        try {
            await adminApi.updateReply(accessToken, editingReply.id, editingReply.content);
            Swal.fire("Thành công!", "Cập nhật phản hồi thành công.", "success");
            setEditingReply(null);

            // Cập nhật thông tin chi tiết đánh giá và danh sách
            if (selectedReview) {
                fetchReviewDetail(selectedReview.id);
            }
            fetchReviews();
        } catch (error) {
            console.error("❌ Lỗi cập nhật phản hồi:", error);
            Swal.fire("Lỗi!", "Không thể cập nhật phản hồi", "error");
        }
    };

    // 📌 Xóa phản hồi
    const handleDeleteReply = async (replyId) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn xóa phản hồi này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff6683",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            });

            if (result.isConfirmed) {
                await adminApi.deleteReply(accessToken, replyId);
                Swal.fire("Thành công!", "Đã xóa phản hồi.", "success");

                // Cập nhật thông tin chi tiết đánh giá và danh sách
                if (selectedReview) {
                    fetchReviewDetail(selectedReview.id);
                }
                fetchReviews();
            }
        } catch (error) {
            console.error("❌ Lỗi xóa phản hồi:", error);
            Swal.fire("Lỗi!", "Không thể xóa phản hồi", "error");
        }
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 sm:ml-60 overflow-x-auto min-h-screen mt-20 bg-gray-100">
                <h2 className="text-2xl font-bold text-[#ff6683] mb-6">Quản lý Đánh Giá</h2>

                {/* 📌 Bộ lọc */}
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-bold mb-3 text-[#ff6683]">Bộ lọc</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Trạng thái</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Tất cả</option>
                                <option value="pending">Chờ duyệt</option>
                                <option value="approved">Đã duyệt</option>
                                <option value="rejected">Đã từ chối</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">ID Sản phẩm</label>
                            <input
                                type="text"
                                name="product_id"
                                value={filters.product_id}
                                onChange={handleFilterChange}
                                placeholder="Nhập ID sản phẩm"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <button
                                onClick={applyFilters}
                                className="bg-[#ff6683] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition"
                            >
                                Lọc
                            </button>
                            <button
                                onClick={clearFilters}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
                            >
                                Xóa lọc
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-[#ff6683] text-lg font-semibold">Đang tải danh sách...</p>
                ) : reviews.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-[#ff6683] text-white text-left">
                                    <th className="py-3 px-4 border">STT</th>
                                    <th className="py-3 px-4 border">Người Đánh Giá</th>
                                    <th className="py-3 px-4 border">Nội Dung</th>
                                    <th className="py-3 px-4 border">Trạng Thái</th>
                                    <th className="py-3 px-4 border">Ngày Đánh Giá</th>
                                    <th className="py-3 px-4 border">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review, index) => (
                                    <tr key={review.id} className="text-center border bg-gray-50 hover:bg-gray-100">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{review.user.name}</td>
                                        <td className="py-3 px-4">{review.comment}</td>
                                        <td className="py-3 px-4 font-bold">
                                            {review.status === "pending" ? (
                                                <span className="text-yellow-500">Chờ duyệt</span>
                                            ) : review.status === "approved" ? (
                                                <span className="text-green-500">Đã duyệt</span>
                                            ) : (
                                                <span className="text-red-500">Đã từ chối</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{new Date(review.created_at).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 flex justify-center gap-2">
                                            <button
                                                onClick={() => handleUpdateStatus(review.id, "approved")}
                                                className="bg-[#ff6683] text-white px-3 py-1 rounded-md hover:bg-pink-700 transition"
                                                disabled={review.status === "approved"}
                                            >
                                                Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(review.id, "rejected")}
                                                className="bg-[#ff6683] text-white px-3 py-1 rounded-md hover:bg-pink-700 transition"
                                                disabled={review.status === "rejected"}
                                            >
                                                Từ chối
                                            </button>
                                            <button
                                                onClick={() => handleViewReview(review)}
                                                className="bg-[#ff6683] text-white px-3 py-1 rounded-md hover:bg-pink-700 transition"
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
                    <p className="text-center text-[#ff6683] text-xl font-semibold mt-6">Không có đánh giá nào</p>
                )}
            </div>

            {/* 📌 Modal Chi Tiết Đánh Giá */}
            {selectedReview && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[70%] overflow-y-auto ml-60">
                        <h2 className="text-xl font-bold mb-4 text-[#ff6683]">Chi Tiết Đánh Giá</h2>
                        <p><strong>Người đánh giá:</strong> {selectedReview.user.name}</p>
                        {/* <p><strong>Email:</strong> {selectedReview.user.email}</p> */}
                        <p><strong>Nội dung:</strong> {selectedReview.comment}</p>
                        <p><strong>Sản phẩm:</strong> {selectedReview.product ? selectedReview.product.name : 'N/A'}</p>
                        <p><strong>Điểm đánh giá:</strong> {selectedReview.rating} / 5</p>

                        {/* Hiển thị danh sách phản hồi hiện có */}
                        {selectedReview.replies && selectedReview.replies.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-bold">Phản hồi hiện tại:</h3>
                                {selectedReview.replies.map(reply => (
                                    <div key={reply.id} className="bg-gray-50 p-3 rounded mb-2 border">
                                        {editingReply && editingReply.id === reply.id ? (
                                            <>
                                                <textarea
                                                    className="border p-2 w-full"
                                                    value={editingReply.content}
                                                    onChange={handleEditReplyChange}
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={handleUpdateReply}
                                                        className="bg-[#ff6683] text-white px-3 py-1 rounded-md hover:bg-pink-700 transition"
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingReply(null)}
                                                        className="bg-gray-300 text-black px-3 py-1 rounded-md hover:bg-gray-400 transition"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p>{reply.content}</p>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {new Date(reply.created_at).toLocaleString()}
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => startEditReply(reply)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
                                                    >
                                                        Chỉnh sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReply(reply.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <h3 className="text-lg font-bold mt-4">Thêm phản hồi mới:</h3>
                        <textarea className="border p-2 w-full mt-3" placeholder="Nhập phản hồi..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleReply} className="bg-[#ff6683] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition">
                                Gửi Phản Hồi
                            </button>
                            <button onClick={() => setSelectedReview(null)} className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageReviews;