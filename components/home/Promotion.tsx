import Link from "next/link";
import Image from "next/image";

const Promotion = () => {
  return (
    <div className="">
        <h2 className="text-xl font-semibold">
            Promotion for Today
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#00B4D8] rounded shadow-md">
                <div className="p-6 relative overflow-hidden">
                    <div className="w-50">
                        <p className="text-sm text-[#FFD700]">#PromoToday</p>
                        <h2 className="font-semibold my-3 text-white">
                            Work with our best service providers
                        </h2>
                        <Link  href="#" className="bg-black text-white px-4 py-2 rounded-sm text-sm">Book Now</Link>
                    </div>
                    <Image
                    src="/professionals/pro3.png"
                    width={100}
                    height={100}
                    alt="Professional Image"
                    className="absolute top-1 right-0 w-40 h-40 left-45 lg:left-45 xl:left-45 md:left-30 sm:left-20 object-cover"/>
                </div>
            </div>
            <div className="bg-[#F45D01] rounded shadow-md">
                <div className="p-6 relative overflow-hidden">
                    <div className="w-50">
                        <p className="text-sm text-[#FFD700]">#PromoToday</p>
                        <h2 className="font-semibold my-3 text-white">
                            Work with our best service providers
                        </h2>
                        <Link  href="#" className="bg-black text-white px-4 py-2 rounded-sm text-sm">Book Now</Link>
                    </div>
                    <Image
                    src="/professionals/pro1.png"
                    width={100}
                    height={100}
                    alt="Professional Image"
                    className="absolute top-1 right-0 w-40 h-40 left-40 lg:left-40 xl:left-40 md:left-25 sm:left-15 object-cover"/>
                </div>
            </div>
            <div className="bg-teal-500 rounded shadow-md">
                <div className="p-6 relative overflow-hidden">
                    <div className="w-50">
                        <p className="text-sm text-[#FFD700]">#PromoToday</p>
                        <h2 className="font-semibold my-3 text-white">
                            Work with our best service providers
                        </h2>
                        <Link  href="#" className="bg-black text-white px-4 py-2 rounded-sm text-sm">Book Now</Link>
                    </div>
                    <Image
                    src="/professionals/pro2.png"
                    width={100}
                    height={100}
                    alt="Professional Image"
                    className="absolute top-1 right-0 w-40 h-40 left-45 lg:left-45 xl:left-45 md:left-30 sm:left-20 object-cover"/>
                </div>
            </div>
        </div>
    </div>
  );
}
export default Promotion;