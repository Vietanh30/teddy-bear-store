

// Home.jsx
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header/Header";
import Navbar from "../../../components/Navbar/Navbar";
import Banner from "./Banner/Banner";
import BannerProducts from "./BannerProducts/BannerProducts";
import ListProduct from "./ListProduct.jsx/ListProduct";
import ServiceShop from "./ServiceShop/ServiceShop";
import StoryTeddy1 from "../../../assets/Home/story1.jpg";
import StoryTeddy2 from "../../../assets/Home/story2.jpg";
import StoryTeddy3 from "../../../assets/Home/story3.jpg";
import StoryTeddy4 from "../../../assets/Home/story4.jpg";
import ComboTeddy from "./ComboTeddy/ComboTeddy";
import Footer from "../../../components/Footer/Footer";
import BackToTopButton from "../../../components/BackToTopButton/BackToTopButton";
import categoryApi from "../../../api/AdminApi/CategoryApi/categoryApi";
import productApi from "../../../api/AdminApi/ProductApi/productApi";

function Home() {
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            fetchAllProductsByCategory();
        }
    }, [categories]);

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getListCategories();
            console.log("📢 Fetched Categories:", response);

            if (response.status === 200 && Array.isArray(response.data)) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("❌ Lỗi tải danh mục:", error);
            setErrorMessage("Không thể tải danh mục sản phẩm");
        }
    };

    const fetchAllProductsByCategory = async () => {
        setIsLoading(true);
        const productMap = {};

        try {
            // Fetch products for each category
            for (const category of categories) {
                const response = await productApi.searchProducts({ category_id: category.id });

                if (response.status === 200 && Array.isArray(response.data)) {
                    productMap[category.id] = response.data;
                }
            }

            setProductsByCategory(productMap);
        } catch (error) {
            console.error("❌ Lỗi tải sản phẩm:", error);
            setErrorMessage("Không thể tải sản phẩm");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Navbar />
            <Banner />
            <ServiceShop />
            <BannerProducts />
            <ListProduct
                categories={categories}
                productsByCategory={productsByCategory}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
            <section id="story-teddy">
                <div className="container mx-auto mt-10">
                    <div className="text-center text-2xl font-black text-[#ff6683]">Chuyện nhà gấu</div>
                    <div className="border-b-2 border-[#02c4c1] my-5"></div>
                    <div className="mt-3 grid grid-cols-2 gap-6">
                        <div className="grid grid-cols-6 gap-4">
                            <img className="col-span-2 w-full h-auto" src={StoryTeddy1} alt="" />
                            <div className="text-sm col-span-4">
                                <div className="uppercase hover:text-[#02c4c1]">MẸO NHẬN BIẾT 1 SHOP GẤU BÔNG UY TÍN</div>
                                <div className="mt-2 text-[#777] line-clamp-3">
                                    Hiện nay, gấu bông được bày bán ở rất nhiều nơi từ các shop, cửa hàng cao cấp đến chợ, vỉa hè… Tuy nhiên để chọn được một chú gấu chất lượng...
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <img className="col-span-2 w-full h-auto" src={StoryTeddy2} alt="" />
                            <div className="text-sm col-span-4">
                                <div className="uppercase hover:text-[#02c4c1]">Mách Bạn Cách Đo Kích Thước Gấu Bông Chính Xác Nhất</div>
                                <div className="mt-2 text-[#777] line-clamp-3">
                                    Hiện nay, gấu bông được bày bán ở rất nhiều nơi từ các shop, cửa hàng cao cấp đến chợ, vỉa hè… Tuy nhiên để chọn được một chú gấu chất lượng...
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <img className="col-span-2 w-full h-auto" src={StoryTeddy3} alt="" />
                            <div className="text-sm col-span-4">
                                <div className="uppercase hover:text-[#02c4c1]">Tổng hợp giá gấu bông teddy bạn nên biết
                                </div>
                                <div className="mt-2 text-[#777] line-clamp-3">
                                    Hiện nay, gấu bông được bày bán ở rất nhiều nơi từ các shop, cửa hàng cao cấp đến chợ, vỉa hè… Tuy nhiên để chọn được một chú gấu chất lượng...
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                            <img className="col-span-2 w-full h-auto" src={StoryTeddy1} alt="" />
                            <div className="text-sm col-span-4">
                                <div className="uppercase hover:text-[#02c4c1]">Gấu Teddy Mr Bean – món quà yêu thương dành cho mọi lứa tuổi</div>
                                <div className="mt-2 text-[#777] line-clamp-3">
                                    Hiện nay, gấu bông được bày bán ở rất nhiều nơi từ các shop, cửa hàng cao cấp đến chợ, vỉa hè… Tuy nhiên để chọn được một chú gấu chất lượng...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 flex justify-center'>
                        <button className='uppercase flex items-center text-sm font-bold px-8 py-2 bg-[#ff6683] rounded-lg text-white transition-colors duration-300 hover:bg-[#02c4c1]'>
                            <span>
                                Xem thêm
                            </span>
                        </button>
                    </div>
                </div>
            </section>
            <section id="combo-teddy">
                <ComboTeddy />
            </section>

            <ServiceShop />

            <Footer />
            <BackToTopButton />
        </>
    );
}

export default Home;