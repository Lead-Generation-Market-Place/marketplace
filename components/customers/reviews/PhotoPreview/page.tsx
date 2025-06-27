'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PhotoPreviewProps {
  photo: { url: string; label: string };
  index: number;
  onRemove: (index: number) => void;
  onLabelChange: (index: number, label: string) => void;
}

const PhotoPreview = React.memo(function PhotoPreview({ 
  photo, 
  index, 
  onRemove, 
  onLabelChange 
}: PhotoPreviewProps) {
  return (
    <motion.div
      className="relative w-24 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex flex-col justify-end"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      layout
    >
      <div className="relative w-full h-24">
        <Image
          src={photo.url}
          alt={`Uploaded preview ${index + 1}`}
          className="object-cover"
          fill
          sizes="96px"
          loading="lazy"
        />
      </div>
      
      <motion.div
        className="absolute bottom-8 left-0 h-2 bg-[#0096C7]"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      
      <input
        type="text"
        value={photo.label}
        onChange={(e) => onLabelChange(index, e.target.value)}
        placeholder="Image label"
        className="absolute bottom-0 left-0 w-full px-2 py-1 text-xs bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0096C7]"
        maxLength={50}
        aria-label={`Label for photo ${index + 1}`}
      />
      
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-black/50 rounded-[4px] p-1 text-white hover:bg-black/75 transition-all"
        aria-label={`Remove photo ${index + 1}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </motion.div>
  );
});

PhotoPreview.displayName = 'PhotoPreview';

export default PhotoPreview;