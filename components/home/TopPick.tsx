
import ServiceCard from "../elements/ServiceCard";
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
    <div className="w-full max-w-6xl mx-auto px-2">
        <h2 className="text-xl font-semibold py-1">
            Top Picks for You
        </h2>
       <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
      {services.map((service, idx) => (
        <ServiceCard key={idx} service={service} />
      ))}
    </div>
    </div>
  );
}
export default TopPick;