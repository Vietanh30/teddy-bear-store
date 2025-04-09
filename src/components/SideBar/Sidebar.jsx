import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faTags,
    faBoxOpen,
    faUser,
    faComments,
    faFileInvoiceDollar,
    faSignOutAlt,
    faCogs,
    faList,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Home/logo.png";
import { useLocation } from "react-router-dom";
import path from "../../constants/path";
import { clearLS } from "../../utils/auth";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (targetPath) => location.pathname === targetPath;

    const handleLogOut = () => {
        clearLS();
        navigate(path.login);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 z-40 w-full bg-[#ff6683]">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start">
                            <Link to={path.dashboard} className="flex items-center cursor-pointer">
                                <img className="w-20" src={Logo} alt="Logo" />
                                <div className="text-[24px] text-white font-black uppercase">TIỆM NHÀ RABBIT</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 z-30 w-60 h-screen pt-20 bg-[#FDE2E4] border-r border-gray-200 sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-6 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {/* Thống kê */}
                        <li className="group">
                            <Link to={path.dashboard} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.dashboard) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faChartLine} className={`mr-2 ${isActive(path.dashboard) ? "text-white" : "text-[#ff6683]"} group-hover:text-white`} />
                                <span className="ms-3">Thống kê</span>
                            </Link>
                        </li>

                        {/* Quản lý thể loại */}
                        <li className="group">
                            <Link to={path.manageCategory} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageCategory) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faTags} className={`mr-2 ${isActive(path.manageCategory) ? "text-white" : "text-[#ff6683]"} group-hover:text-white`} />
                                <span className="ms-3">Quản lý thể loại</span>
                            </Link>
                        </li>

                        {/* Quản lý sản phẩm */}
                        <li className="group">
                            <Link to={path.manageProducts} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageProducts) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faBoxOpen} className={`mr-2 ${isActive(path.manageProducts) ? "text-white" : "text-[#ff6683]"} group-hover:text-white`} />
                                <span className="ms-3">Quản lý sản phẩm</span>
                            </Link>
                        </li>

                        {/* Quản lý loại thuộc tính */}
                        <li className="group">
                            <Link to={path.manageTypeAttributes} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageTypeAttributes) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faCogs} className={`mr-2 ${isActive(path.manageTypeAttributes) ? "text-white" : "text-[#ff6683]"} group-hover:text-white`} />
                                <span className="ms-3">Quản lý loại thuộc tính</span>
                            </Link>
                        </li>

                        {/* Quản lý giá trị thuộc tính */}
                        <li className="group">
                            <Link to={path.manageValueAttributes} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageValueAttributes) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faList} className={`mr-2 ${isActive(path.manageValueAttributes) ? "text-white" : "text-[#ff6683]"} group-hover:text-white`} />
                                <span className="ms-3">Quản lý giá trị thuộc tính</span>
                            </Link>
                        </li>

                        {/* Quản lý người dùng */}
                        <li className="group">
                            <Link to={path.manageUsers} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageUsers) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faUser} className="mr-2 group-hover:text-white" />
                                <span className="ms-3">Quản lý khách hàng</span>
                            </Link>
                        </li>

                        {/* Quản lý nhận xét */}
                        <li className="group">
                            <Link to={path.manageReviews} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageReviews) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faComments} className="mr-2 group-hover:text-white" />
                                <span className="ms-3">Quản lý nhận xét</span>
                            </Link>
                        </li>

                        {/* Quản lý hóa đơn */}
                        <li className="group">
                            <Link to={path.manageInvoices} className={`flex items-center p-2 rounded-lg font-semibold text-sm group ${isActive(path.manageInvoices) ? "bg-[#ff6683] text-white" : "text-[#ff6683] hover:bg-[#ff6683] hover:text-white"}`}>
                                <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2 group-hover:text-white" />
                                <span className="ms-3">Quản lý đơn hàng</span>
                            </Link>
                        </li>

                        {/* Đăng xuất */}
                        <li className="group">
                            <button onClick={handleLogOut} className="w-full flex items-center p-2 rounded-lg font-semibold text-sm text-[#ff6683] hover:bg-[#ff6683] hover:text-white">
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-[#ff6683] group-hover:text-white" />
                                <span className="ms-3">Đăng xuất</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
