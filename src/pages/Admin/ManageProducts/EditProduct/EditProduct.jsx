import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import categoryApi from "../../../../api/AdminApi/CategoryApi/categoryApi";
import productApi from "../../../../api/AdminApi/ProductApi/productApi";
import attributeValueApi from "../../../../api/AdminApi/AttributeValueApi/AttributeValueApi";
import { getAccessTokenFromLS } from "../../../../utils/auth";
import ImageUploadProduct from "../../../../components/ImgUploadProduct/ImgUploadProduct";

function EditProduct({ onClose, onSuccess, productId }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [variations, setVariations] = useState([]);
    const [attributeValues, setAttributeValues] = useState([]);
    const [attributeTypes, setAttributeTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const access_token = getAccessTokenFromLS();
    const BASE_URL = "http://localhost:8000/storage/";

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);

            // Fetch categories, attribute values, and product details in parallel
            const [catRes, attrRes, productRes] = await Promise.all([
                categoryApi.getListCategories(),
                attributeValueApi.getListAttributeValues(),
                productApi.getProductById(productId)
            ]);

            console.log("📢 Categories Response:", catRes);
            console.log("📢 Attribute Values Response:", attrRes);
            console.log("📢 Product Detail Response:", productRes);

            // Set categories
            setCategories(catRes.data || []);

            // Process attribute values
            const attrValues = attrRes.data.data || [];
            setAttributeValues(attrValues);

            // Extract unique attribute types
            const uniqueTypes = [];
            const typeIds = new Set();

            attrValues.forEach(attr => {
                if (!typeIds.has(attr.attribute_type_id)) {
                    typeIds.add(attr.attribute_type_id);
                    uniqueTypes.push({
                        id: attr.attribute_type_id,
                        name: attr.attribute_type.display_name
                    });
                }
            });

            setAttributeTypes(uniqueTypes);

            // Set product details
            const product = productRes.data;
            if (product) {
                setName(product.name || "");
                setDescription(product.description || "");
                setBasePrice(product.base_price || "");
                setCategoryId(product.category_id?.toString() || "");

                // Handle product images
                const productImages = product.images ? product.images.map(img => ({
                    image_path: img.image_path
                })) : [];
                setImages(productImages);

                // Process variations with correct attribute structure
                if (product.variations && product.variations.length > 0) {
                    const processedVariations = product.variations.map(v => {
                        // Process variation images
                        const variationImages = v.images ? v.images.map(img => ({
                            image_path: img.image_path
                        })) : [];

                        // Create attributeMap for each variation
                        const attributeMap = {};
                        if (v.attributes && v.attributes.length > 0) {
                            v.attributes.forEach(attr => {
                                // Use the correct property paths based on your API response
                                attributeMap[attr.attribute_value.attribute_type_id] = attr.attribute_value_id;
                            });
                        }

                        // Format attributes for submission
                        const formattedAttributes = Object.entries(attributeMap).map(([typeId, valueId]) => ({
                            attribute_type_id: parseInt(typeId),
                            attribute_value_id: valueId
                        }));

                        return {
                            id: v.id,
                            sku: v.sku || "",
                            price: v.price || "",
                            discount_price: v.discount_price || "",
                            stock_quantity: v.stock_quantity || "",
                            images: variationImages,
                            attributeMap,
                            attributes: formattedAttributes
                        };
                    });

                    setVariations(processedVariations);
                }
            }
        } catch (error) {
            console.error("❌ Lỗi tải dữ liệu:", error);
            Swal.fire("Lỗi!", "Không thể tải dữ liệu sản phẩm", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (files) => {
        console.log("📢 Uploaded Product Images:", files);
        setImages(files);
    };

    const handleVariationImageUpload = (index, files) => {
        console.log(`📢 Uploaded Images for Variation ${index}:`, files);
        const updatedVariations = [...variations];
        updatedVariations[index].images = files;
        setVariations(updatedVariations);
    };

    const handleAddVariation = () => {
        // Khởi tạo biến thể mới với một map attributes để dễ quản lý
        setVariations([
            ...variations,
            {
                sku: "",
                price: "",
                discount_price: "",
                stock_quantity: "",
                images: [],
                attributeMap: {}, // Map để lưu trữ {attribute_type_id: attribute_value_id}
                attributes: [] // Mảng cuối cùng để submit
            }
        ]);
    };

    const handleRemoveVariation = (index) => {
        const updatedVariations = [...variations];
        updatedVariations.splice(index, 1);
        setVariations(updatedVariations);
    };

    const handleVariationChange = (index, field, value) => {
        const updatedVariations = [...variations];
        updatedVariations[index][field] = value;
        setVariations(updatedVariations);
    };

    // Hàm này kiểm tra xem có biến thể nào có cùng tập hợp thuộc tính không
    const isDuplicateAttributeSet = (variationIndex, newAttributeMap) => {
        return variations.some((variation, idx) => {
            if (idx === variationIndex) return false;

            const currentMap = variation.attributeMap;

            // Kiểm tra các biến thể có các thuộc tính giống hệt nhau
            if (Object.keys(currentMap).length !== Object.keys(newAttributeMap).length) {
                return false;
            }

            for (const typeId in currentMap) {
                if (!newAttributeMap[typeId] || currentMap[typeId] !== newAttributeMap[typeId]) {
                    return false;
                }
            }

            return true;
        });
    };

    const handleSelectAttribute = (index, typeId, valueId) => {
        if (!valueId) return;

        const updatedVariations = [...variations];
        const currentVariation = updatedVariations[index];

        // Tạo bản sao của attributeMap để kiểm tra trùng lặp
        const newAttributeMap = { ...currentVariation.attributeMap, [typeId]: parseInt(valueId) };

        // Kiểm tra trùng lặp tập thuộc tính giữa các biến thể
        if (isDuplicateAttributeSet(index, newAttributeMap)) {
            Swal.fire("Lỗi!", "Đã tồn tại biến thể với cùng tập thuộc tính này!", "warning");
            return;
        }

        // Cập nhật attributeMap
        currentVariation.attributeMap = newAttributeMap;

        // Tái tạo mảng attributes từ attributeMap để API submit
        currentVariation.attributes = Object.entries(newAttributeMap).map(([typeId, valueId]) => ({
            attribute_type_id: parseInt(typeId),
            attribute_value_id: valueId
        }));

        setVariations(updatedVariations);
    };

    const removeAttribute = (variationIndex, typeId) => {
        const updatedVariations = [...variations];
        const currentVariation = updatedVariations[variationIndex];

        // Xóa từ attributeMap
        const { [typeId]: removed, ...newAttributeMap } = currentVariation.attributeMap;
        currentVariation.attributeMap = newAttributeMap;

        // Cập nhật lại mảng attributes
        currentVariation.attributes = Object.entries(newAttributeMap).map(([typeId, valueId]) => ({
            attribute_type_id: parseInt(typeId),
            attribute_value_id: valueId
        }));

        setVariations(updatedVariations);
    };

    // Updated function to get attribute value display name
    const getAttributeValueName = (valueId) => {
        // Convert valueId to number for comparison (if it's a string)
        const numericValueId = parseInt(valueId);
        const value = attributeValues.find(attr => attr.id === numericValueId);
        return value ? value.display_value : "";
    };

    // Hàm xử lý việc hiển thị hình ảnh an toàn
    const renderImage = (img) => {
        if (!img || !img.image_path) return null;

        // Nếu là string (URL), hiển thị trực tiếp
        if (typeof img.image_path === 'string') {
            return <img src={`${BASE_URL}${img.image_path}`} alt="Product image" className="w-16 h-16 object-cover rounded-md border" />;
        }

        // Nếu là File object
        if (img.image_path instanceof File) {
            return <img src={URL.createObjectURL(img.image_path)} alt="Product image" className="w-16 h-16 object-cover rounded-md border" />;
        }

        // Fallback nếu không phải cả hai
        return <div className="w-16 h-16 bg-gray-200 rounded-md border flex items-center justify-center">?</div>;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📢 Updating Product:", { id: productId, name, description, basePrice, categoryId, images, variations });

        if (!name || !basePrice || !categoryId || variations.length === 0) {
            Swal.fire("Lỗi!", "Vui lòng nhập đầy đủ thông tin.", "error");
            return;
        }

        // Kiểm tra mỗi biến thể có đầy đủ thông tin
        const validVariations = variations.filter(v =>
            v.sku && v.price && v.stock_quantity && v.attributes.length > 0
        );

        if (validVariations.length === 0) {
            Swal.fire("Lỗi!", "Ít nhất phải có một biến thể hợp lệ với đầy đủ thông tin.", "error");
            return;
        }

        try {
            // Create FormData object to handle file uploads
            const formData = new FormData();

            // Append basic product info
            formData.append('name', name);
            formData.append('description', description);
            formData.append('base_price', basePrice);
            formData.append('category_id', categoryId);

            // Handle product images
            // Check if images are File objects or existing images
            images.forEach((img, index) => {
                if (img.image_path instanceof File) {
                    // If it's a new file, append it to formData
                    formData.append(`images[${index}]`, img.image_path);
                } else if (typeof img.image_path === 'string') {
                    // If it's an existing image path, send the path
                    formData.append(`existing_images[${index}]`, img.image_path);
                }
            });

            // Handle variations with their images
            variations.forEach((variation, variationIndex) => {
                // Append variation basic info
                if (variation.id) {
                    formData.append(`variations[${variationIndex}][id]`, variation.id);
                }
                formData.append(`variations[${variationIndex}][sku]`, variation.sku);
                formData.append(`variations[${variationIndex}][price]`, variation.price);
                formData.append(`variations[${variationIndex}][discount_price]`, variation.discount_price || '');
                formData.append(`variations[${variationIndex}][stock_quantity]`, variation.stock_quantity);

                // Append variation attributes
                variation.attributes.forEach((attr, attrIndex) => {
                    formData.append(
                        `variations[${variationIndex}][attributes][${attrIndex}][attribute_value_id]`,
                        attr.attribute_value_id
                    );
                });

                // Handle variation images
                variation.images.forEach((img, imgIndex) => {
                    if (img.image_path instanceof File) {
                        // If it's a new file, append it to formData
                        formData.append(`variations[${variationIndex}][images][${imgIndex}]`, img.image_path);
                    } else if (typeof img.image_path === 'string') {
                        // If it's an existing image path, send the path
                        formData.append(`variations[${variationIndex}][existing_images][${imgIndex}]`, img.image_path);
                    }
                });
            });

            // Use FormData with the API call
            await productApi.updateProduct(access_token, productId, formData);
            Swal.fire("Thành công!", "Sản phẩm đã được cập nhật.", "success");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Lỗi cập nhật sản phẩm:", error);
            Swal.fire("Lỗi!", "Cập nhật sản phẩm thất bại!", "error");
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff6683]"></div>
                        <span className="ml-3">Đang tải dữ liệu...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 ml-60 overflow-y-auto max-h-[75%] mt-15">
                <h2 className="text-xl font-bold text-[#ff6683] mb-4">Chỉnh Sửa Sản Phẩm</h2>
                <form className="text-sm" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <input type="text" placeholder="Tên sản phẩm" className="border p-2 rounded-md w-full mb-2" value={name} onChange={(e) => setName(e.target.value)} required />
                            <textarea placeholder="Mô tả" className="border p-2 rounded-md w-full mb-2" value={description} onChange={(e) => setDescription(e.target.value)} />
                            <input type="number" placeholder="Giá gốc" className="border p-2 rounded-md w-full mb-2" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />

                            <select className="border p-2 rounded-md w-full mb-2" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                                <option value="">Chọn danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>

                            <div className="mb-4">
                                <p className="font-medium mb-2">Hình ảnh sản phẩm:</p>
                                {images && images.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                {renderImage(img)}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic mb-2">Chưa có hình ảnh</p>
                                )}
                                <ImageUploadProduct onImageChange={handleImageUpload} />
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[500px] border p-4 rounded-md bg-gray-100">
                            <h3 className="text-lg font-semibold mb-2">Biến thể</h3>
                            {variations.map((variation, index) => (
                                <div key={index} className="border p-3 rounded-md mb-2 bg-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Biến thể {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVariation(index)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-md text-xs"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                    <input type="text" placeholder="SKU" className="border p-2 rounded-md w-full mb-2" value={variation.sku} onChange={(e) => handleVariationChange(index, "sku", e.target.value)} />
                                    <input type="number" placeholder="Giá" className="border p-2 rounded-md w-full mb-2" value={variation.price} onChange={(e) => handleVariationChange(index, "price", e.target.value)} />
                                    <input type="number" placeholder="Giảm giá" className="border p-2 rounded-md w-full mb-2" value={variation.discount_price} onChange={(e) => handleVariationChange(index, "discount_price", e.target.value)} />
                                    <input type="number" placeholder="Số lượng" className="border p-2 rounded-md w-full mb-2" value={variation.stock_quantity} onChange={(e) => handleVariationChange(index, "stock_quantity", e.target.value)} />

                                    <div className="mb-2">
                                        <p className="font-medium mb-1">Hình ảnh biến thể:</p>
                                        {variation.images && variation.images.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {variation.images.map((img, idx) => (
                                                    <div key={idx} className="relative">
                                                        {renderImage(img)}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic mb-2">Chưa có hình ảnh</p>
                                        )}
                                    </div>

                                    <ImageUploadProduct onImageChange={(files) => handleVariationImageUpload(index, files)} />

                                    {/* Hiển thị các thuộc tính đã chọn */}
                                    {Object.keys(variation.attributeMap || {}).length > 0 && (
                                        <div className="mb-2 p-2 border rounded bg-gray-50">
                                            <p className="font-medium mb-1">Thuộc tính đã chọn:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(variation.attributeMap).map(([typeId, valueId]) => {
                                                    const typeName = attributeTypes.find(t => t.id === parseInt(typeId))?.name || "";
                                                    return (
                                                        <div key={typeId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                                                            <span>{typeName}: {getAttributeValueName(valueId)}</span>
                                                            <button
                                                                type="button"
                                                                className="ml-1 text-blue-500 hover:text-blue-700"
                                                                onClick={() => removeAttribute(index, typeId)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* UI để chọn thuộc tính theo từng loại */}
                                    {attributeTypes.map(type => {
                                        // Kiểm tra xem thuộc tính này đã được chọn chưa
                                        const isTypeSelected = variation.attributeMap?.[type.id];
                                        if (isTypeSelected) return null; // Không hiển thị nếu đã chọn

                                        return (
                                            <div key={type.id} className="mb-2">
                                                <label className="block text-sm font-medium text-gray-700">{type.name}</label>
                                                <select
                                                    className="border p-2 rounded-md w-full"
                                                    value=""
                                                    onChange={(e) => handleSelectAttribute(index, type.id, e.target.value)}
                                                >
                                                    <option value="">Chọn {type.name}</option>
                                                    {attributeValues
                                                        .filter(attr => attr.attribute_type_id === type.id)
                                                        .map(attr => (
                                                            <option key={attr.id} value={attr.id}>
                                                                {attr.display_value}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            <button type="button" onClick={handleAddVariation} className="bg-blue-500 text-white px-3 py-1 rounded-md">+ Thêm biến thể</button>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">Hủy</button>
                        <button type="submit" className="bg-[#ff6683] text-white px-4 py-2 rounded-md">Cập nhật</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;