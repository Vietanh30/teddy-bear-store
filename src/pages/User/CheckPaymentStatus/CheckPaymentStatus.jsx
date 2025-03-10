import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userApi from "../../../api/UserApi/userApi";
import Swal from "sweetalert2";
import path from "../../../constants/path";
import { getAccessTokenFromLS } from "../../../utils/auth";

function CheckPaymentStatus() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isFetched, setIsFetched] = useState(false); // Tránh gọi API nhiều lần

    // Lấy invoice_number từ query params
    const queryParams = new URLSearchParams(location.search);
    const invoice_number = queryParams.get("invoice_number");

    useEffect(() => {
        async function fetchPaymentStatus() {
            if (!invoice_number || isFetched) return; // Tránh gọi API lại nếu đã fetch

            setIsFetched(true); // Đánh dấu đã fetch để không gọi lại

            try {
                const access_token = getAccessTokenFromLS();
                const response = await userApi.getPaymenStatus(access_token, invoice_number);

                if (response.data.status === "success") {
                    Swal.fire({
                        icon: "success",
                        title: "Thanh toán thành công!",
                        text: response.data.message || "Giao dịch đã được xử lý.",
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        navigate(path.historyOrder);
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Thanh toán thất bại!",
                        text: response.data.message || "Có lỗi xảy ra trong quá trình xử lý.",
                        timer: 3000,
                        showConfirmButton: false
                    }).then(() => {
                        navigate(path.historyOrder);
                    });
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra trạng thái thanh toán:", error);
                Swal.fire({
                    icon: "error",
                    title: "Lỗi hệ thống!",
                    text: "Vui lòng thử lại sau.",
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    navigate(path.home);
                });
            }
        }

        fetchPaymentStatus();
    }, [invoice_number, navigate, isFetched]);

    return <></>;
}

export default CheckPaymentStatus;
