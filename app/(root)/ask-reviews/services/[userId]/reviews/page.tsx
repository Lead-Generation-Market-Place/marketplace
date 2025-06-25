'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaStar } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SubmitReviews } from '@/actions/reviews';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const tags = [
  'Professionalism',
  'Technical Expertise',
  'Attention to Detail',
  'Problem Solving',
  'Reliability',
  'Transparency',
  'Accountability',
  'Quality Assurance',
  'Industry Knowledge',
  'Results Driven',
];
const maxTags = 3;
const maxPhotos = 3;
const ratingLabels = ['Tribble', 'Poor', 'Average', 'Very Good', 'Excellent'];

const ReviewForm = () => {
  const [isPending, setIsPending] = useState(false);
  const params = useParams();
  const userId = params.userId as string;

  // Rating state (1 to 5)
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [password, setPassword] = useState('');

  // Tags state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Comment state
  const [comment, setComment] = useState('');

  // Photos state: store File objects, preview URLs, and labels
  const [photos, setPhotos] = useState<{ file: File; url: string; label: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add provider to the errors state type
  const [errors, setErrors] = useState<{ rating?: string; selectedTags?: string; comment?: string; photos?: string; provider?: string }>({});

  // Dialog open state (controlled manually)
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fields inside dialog
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Validation errors for dialog inputs
  const [dialogErrors, setDialogErrors] = useState<{ firstName?: string; lastName?: string; email?: string; password?: string }>({});
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      setErrors(errors => ({ ...errors, selectedTags: undefined }));
    } else if (selectedTags.length < maxTags) {
      setSelectedTags([...selectedTags, tag]);
      setErrors(errors => ({ ...errors, selectedTags: undefined }));
    } else {
      setErrors(errors => ({ ...errors, selectedTags: 'You can select up to 3 tags.' }));
    }
  };

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // Your existing handleSubmit function, modified to receive extra info
  const handleSubmit = async () => {
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);
      selectedTags.forEach((tag, i) => formData.append(`tag_${i}`, tag));
      photos.forEach((photo, i) => formData.append(`photo_${i}`, photo.file));
      photos.forEach((photo, i) => formData.append(`photo_label_${i}`, photo.label));

      // Append dialog inputs
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);

      const result = await SubmitReviews(formData, userId);

      if (result.status === 'success') {
        toast.success("Review submitted successfully!");
        // Reset everything
        setRating(0);
        setSelectedTags([]);
        setComment('');
        setPhotos([]);
        setFirstName('');
        setLastName('');
        setEmail('');
        setDialogErrors({});
        setDialogOpen(false);
      } else {
        toast.error("Submission failed.");
      }

    } catch (error) {
      let message = "Please try again later.";
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: string }).message === "string"
      ) {
        message = (error as { message: string }).message;
      }
      toast.error("An unexpected error occurred", {
        description: message,
      });
    } finally {
      setIsPending(false);
    }
  };

  // Form submit handler opens dialog
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    setDialogOpen(true);
  };

  // Confirm dialog submit
  const onDialogConfirm = () => {
    // Validate inputs
    const errors: typeof dialogErrors = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!password.trim()) errors.password = "Password is required";
    else if (!validateEmail(email)) errors.email = "Invalid email format";

    setDialogErrors(errors);

    if (Object.keys(errors).length === 0) {
      // No errors, submit form
      handleSubmit();
    }
  };

  // Handle photo uploads
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const availableSlots = maxPhotos - photos.length;
    if (filesArray.length > availableSlots) {
      setErrors(errors => ({ ...errors, photos: 'You can upload up to 3 photos.' }));
    } else {
      setErrors(errors => ({ ...errors, photos: undefined }));
    }
    const filesToAdd = filesArray.slice(0, availableSlots);
    const newPhotos = filesToAdd.map(file => ({
      file,
      url: URL.createObjectURL(file),
      label: '', // Add label property
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    e.target.value = ''; // Reset input so same file can be uploaded again if removed
  };

  // Remove photo by index
  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Clear URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  // Word count function
  const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  // Update label for a photo
  const handleLabelChange = (idx: number, label: string) => {
    setPhotos(prev => prev.map((photo, i) => i === idx ? { ...photo, label } : photo));
  };

  return (
    <>
      <form
        onSubmit={onFormSubmit}
        className="max-w-4xl mx-auto p-8 md:p-10 bg-white dark:bg-gray-900 rounded-[7px]  dark:border-gray-700 space-y-8 text-[13px] font-sans"
        aria-label={`Review form for ${userId}`}
      >
        {/* Header with rating */}
        <div className="space-y-2">
          <h2 className="text-[16px] font-bold text-[#023E8A] dark:text-white mb-1 leading-tight">
            How would you rate your overall experience with{' '}
            <span className="font-bold text-gray-900 dark:text-gray-100">{userId}</span>?
          </h2>
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1" role="radiogroup" aria-label="Star rating">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                const isActive = hoverRating >= starValue || (!hoverRating && rating >= starValue);
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-checked={rating === starValue}
                    role="radio"
                    tabIndex={0}
                    className={`transition-colors duration-200 focus:outline-none ${isActive ? 'text-[#FFD60A]' : 'text-gray-300'
                      }`}
                    aria-label={`${starValue} star${starValue > 1 ? 's' : ''} - ${ratingLabels[starValue - 1]
                      }`}
                  >
                    <FaStar size={20} style={{ opacity: 0.7 }} />
                  </button>
                );
              })}
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[100px] text-xs">
              {hoverRating
                ? ratingLabels[hoverRating - 1]
                : rating
                  ? ratingLabels[rating - 1]
                  : 'Select a rating'}
            </span>
          </div>
        </div>

        {/* Tag Selection */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
            What did you like about working with <span className="font-bold text-[#023E8A] dark:text-white">{userId}</span>?
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose up to three items. <span className="font-medium">{selectedTags.length}/{maxTags}</span>
          </p>
          <p className="text-xs text-gray-400 mb-1">Select the qualities that best describe your experience.</p>
          {errors.selectedTags && <p className="text-xs text-red-500">{errors.selectedTags}</p>}
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-[4px] border text-[13px] font-normal transition focus:outline-none focus:ring-1 focus:ring-[#0096C7] ${selectedTags.includes(tag)
                  ? 'bg-[#0096C7] text-white border-[#0096C7]'
                  : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                aria-pressed={selectedTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div>
          <label htmlFor="comment" className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-[14px]">
            Write your comments here...
          </label>
          <p className="text-xs text-gray-400 mb-1">Share more details about your experience (max 250 characters).</p>
          <textarea
            id="comment"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0096C7] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-[13px]"
            rows={4}
            placeholder="Your feedback..."
            value={comment}
            onChange={e => {
              setComment(e.target.value);
              if (countWords(e.target.value) > 250) {
                setErrors(errors => ({ ...errors, comment: 'Comment must be less than 250 words.' }));
              } else {
                setErrors(errors => ({ ...errors, comment: undefined }));
              }
            }}
          />
          {errors.comment && <p className="text-xs text-red-500">{errors.comment}</p>}
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label
            htmlFor="photo-upload"
            className="inline-block cursor-pointer px-4 py-2 border border-dashed border-gray-400 dark:border-gray-600 rounded-[4px] text-[#0096C7] dark:text-[#ffffff] hover:bg-blue-50 dark:hover:bg-gray-800 transition font-medium"
          >
            + Add Photos (up to {maxPhotos} - Optional)
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              ref={inputRef}
            />
          </label>
          <p className="text-xs text-gray-400 mt-1">You can upload up to 3 images to support your review.</p>
          {errors.photos && <p className="text-xs text-red-500">{errors.photos}</p>}
          {/* Photo Previews with animation and upload progress */}
          <AnimatePresence>
            {photos.length > 0 && (
              <motion.div
                className="flex gap-4 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
              >
                {photos.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    className="relative w-24 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 flex flex-col justify-end"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <img
                      src={photo.url}
                      alt={`Uploaded preview ${idx + 1}`}
                      className="object-cover w-full h-24 absolute top-0 left-0"
                    />
                    {/* Simulated upload progress bar */}
                    <motion.div
                      className="absolute bottom-8 left-0 h-2 bg-[#0096C7]"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.2, ease: 'easeInOut' }}
                    />
                    {/* Label input */}
                    <input
                      type="text"
                      value={photo.label}
                      onChange={e => handleLabelChange(idx, e.target.value)}
                      placeholder="Image label"
                      className="absolute bottom-0 left-0 w-full px-2 py-1 text-xs bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 focus:outline-none"
                      maxLength={50}
                      aria-label={`Label for photo ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-[4px] p-1 text-white hover:bg-opacity-75 transition"
                      aria-label={`Remove photo ${idx + 1}`}
                    >
                      &times;
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-3 bg-[#0077B6] hover:bg-[#005f8e] text-[#c3e8fb] rounded-[4px] text-[14px] font-normal focus:ring-4 focus:ring-blue-300 transition disabled:bg-[#529bbf] disabled:text-white"
            disabled={rating === 0}
            aria-disabled={rating === 0}
            title={rating === 0 ? 'Please select a rating before submitting' : 'Submit review'}
          >
            {isPending && <Loader2 className="animate-spin mr-2" />} <span>Submit</span>
          </Button>
        </div>
        {errors.provider && <div className="text-red-500 mb-2">{errors.provider}</div>}
      </form>

      {/* Custom Dialog for collecting first name, last name, email */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Information</DialogTitle>
            <DialogDescription>Please enter your details before submitting your review.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={e => {
              e.preventDefault();
              onDialogConfirm();
            }}
            className="space-y-4 mt-4"
          >
            <div>
              <label htmlFor="firstName" className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0096C7] ${dialogErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={!!dialogErrors.firstName}
                aria-describedby={dialogErrors.firstName ? "firstName-error" : undefined}
              />
              {dialogErrors.firstName && (
                <p id="firstName-error" className="text-xs text-red-500 mt-1">{dialogErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0096C7] ${dialogErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={!!dialogErrors.lastName}
                aria-describedby={dialogErrors.lastName ? "lastName-error" : undefined}
              />
              {dialogErrors.lastName && (
                <p id="lastName-error" className="text-xs text-red-500 mt-1">{dialogErrors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0096C7] ${dialogErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={!!dialogErrors.email}
                aria-describedby={dialogErrors.email ? "email-error" : undefined}
              />
              {dialogErrors.email && (
                <p id="email-error" className="text-xs text-red-500 mt-1">{dialogErrors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium text-sm text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0096C7] ${dialogErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                aria-invalid={!!dialogErrors.password}
                aria-describedby={dialogErrors.password ? "password-error" : undefined}
              />
              {dialogErrors.password && (
                <p id="password-error" className="text-xs text-red-500 mt-1">{dialogErrors.password}</p>
              )}
            </div>


            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Confirm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewForm;
