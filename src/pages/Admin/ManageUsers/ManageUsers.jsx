import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../../../components/SideBar/Sidebar";
import adminApi from "../../../api/AdminApi/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";

function ManageUser() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const access_token = getAccessTokenFromLS()
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getListUser(access_token);
            console.log("📢 Fetched Users:", response);
            if (response.status === 200) {
                setUsers(response.data || []);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("❌ Lỗi tải danh sách người dùng:", error);
            Swal.fire("Lỗi!", "Không thể tải danh sách người dùng", "error");
        }
        setLoading(false);
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 sm:ml-60 overflow-x-auto min-h-screen mt-20 bg-gray-100">
                <h2 className="text-2xl font-bold text-[#ff6683] mb-6">Quản lý Người Dùng</h2>

                {loading ? (
                    <p className="text-center text-[#ff6683] text-lg font-semibold">Đang tải danh sách...</p>
                ) : users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                            <thead>
                                <tr className="bg-[#ff6683] text-white text-left">
                                    <th className="py-3 px-4 border">STT</th>
                                    <th className="py-3 px-4 border">Họ và Tên</th>
                                    <th className="py-3 px-4 border">Email</th>
                                    <th className="py-3 px-4 border">Số điện thoại</th>
                                    <th className="py-3 px-4 border">Địa chỉ</th>
                                    <th className="py-3 px-4 border">Vai trò</th>
                                    <th className="py-3 px-4 border">Trạng thái</th>
                                    <th className="py-3 px-4 border">Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id} className="text-center border bg-gray-50 hover:bg-gray-100">
                                        <td className="py-3 px-4">{index + 1}</td>
                                        <td className="py-3 px-4">{user.name || "Chưa cập nhật"}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">{user.phone || "N/A"}</td>
                                        <td className="py-3 px-4">{user.address || "Chưa cập nhật"}</td>
                                        <td className="py-3 px-4 font-semibold capitalize">
                                            {user.role === "admin" ? (
                                                <span className="text-red-500">Quản trị viên</span>
                                            ) : (
                                                <span className="text-blue-500">Khách hàng</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.status ? (
                                                <span className="text-green-500 font-bold">Hoạt động</span>
                                            ) : (
                                                <span className="text-gray-500 font-bold">Khóa</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-[#ff6683] text-xl font-semibold mt-6">Không có người dùng nào</p>
                )}
            </div>
        </>
    );
}

export default ManageUser;
