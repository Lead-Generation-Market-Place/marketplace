import Image from "next/image";
const TopPick = () => {
    const services = [
  {
    image: "/images/image1.jpg",
    serviceName: "Service Name 1",
    rating: 4.9,
    reviews: 868,
    professional: "Professional Name 1",
    priceFrom: 200,
    priceTo: 50,
  },
  {
    image: "/images/image2.jpg",
    serviceName: "Service Name 2",
    rating: 4.9,
    reviews: 868,
    professional: "Professional Name 2",
    priceFrom: 200,
    priceTo: 50,
  },
  {
    image: "/images/image3.jpg",
    serviceName: "Service Name 3",
    rating: 4.9,
    reviews: 868,
    professional: "Professional Name 3",
    priceFrom: 200,
    priceTo: 50,
  },
  {
    image: "/images/image4.jpg",
    serviceName: "Service Name 4",
    rating: 4.9,
    reviews: 868,
    professional: "Professional Name 4",
    priceFrom: 200,
    priceTo: 50,
  },
];
  return (
    <div className="">
        <h2 className="text-xl font-semibold">
            Top Picks for You
        </h2>
       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center w-full max-w-6xl mx-auto px-2">
      {services.map((service, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-2 flex flex-col items-center"
        >
          <div className="relative w-full h-40">
            <Image
              src={service.image}
              alt="Professional Image"
              // Use fill and sizes for full container, or set width/height for fixed size
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover rounded-t"
              priority
            />
          </div>
          <div className="w-full flex-1 flex flex-col justify-between pt-2">
            <p className="text-sm font-semibold truncate">{service.serviceName}</p>
            <p className="text-xs text-gray-400 mb-1">
              <span className="text-green-500 font-semibold">{service.rating}&#9733;</span>
              <span> [{service.reviews}]</span>
            </p>
            <p className="text-xs text-gray-400 mb-1">{service.professional}</p>
            <p className="text-xs text-gray-400 mb-1">
              From <span className="text-orange-400">${service.priceFrom}</span>
              {" "}to <span className="text-orange-400">${service.priceTo}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
export default TopPick;