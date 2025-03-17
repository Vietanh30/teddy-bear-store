import { useState } from "react";
import Swal from "sweetalert2";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getAccessTokenFromLS } from "../../../../utils/auth";
import categoryApi from "../../../../api/AdminApi/CategoryApi/categoryApi";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";

function AddCategory({ onClose, onSuccess }) {
    const [category, setCategory] = useState({ name: "", description: "", image: null });
    const [errors, setErrors] = useState({});
    const access_token = getAccessTokenFromLS();

    const validateForm = () => {
        let errors = {};
        if (!category.name.trim()) errors.name = "Tên thể loại không được để trống!";
        if (!category.description.trim()) errors.description = "Mô tả không được để trống!";
        if (!category.image) errors.image = "Vui lòng tải lên ảnh!";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            let formData = new FormData();
            formData.append("name", category.name);
            formData.append("description", category.description);
            formData.append("image", category.image);

            console.log("🚀 Sending FormData:", {
                name: category.name,
                description: category.description,
                image: category.image,
            });

            const response = await categoryApi.createCategory(access_token, formData);

            console.log("✅ API Response:", response);
            if (response.status === 201) {
                Swal.fire("Thành công!", "Thể loại mới đã được thêm!", "success");
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("❌ API Error:", error);

            // Xử lý lỗi trùng tên thể loại
            if (error.response?.data?.errors?.name) {
                setErrors(prev => ({
                    ...prev,
                    name: "Tên thể loại đã tồn tại, vui lòng chọn tên khác!"
                }));
                Swal.fire("Lỗi!", "Tên thể loại đã tồn tại, vui lòng chọn tên khác!", "error");
            } else {
                Swal.fire("Lỗi!", "Thêm thể loại thất bại!", "error");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ml-60">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-1/3">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2 className="text-xl font-bold text-[#ff6683] mb-4">Thêm thể loại</h2>
                <div className="space-y-2">
                    <input type="text" placeholder="Tên thể loại" className="border p-2 rounded-md w-full" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
                    {errors.name && <div className="text-red-500 text-xs mt-0">{errors.name}</div>}

                    <input type="text" placeholder="Mô tả" className="border p-2 rounded-md w-full" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} />
                    {errors.description && <div className="text-red-500 text-xs mt-0">{errors.description}</div>}

                    <ImageUpload onImageChange={(file) => setCategory({ ...category, image: file })} />
                    {errors.image && <div className="text-red-500 text-xs mt-0">{errors.image}</div>}
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">Hủy</button>
                    <button onClick={handleSubmit} className="bg-[#ff6683] text-white px-4 py-2 rounded-md">Lưu</button>
                </div>
            </div>
        </div>
    );
}

export default AddCategory;