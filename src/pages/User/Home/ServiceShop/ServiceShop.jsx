import Service1 from "../../../../assets/Home/service1.png"
import Service2 from "../../../../assets/Home/service2.png"
import Service3 from "../../../../assets/Home/service3.png"
import Service4 from "../../../../assets/Home/service4.png"
import Service5 from "../../../../assets/Home/service5.png"
function ServiceShop() {
    return (
        <>
            <div className="container mx-auto mt-5">
                <div className="grid grid-cols-5 justify-between">
                    <div className="mx-auto">
                        <img className="h-16 w-auto mx-auto" src={Service1} alt="" />
                        <div className="uppercase mt-2 text-sm font-medium">Giao hàng tận nhà</div>
                    </div>
                    <div className="mx-auto">
                        <img className="h-16 w-auto mx-auto" src={Service2} alt="" />
                        <div className="uppercase mt-2 text-sm font-medium">Bọc quà giá rẻ</div>
                    </div>
                    <div className="mx-auto">
                        <img className="h-16 w-auto mx-auto" src={Service3} alt="" />
                        <div className="uppercase mt-2 text-sm font-medium">Tặng thiệp miễn phí</div>
                    </div>
                    <div className="mx-auto">
                        <img className="h-16 w-auto mx-auto" src={Service4} alt="" />
                        <div className="uppercase mt-2 text-sm font-medium">Giặt gấu bông    </div>
                    </div>
                    <div className="mx-auto">
                        <img className="h-16 w-auto mx-auto" src={Service5} alt="" />
                        <div className="uppercase mt-2 text-sm font-medium">Nén nhỏ gấu</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ServiceShop;