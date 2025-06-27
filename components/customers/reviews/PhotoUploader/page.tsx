'use client';

import React, { ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Photo {
  file: File;
  url: string;
  label: string;
}

interface PhotoUploaderProps {
  photos: Photo[];
  maxPhotos: number;
  onAddPhotos: (files: File[]) => void;
  onRemovePhoto: (index: number) => void;
  onLabelChange: (index: number, label: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const MAX_FILE_SIZE_MB = 10; // 10 MB limit
const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const PhotoPreview = React.memo(function PhotoPreview({
  photo,
  index,
  onRemove,
  onLabelChange
}: {
  photo: Photo;
  index: number;
  onRemove: (index: number) => void;
  onLabelChange: (index: number, label: string) => void;
}) {
  return (
    <motion.div
      className="relative group w-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <Image
          src={photo.url}
          alt={`Preview ${index}`}
          width={96}
          height={96}
          className="object-cover w-full h-full"
        />
      </div>
      <input
        type="text"
        value={photo.label}
        onChange={(e) => onLabelChange(index, e.target.value)}
        placeholder="Add label"
        className="w-full mt-1 text-xs p-1 border border-gray-200 dark:border-gray-700 rounded dark:bg-gray-800 dark:text-white"
        maxLength={20}
        aria-label={`Label for photo ${index + 1}`}
      />
      <button
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
        aria-label="Remove photo"
      >
        ×
      </button>
    </motion.div>
  );
});
PhotoPreview.displayName = 'PhotoPreview';

const PhotoUploader = React.memo(function PhotoUploader({
  photos,
  maxPhotos,
  onAddPhotos,
  onRemovePhoto,
  onLabelChange,
  inputRef
}: PhotoUploaderProps) {

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const availableSlots = maxPhotos - photos.length;

    const validFiles = filesArray.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!allowedExtensions.includes(extension)) {
        toast.error("Unsupported file format. Please upload JPG, JPEG, PNG, GIF, or WEBP images only.");
        return false;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_SIZE_MB) {
        toast.error(`"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > availableSlots) {
      toast.error(`Only ${availableSlots} photo(s) can be added.`);
      return;
    }

    onAddPhotos(validFiles);

    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="photo-upload"
        className={`inline-block cursor-pointer px-4 py-2 border border-dashed rounded text-[#0096C7] dark:text-white font-medium transition 
        ${photos.length >= maxPhotos
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-50 dark:hover:bg-gray-800'
        }`}
      >
        + Add Photos (max {maxPhotos}) – Optional
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={handlePhotoChange}
          ref={inputRef}
          disabled={photos.length >= maxPhotos}
        />
      </label>

      <p className="text-xs text-gray-400">
        {photos.length >= maxPhotos
          ? 'Maximum photo limit reached.'
          : `You can upload ${maxPhotos - photos.length} more photo(s). Max ${MAX_FILE_SIZE_MB}MB each.`}
      </p>

      <AnimatePresence>
        <motion.div
          className="flex gap-4 mt-2 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
        >
          {photos.map((photo, idx) => (
            <PhotoPreview
              key={`${photo.url}-${idx}`}
              photo={photo}
              index={idx}
              onRemove={onRemovePhoto}
              onLabelChange={onLabelChange}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

PhotoUploader.displayName = 'PhotoUploader';

export default PhotoUploader;
