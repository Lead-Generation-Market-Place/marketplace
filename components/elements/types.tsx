export interface Service {
  image: string;  // Path to image
  serviceName: string;
  rating: number; // Rating out of 5
  reviews: number; // Number of reviews
  professional: string; // Professional name
  priceFrom: number; // Minimum price
  priceTo: number; // Maximum price
}

export type ServiceSuggestion = {
  id: string; 
  name: string;
};