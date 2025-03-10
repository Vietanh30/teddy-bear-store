import { useState, useEffect } from "react";
import Sidebar from "../../../components/SideBar/Sidebar";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddValueAttribute from "./AddValueAttributes/AddValueAttributes";
import EditValueAttribute from "./EditValueAttributes/EditValueAttributes";
import { getAccessTokenFromLS } from "../../../utils/auth";
import attributeValueApi from "../../../api/AdminApi/AttributeValueApi/AttributeValueApi";

function ManageValueAttributes() {
    const [valueAttributes, setValueAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const access_token = getAccessTokenFromLS();

    useEffect(() => {
        fetchValueAttributes();
    }, []);

    const fetchValueAttributes = async () => {
        setLoading(true);
        try {
            const response = await attributeValueApi.getListAttributeValues(access_token);
            console.log("🚀 API Response:", response);

            if (response.status === 200 && response.data && Array.isArray(response.data.data)) {
                setValueAttributes(response.data.data);
            } else {
                setValueAttributes([]);
            }
        } catch (error) {
            console.error("❌ Lỗi API:", error);
            Swal.fire("Lỗi!", "Không thể tải danh sách giá trị thuộc tính", "error");
            setValueAttributes([]);
        }
        setLoading(false);
    };

    const handleDeleteAttribute = (id) => {
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await attributeValueApi.deleteAttributeValue(access_token, id);
                    Swal.fire("Đã xóa!", "Giá trị thuộc tính đã bị xóa.", "success");
                    fetchValueAttributes();
                } catch (error) {
                    Swal.fire("Lỗi!", "Xóa giá trị thuộc tính thất bại!", "error");
                }
            }
        });
    };

    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-60 overflow-x-auto min-h-screen mt-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#ff6683]">Quản lý Giá Trị Thuộc Tính</h2>
                    <button className="bg-[#ff6683] text-white px-4 py-2 rounded-md font-bold hover:bg-[#d8576d] transition" onClick={() => setIsAdding(true)}>
                        Thêm giá trị thuộc tính
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Đang tải danh sách...</p>
                ) : valueAttributes.length === 0 ? (
                    <p className="text-center text-gray-500">Không có giá trị thuộc tính nào.</p>
                ) : (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-[#ff6683] text-white">
                                <th className="py-2 px-4 border">STT</th>
                                <th className="py-2 px-4 border">Loại Thuộc Tính</th>
                                <th className="py-2 px-4 border">Giá Trị</th>
                                <th className="py-2 px-4 border">Giá Trị Hiển Thị</th>
                                <th className="py-2 px-4 border">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {valueAttributes.map((attribute, index) => (
                                <tr key={attribute.id} className="text-center border">
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{attribute.attribute_type_id}</td>
                                    <td className="py-2 px-4">{attribute.value}</td>
                                    <td className="py-2 px-4">{attribute.display_value}</td>
                                    <td className="py-2 px-4 flex justify-center space-x-1">
                                        <button className="px-1 py-1 rounded flex items-center gap-1" onClick={() => setSelectedAttribute(attribute)}>
                                            <FontAwesomeIcon className="text-[#ff6683] hover:text-pink-600" icon={faPen} />
                                        </button>
                                        <button className="px-1 py-1 rounded flex items-center gap-1" onClick={() => handleDeleteAttribute(attribute.id)}>
                                            <FontAwesomeIcon className="text-red-500 hover:text-red-700" icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Hiển thị modal thêm giá trị thuộc tính */}
            {isAdding && <AddValueAttribute onClose={() => setIsAdding(false)} onSuccess={fetchValueAttributes} />}

            {/* Hiển thị modal chỉnh sửa giá trị thuộc tính */}
            {selectedAttribute && <EditValueAttribute attribute={selectedAttribute} onClose={() => setSelectedAttribute(null)} onSuccess={fetchValueAttributes} />}
        </>
    );
}

export default ManageValueAttributes;
