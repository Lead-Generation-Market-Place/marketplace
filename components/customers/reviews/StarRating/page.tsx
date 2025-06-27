'use client';

import { FaStar } from 'react-icons/fa';
import React from 'react';

interface StarRatingProps {
  rating: number;
  hoverRating: number;
  onRate: (value: number) => void;
  onHover: (value: number) => void;
  onLeave: () => void;
  labels: string[];
}

const StarRating = React.memo(function StarRating({
  rating,
  hoverRating,
  onRate,
  onHover,
  onLeave,
  labels
}: StarRatingProps) {
  return (
    <div className="flex space-x-1" role="radiogroup" aria-label="Star rating">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isActive = hoverRating >= starValue || (!hoverRating && rating >= starValue);
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onRate(starValue)}
            onMouseEnter={() => onHover(starValue)}
            onMouseLeave={onLeave}
            aria-checked={rating === starValue}
            role="radio"
            tabIndex={rating === starValue ? 0 : -1}
            className={`transition-colors duration-200 focus:outline-none ${
              isActive ? 'text-[#FFD60A]' : 'text-gray-300'
            }`}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''} - ${labels[starValue - 1]}`}
          >
            <FaStar 
              size={20} 
              style={{ opacity: isActive ? 1 : 0.7 }}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
});

StarRating.displayName = 'StarRating';

export default StarRating;