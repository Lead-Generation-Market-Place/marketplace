// ServiceCard.tsx
import Image from "next/image";
import { Service } from "./types"; // Import the Service type

interface ServiceCardProps {
  service: Service;  // Define the type of the service prop
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white hover:shadow-md border border-gray-100 transition-shadow duration-200 p-2 flex flex-col items-center">
      <div className="relative w-full h-40">
        <Image
          src={service.image}
          alt={service.serviceName}
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
          From <span className="text-gray-500 font-semibold">${service.priceFrom}</span>
          {" "}to <span className="text-gray-500 font-semibold">${service.priceTo}</span>
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
