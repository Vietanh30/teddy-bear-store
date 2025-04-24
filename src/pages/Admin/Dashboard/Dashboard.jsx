import { useEffect, useState } from "react";
import Sidebar from "../../../components/SideBar/Sidebar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import adminApi from "../../../api/AdminApi/adminApi";
import { getAccessTokenFromLS } from "../../../utils/auth";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const access_token = getAccessTokenFromLS();

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await adminApi.getDashboard(access_token);
                setDashboardData(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu dashboard:", error);
            }
        }
        fetchDashboardData();
    }, []);

    if (!dashboardData) {
        return <div className="text-center text-lg font-semibold mt-10">Đang tải dữ liệu...</div>;
    }

    const { orders, invoices, variants, users, revenue } = dashboardData;
    console.log("dashboardData", dashboardData)
    const orderChartData = {
        labels: ["Hoàn thành", "Đã hủy"],
        datasets: [
            {
                label: "Số lượng đơn hàng",
                data: [orders.completed, orders.canceled],
                backgroundColor: ["#4CAF50", "#FF0000"],
            },
        ],
    };

    const variantChartData = {
        labels: ["Tổng biến thể", "Hết hàng", "Còn hàng", "Đang giảm giá"],
        datasets: [
            {
                label: "Số lượng",
                data: [variants.total, variants.out_of_stock, variants.in_stock, variants.discounted],
                backgroundColor: ["#ff6683", "#FF0000", "#4CAF50", "#FFD700"],
            },
        ],
    };
    function formatCurrency(value) {
        if (!value) return '0 đ';

        // Chuyển sang dạng số thực, làm tròn 0 chữ số thập phân nếu không có phần thập phân
        return Number(value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }


    return (
        <div className="flex">
            <Sidebar />
            <div className="p-4 sm:ml-60 w-full min-h-screen mt-20">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
                    <div className="p-4 bg-blue-500 text-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Tổng đơn hàng</h2>
                        <p className="text-xl">{orders.total}</p>
                    </div>
                    <div className="p-4 bg-green-500 text-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Hóa đơn đã thanh toán</h2>
                        <p className="text-xl">{formatCurrency(invoices.total_paid)}</p>
                    </div>
                    <div className="p-4 bg-pink-500 text-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Tổng biến thể</h2>
                        <p className="text-xl">{variants.total}</p>
                    </div>
                    <div className="p-4 bg-yellow-500 text-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Người dùng</h2>
                        <p className="text-xl">{users.total}</p>
                    </div>
                    <div className="p-4 bg-purple-500 text-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Doanh thu tháng</h2>
                        <p className="text-xl">{formatCurrency(revenue.monthly)}</p>
                    </div>
                    <div className="p-4 bg-indigo-500 text-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Doanh thu tuần</h2>
                        <p className="text-xl">{formatCurrency(revenue.weekly)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Thống kê đơn hàng</h2>
                        <Bar data={orderChartData} />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Thống kê biến thể</h2>
                        <Bar data={variantChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
