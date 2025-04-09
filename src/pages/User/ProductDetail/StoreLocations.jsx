// StoreLocations.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const StoreLocations = () => {
    const storeLocations = [
        { address: 'Cầu bản, Vũ Lạc, Thành Phố Thái Bình', phone: '093.828.6616' },
    ];

    const contacts = [
        { label: 'Đặt hàng Online', phone: '0334275421' },
        { label: 'Mua hàng buôn/ sỉ', phone: '0819598388' },
        { label: 'Hotline phản ánh SP/ DV', phone: '0819598388' }
    ];

    return (
        <>
            <div className='text-[#ff6683] font-bold mt-3 text-lg'>Thái Bình | 8:30 - 23:00</div>
            {storeLocations.map((store, i) => (
                <div key={i} className="mt-2 flex items-start gap-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-sm text-[#777] flex-shrink-0" />
                    <span className='text-sm'>{store.address} - {store.phone}</span>
                </div>
            ))}
            {contacts.map((contact, i) => (
                <div key={i} className="mt-2 font-semibold uppercase text-[#ff6683]">
                    {contact.label}: {contact.phone}
                </div>
            ))}
        </>
    );
};

export default StoreLocations;