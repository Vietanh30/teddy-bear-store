
// ProductFeatures.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const ProductFeatures = () => {
    const features = [
        'Giao Hàng Nội Thành Hà Nội Chỉ 30P',
        'Gói Quà - Nén Nhỏ Gấu - Tặng Thiệp Miễn Phí',
        'Địa Chỉ Shop Dễ Tìm - Có Chỗ Để Xe Ô Tô Miễn Phí',
        '100% Gòn Cao Cấp',
        'Bảo Hành Đường Chỉ Vĩnh Viễn - Bảo Hành Bông Gấu 1 năm',
        'Hơn 500 Mẫu Có Sẵn tại Shop'
    ];

    return (
        <div className='mt-3 grid grid-cols-1 md:grid-cols-2 gap-2'>
            {features.map((feature, i) => (
                <div key={i} className='flex gap-1'>
                    <FontAwesomeIcon icon={faCheck} className="text-[#777] text-lg flex-shrink-0" />
                    <span className='text-base'>{feature}</span>
                </div>
            ))}
        </div>
    );
};

export default ProductFeatures;
