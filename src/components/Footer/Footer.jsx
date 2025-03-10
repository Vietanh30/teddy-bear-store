import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Facebook from "../../assets/Home/facebook.png"
import Tiktok from "../../assets/Home/tiktok.png"
import Instagram from "../../assets/Home/instagram.png"
import Shopee from "../../assets/Home/shopee.png"
import Location from "../../assets/Home/location.png"
import Youtube from "../../assets/Home/youtube.png"
function Footer() {
    return (
        <>
            <footer className="bg-[#feb0bd] text-white">
                <div className="border-b-4 border-[#02c4c1] my-3 w-full"></div>
                <div className="container mx-auto">
                    <div className="grid grid-cols-3 py-6 gap-8">
                        <div className="col-span-1">
                            <div className="text-base font-semibold uppercase">
                                Hệ thống cửa hàng

                            </div>
                            <div className="mt-2 font-semibold uppercase">
                                Hà Nội | 8:30 - 23:00
                            </div>
                            <div className="mt-2 flex items-start gap-1 ">
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                                </div>
                                <div className='text-sm'>
                                    114 Cách Mạng Tháng 8, Phường 7, Quận 3, Hồ Chí Minh - 093.828.6616
                                </div>
                            </div>
                            <div className="mt-2 flex items-start gap-1 ">
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                                </div>
                                <div className='text-sm'>
                                    555 Quang Trung, Phường 10, Gò Vấp, Hồ Chí Minh - 037.838.6616
                                </div>
                            </div>
                            <div className="mt-2 flex items-start gap-1 ">
                                <div>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm" />
                                </div>
                                <div className='text-sm'>
                                    114 Cách Mạng Tháng 8, Phường 7, Quận 3, Hồ Chí Minh - 093.828.6616
                                </div>
                            </div>
                            <div className="mt-2 font-semibold uppercase">
                                Đặt hàng Online: 09.3377.6616
                            </div>

                            <div className="mt-2 font-semibold uppercase">
                                Mua hàng buôn/ sỉ: 03.9797.6616
                            </div>

                            <div className="mt-2 font-semibold uppercase">
                                Hotline phản ánh SP/ DV: 039.333.6616
                            </div>
                            <div className='mt-4 text-sm'>
                                HKD GẤU BÔNG ONLINE <br />
                                - Số ĐKKD 01G8018649 do UBND Q. Cầu Giấy cấp ngày 28/07/2012 <br />
                                - Người đại diện: Nguyễn Phương Hoa

                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="text-base font-semibold uppercase">
                                Chuyển khoản online

                            </div>

                            <div className='text-sm mt-2'>
                                + MBBANK
                            </div>
                            <div className='text-sm mt-2'>
                                Ngân hàng Quân Đội – Chi nhánh Đường 3 tháng

                            </div>
                            <div className='text-sm mt-2'>
                                Chủ TK : Nguyễn Linh Chi Hoa – STK: 80933776616

                            </div>
                            <div className='text-sm mt-2'>
                                +  Xem chi tiết các TK ngân hàng
                            </div>
                            <div className='text-sm mt-2'>
                                +  VNPAY
                            </div>

                            <div className="mt-2 font-semibold uppercase">
                                HỖ TRỢ KHÁCH HÀNG
                            </div>
                            <ul className='list-disc mt-2 ms-8'>
                                <li className='text-sm'>
                                    Chính sách bán Buôn – Sỉ
                                </li>
                                <li className='text-sm'>
                                    Chính sách chung
                                </li>

                                <li className='text-sm'>
                                    Chính sách bảo mật thông tin
                                </li>
                                <li className='text-sm'>
                                    Bảo hành & Đổi trả
                                </li>
                                <li className='text-sm'>
                                    Giới thiệu & Liên hệ
                                </li>

                            </ul>

                        </div>
                        <div className="col-span-1">
                            <div className="text-base font-semibold uppercase">
                                Xem Gấu Bông với
                            </div>
                            <div className='grid grid-cols-3 gap-x-12'>
                                <div className="col-span-1">
                                    <img className='w-full h-auto cursor-pointer' src={Facebook} alt="" />
                                </div>
                                <div className="col-span-1">
                                    <img className='w-full h-auto cursor-pointer' src={Instagram} alt="" />

                                </div>
                                <div className="col-span-1">
                                    <img className='w-full h-auto cursor-pointer' src={Tiktok} alt="" />

                                </div>
                                <div className="col-span-1">
                                    <img className='w-full h-auto cursor-pointer' src={Shopee} alt="" />

                                </div>

                                <div className="col-span-1">
                                    <img className='w-full h-auto cursor-pointer' src={Location} alt="" />

                                </div>

                                <div className="col-span-1">
                                    <img className='w-full h-auto cursor-pointer' src={Youtube} alt="" />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border border-[#02c4c1] my-3 w-full"></div>
                <div className='text-white text-center pb-3 text-sm'>©2013 – 2023 Gaubongonline.com.vn</div>
            </footer>
        </>
    );
}

export default Footer;