import React from 'react';
import BannerTeddy1 from "../../../../assets/Home/teddybanner1.png";
import BannerTeddy2 from "../../../../assets/Home/teddybanner2.png";
import BannerTeddy3 from "../../../../assets/Home/teddybanner3.png";
import BannerTeddy4 from "../../../../assets/Home/teddybanner4.png";
import BannerTeddy5 from "../../../../assets/Home/teddybanner5.png";
import BannerTeddy6 from "../../../../assets/Home/teddybanner6.png";

const bannerImages = [
    BannerTeddy1, BannerTeddy2, BannerTeddy3,
    BannerTeddy4, BannerTeddy5, BannerTeddy6
];

function BannerProducts() {
    return (
        <div className="container mx-auto mt-6">
            <div className="grid grid-cols-3 gap-9">
                {bannerImages.map((image, index) => (
                    <div key={index} className="col-span-1">
                        <img
                            src={image}
                            alt={`Banner ${index + 1}`}
                            className="w-full cursor-pointer 
                                       transition duration-300 
                                       hover:scale-[1.05] 
                                       origin-center"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BannerProducts;