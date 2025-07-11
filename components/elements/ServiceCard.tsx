import Image from "next/image";
import { Service } from "./types"; // Import the Service type

interface ServiceCardProps {
  service: Service;  // Define the type of the service prop
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 hover:shadow-md border border-gray-100 dark:border-gray-700 rounded-t transition-shadow duration-200 overflow-hidden flex flex-col items-center">
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
      <div className="w-full flex-1 p-2 flex flex-col justify-between pt-2">
        <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{service.serviceName}</p>
        <p className="text-xs text-gray-400 dark:text-gray-300 mb-1">
          <span className="text-green-500 font-semibold">{service.rating}&#9733;</span>
          <span> [{service.reviews}]</span>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-300 mb-1">{service.professional}</p>
        <p className="text-xs text-gray-400 dark:text-gray-300 mb-1">
          From <span className="text-gray-500 dark:text-gray-200 font-semibold">${service.priceFrom}</span>
          {" "}to <span className="text-gray-500 dark:text-gray-200 font-semibold">${service.priceTo}</span>
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;