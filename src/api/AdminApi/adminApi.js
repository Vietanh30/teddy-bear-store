import { http } from "../../constants/config";
export const URL_DASHBOARD = "admin/dashboard";
export const URL_MANAGE_USER = "admin/users";
export const URL_MANAGE_ORDER = "admin/orders";
export const URL_GET_REVIEWS = "admin/reviews";
export const URL_UPDATE_REVIEW_STATUS = "admin/reviews"; // Sửa thành URL base, sẽ thêm /{id}/status sau
export const URL_REPLY_REVIEWS = "admin/reviews"; // Sửa thành URL base, sẽ thêm /{review_id}/reply sau
export const URL_MANAGE_REPLIES = "admin/reviews/replies"; // URL base cho quản lý replies

const adminApi = {
  getDashboard: function (access_token) {
    return http.get(`${URL_DASHBOARD}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },
  getListUser: function (access_token) {
    return http.get(`${URL_MANAGE_USER}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },

  getListOrder: function (access_token) {
    return http.get(`${URL_MANAGE_ORDER}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },

  // Lấy tất cả đánh giá với tùy chọn lọc
  getReviews: function (access_token, filters = {}) {
    // Chuyển đổi filters thành query params
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.product_id)
      queryParams.append("product_id", filters.product_id);

    const url = queryParams.toString()
      ? `${URL_GET_REVIEWS}?${queryParams.toString()}`
      : URL_GET_REVIEWS;

    return http.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },

  // Cập nhật trạng thái đánh giá (approved, rejected)
  updateReviewStatus: function (access_token, reviewId, status) {
    return http.patch(
      `${URL_UPDATE_REVIEW_STATUS}/${reviewId}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  },

  // Trả lời đánh giá
  replyToReview: function (access_token, reviewId, content) {
    return http.post(
      `${URL_REPLY_REVIEWS}/${reviewId}/reply`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  },

  // Cập nhật phản hồi
  updateReply: function (access_token, replyId, content) {
    return http.put(
      `${URL_MANAGE_REPLIES}/${replyId}`,
      { content },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  },

  // Xóa phản hồi
  deleteReply: function (access_token, replyId) {
    return http.delete(`${URL_MANAGE_REPLIES}/${replyId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  },
};

export default adminApi;
