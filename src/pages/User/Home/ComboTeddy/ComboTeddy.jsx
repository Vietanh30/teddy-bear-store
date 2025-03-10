import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import ComboTeddy1 from "../../../../assets/Home/combo1.png";

const ComboTeddy = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const slideContainerRef = useRef(null);

    // Images with correct src import
    const slides = [
        {
            src: ComboTeddy1,
            alt: 'Combo Teddy 1',
            title: "TEAM VÀNG BỪNG NGỜ CHO HỆ RỰC RỠ"
        },
        {
            src: ComboTeddy1,
            alt: 'Combo Teddy 2',
            title: "VUI TRÙY QUÀ TẶNG CHO BÉ TRAI"
        },
        {
            src: ComboTeddy1,
            alt: 'Combo Teddy 3',
            title: "VUI TRÙY QUÀ TẶNG CHO BÉ GÁI"
        },
        {
            src: ComboTeddy1,
            alt: 'Combo Teddy 4',
            title: "COMBO MỚI NHẤT"
        },
        {
            src: ComboTeddy1,
            alt: 'Combo Teddy 5',
            title: "DEAL HẤP DẪN"
        },
        {
            src: ComboTeddy1,
            alt: 'Combo Teddy 6',
            title: "QUÀ TẶNG YÊU THƯƠNG"
        },
    ];

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 < Math.ceil(slides.length / 3) ? prevIndex + 1 : 0
        );
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : Math.ceil(slides.length / 3) - 1
        );
    };

    // Auto-advance slides
    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 8000);
        return () => clearInterval(slideInterval);
    }, []);

    // Handle transition end
    useEffect(() => {
        const handleTransitionEnd = () => {
            setIsTransitioning(false);
        };

        const slideContainer = slideContainerRef.current;
        if (slideContainer) {
            slideContainer.addEventListener('transitionend', handleTransitionEnd);
            return () => {
                slideContainer.removeEventListener('transitionend', handleTransitionEnd);
            };
        }
    }, []);

    // Prepare slides for smooth sliding
    const preparedSlides = [
        ...slides,
        ...slides.slice(0, 3)  // Add first 3 slides to the end for infinite loop
    ];

    return (
        <div className="relative w-full py-10 overflow-hidden">
            <div className="container mx-auto relative">
                <div className="text-center text-2xl font-black text-[#ff6683]">Bộ sưu tập gấu bông</div>
                <div className="border-b-2 border-[#02c4c1] my-5"></div>
                {/* Navigation Arrow Left */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 top-[40%] flex items-center  transform -translate-y-1/2 z-10 text-white bg-[#02c4c1] hover:bg-[#30b7b5] rounded-full transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-xl px-3 py-2" />
                </button>

                {/* Carousel Container */}
                <div className="w-full overflow-hidden">
                    <div
                        ref={slideContainerRef}
                        className="flex transition-transform duration-1000 ease-in-out"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                        }}
                    >
                        {preparedSlides.map((slide, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-full grid grid-cols-3 gap-4"
                            >
                                <div className="relative group overflow-hidden cursor-pointer">
                                    <img
                                        src={slide.src}
                                        alt={slide.alt}
                                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Title Overlay */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium text-start truncate text-[#333]">
                                            {slide.title}
                                        </h3>
                                    </div>
                                </div>
                                {preparedSlides.slice(index + 1, index + 3).map((nextSlide, nextIndex) => (
                                    <div
                                        key={`${index}-${nextIndex}`}
                                        className="relative group overflow-hidden cursor-pointer"
                                    >
                                        <img
                                            src={nextSlide.src}
                                            alt={nextSlide.alt}
                                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Title Overlay */}
                                        <div className=" p-3">
                                            <h3 className="text-sm font-medium text-start truncate text-[#333]">
                                                {nextSlide.title}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )).slice(0, Math.ceil(slides.length / 3) + 1)}
                    </div>
                </div>

                {/* Navigation Arrow Right */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 top-[40%] flex items-center  transform -translate-y-1/2 z-10 text-white bg-[#02c4c1] hover:bg-[#30b7b5] rounded-full transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-xl px-3 py-2" />
                </button>

                {/* Dot Indicators
                <div className="flex justify-center mt-6 space-x-2">
                    {[...Array(Math.ceil(slides.length / 3))].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isTransitioning) {
                                    setCurrentIndex(index);
                                }
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index
                                ? 'bg-pink-500'
                                : 'bg-gray-300 hover:bg-pink-300'
                                }`}
                        />
                    ))}
                </div> */}
            </div>
            <div className='mt-8 flex justify-center'>
                <button className='uppercase flex items-center text-sm font-bold px-8 py-2 bg-[#ff6683] rounded-lg text-white transition-colors duration-300 hover:bg-[#02c4c1]'>
                    <span>
                        Xem thêm
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ComboTeddy;