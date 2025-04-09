import { http } from "../../../constants/config";

export const URL_ATTRIBUTE_TYPE = "admin/attribute-types";
export const URL_GET_ATTRIBUTE_TYPE = "attribute-types";

const attributeTypeApi = {
  // 🔹 Tạo loại thuộc tính
  createAttributeType: function (access_token, body) {
    return http.post(URL_ATTRIBUTE_TYPE, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },

  // 🔹 Lấy danh sách loại thuộc tính
  getListAttributeTypes: function (searchTerm = "") {
    const params = searchTerm ? { search: searchTerm } : {};
    return http.get(URL_GET_ATTRIBUTE_TYPE, { params });
  },

  // 🔹 Lấy loại thuộc tính theo ID
  getAttributeTypeById: function (idAttributeType) {
    return http.get(`${URL_GET_ATTRIBUTE_TYPE}/${idAttributeType}`, {});
  },

  // 🔹 Cập nhật loại thuộc tính
  updateAttributeType: function (access_token, idAttributeType, body) {
    return http.put(`${URL_ATTRIBUTE_TYPE}/${idAttributeType}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },

  // 🔹 Xóa loại thuộc tính
  deleteAttributeType: function (access_token, idAttributeType) {
    return http.delete(`${URL_ATTRIBUTE_TYPE}/${idAttributeType}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },
};

export default attributeTypeApi;
