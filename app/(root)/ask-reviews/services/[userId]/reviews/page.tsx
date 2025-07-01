'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { fetchProfessional, SubmitReviews } from '@/actions/reviews/reviews';
import debounce from 'lodash.debounce';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Lazy load components
const StarRating = dynamic(() => import('@/components/customers/reviews/StarRating/page'));
const TagsSelector = dynamic(() => import('@/components/customers/reviews/TagsSelector/page'));
const PhotoUploader = dynamic(() => import('@/components/customers/reviews/PhotoUploader/page'));
const ReviewDialog = dynamic(() => import('@/components/customers/reviews/reviewdialog/page'));
const Dialog = dynamic(() => import('@/components/ui/dialog').then(mod => mod.Dialog), { ssr: false });
const DialogContent = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogContent), { ssr: false });
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogHeader), { ssr: false });
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogTitle), { ssr: false });
const DialogDescription = dynamic(() => import('@/components/ui/dialog').then(mod => mod.DialogDescription), { ssr: false });

// Constants
const TAGS = [
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
const MAX_TAGS = 3;
const MAX_PHOTOS = 3;
const RATING_LABELS = ['Terrible', 'Poor', 'Average', 'Very Good', 'Excellent'];
const WORD_LIMIT = 250;

const ReviewForm = () => {
  const params = useParams();
  const userId = params.userId as string;
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [password, setPassword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<{ file: File; url: string; label: string }[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [dialogErrors, setDialogErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [isPending, setIsPending] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Memoized values
  const showTagsSection = useMemo(() => rating > 2, [rating]);

  // Fetch business name
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const result = await fetchProfessional(userId);
        if (result?.business_name) {
          setBusinessName(result.business_name);
        }
      } catch (error) {
        toast.error(`Failed to fetch business name:${error}`);
      }
    };
    fetchBusiness();
  }, [userId]);

  // Clean up photo URLs
  useEffect(() => {
    return () => {
      photos.forEach(photo => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  // Event handlers
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : prev.length < MAX_TAGS 
          ? [...prev, tag] 
          : prev
    );
  }, []);

  const validateComment = useMemo(() => debounce((text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words > WORD_LIMIT) {
      toast.error(`Comment must be less than ${WORD_LIMIT} words.`);
    }
  }, 500), []);

  const handleAddPhotos = useCallback((files: File[]) => {
    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      label: '',
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const handleLabelChange = useCallback((idx: number, label: string) => {
    setPhotos(prev => prev.map((photo, i) => i === idx ? { ...photo, label } : photo));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsPending(true);
    toast.loading('Uploading your review and photos...');

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);
      formData.append("selectedTags", JSON.stringify(selectedTags));

      photos.forEach((photo, i) => formData.append(`photo_${i}`, photo.file));
      photos.forEach((photo, i) => formData.append(`photo_label_${i}`, photo.label));

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      if (emailExists) {
        formData.append("password", password);
      }

      const result = await SubmitReviews(formData);
      toast.dismiss();


      if (result.status === 'success') {
        toast.success(result.message || "Review submitted successfully!");
        // Reset form
        setRating(0);
        setSelectedTags([]);
        setComment('');
        setPhotos([]);
        setFirstName('');
        setLastName('');
        setEmail('');
        setDialogErrors({});
        setDialogOpen(false);
        setDialogStep(1);
        setEmailExists(null);
      } else {
        if (result.errors) {
          Object.entries(result.errors.fieldErrors).forEach(([field, errors]) => {
            errors.forEach(error => toast.error(`${field}: ${error}`));
          });
          result.errors.formErrors.forEach(error => toast.error(error));
        } else if (result.code) {
          switch (result.code) {
            case 'PASSWORD_REQUIRED':
              toast.error('Password is required for existing accounts');
              break;
            case 'INVALID_PASSWORD':
              break;
            case 'SIGNUP_FAILED':
              toast.error('Failed to create account');
              break;
            case 'PHOTO_UPLOAD_FAILED':
              toast.error(`Failed to upload photo: ${result.file || ''}`);
              break;
            default:
              toast.error(result.message || 'Submission failed');
          }
        } else {
          toast.error(result.message || 'Submission failed');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  }, [userId, rating, comment, selectedTags, photos, firstName, lastName, email, emailExists, password]);

  const checkEmailExists = useCallback(async () => {
    const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
    
    if (!validateEmail(email)) {
      setDialogErrors(prev => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    setIsCheckingEmail(true);
    try {
      const res = await fetch('/api/check-email-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const { exists } = await res.json();
      setEmailExists(exists);
      if (exists) {
        setDialogStep(2);
        setPasswordError(null);
      } else {
        await handleSubmit();
      }
    } catch {
      toast.error("Failed to verify email");
    } finally {
      setIsCheckingEmail(false);
    }
  }, [email, handleSubmit]);

  const verifyPassword = useCallback(async () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { valid } = await res.json();
      if (valid) {
        await handleSubmit();
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Failed to verify password");
    } finally {
      setIsPending(false);
    }
  }, [email, password, handleSubmit]);

  const onDialogConfirm = useCallback(async () => {
    const errors: typeof dialogErrors = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format";

    setDialogErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (dialogStep === 1) {
        await checkEmailExists();
      } else {
        await verifyPassword();
      }
    }
  }, [dialogStep, firstName, lastName, email, checkEmailExists, verifyPassword]);

  const onFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    setDialogOpen(true);
  }, [rating]);

  return (
    <>
      <form
        onSubmit={onFormSubmit}
        className="max-w-4xl mx-auto p-8 md:p-10 bg-white dark:bg-gray-900 rounded-[7px] dark:border-gray-700 space-y-8 text-[13px] font-sans"
        aria-label={`Review form for ${businessName}`}
      >
        {/* Header with rating */}
        <div className="space-y-2">
          <h2 className="text-[16px] font-bold text-[#023E8A] dark:text-white mb-1 leading-tight">
            How would you rate your overall experience with{' '}
            <span className="font-bold text-gray-900 dark:text-gray-100">{businessName}</span>?
          </h2>
          <div className="flex items-center space-x-3">
            <StarRating
              rating={rating}
              hoverRating={hoverRating}
              onRate={setRating}
              onHover={setHoverRating}
              onLeave={() => setHoverRating(0)}
              labels={RATING_LABELS}
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium min-w-[100px] text-xs">
              {hoverRating
                ? RATING_LABELS[hoverRating - 1]
                : rating
                  ? RATING_LABELS[rating - 1]
                  : 'Select a rating'}
            </span>
          </div>
        </div>

        {/* Conditional Tags Section */}
        {showTagsSection && (
          <TagsSelector
            tags={TAGS}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            businessName={businessName}
            maxTags={MAX_TAGS}
          />
        )}

        {/* Comment Box */}
        <div>
          <label htmlFor="comment" className="block mb-2 font-medium text-gray-700 dark:text-gray-300 text-[14px]">
            Write your comments here...
          </label>
          <p className="text-xs text-gray-400 mb-1">Share more details about your experience (max {WORD_LIMIT} words).</p>
          <textarea
            id="comment"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#0096C7] bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-[13px]"
            rows={4}
            placeholder="Your feedback..."
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              validateComment(e.target.value);
            }}
            required
          />
        </div>

        {/* Photo Upload */}
        <PhotoUploader
          photos={photos}
          maxPhotos={MAX_PHOTOS}
          onAddPhotos={handleAddPhotos}
          onRemovePhoto={removePhoto}
          onLabelChange={handleLabelChange}
          inputRef={inputRef}
          
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-3 bg-[#0077B6] hover:bg-[#005f8e] text-[#c3e8fb] rounded-[4px] text-[14px] font-normal focus:ring-4 focus:ring-blue-300 transition disabled:bg-[#529bbf] disabled:text-white"
            disabled={rating === 0 || isPending}
            aria-disabled={rating === 0 || isPending}
            title={rating === 0 ? 'Please select a rating before submitting' : 'Submit review'}
          >
            {isPending && <Loader2 className="animate-spin mr-2" />} Submit Review
          </Button>
        </div>
      </form>

      {/* Two-Step Dialog */}
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setDialogStep(1);
            setEmailExists(null);
            setPasswordError(null);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {dialogStep === 1 ? 'Confirm Your Information' : 'Verify Your Identity'}
              </DialogTitle>
              <DialogDescription>
                {dialogStep === 1 
                  ? 'Please enter your details before submitting your review.'
                  : 'Please enter your password to verify your identity.'}
              </DialogDescription>
            </DialogHeader>

            <ReviewDialog
              step={dialogStep}
              firstName={firstName}
              lastName={lastName}
              email={email}
              password={password}
              errors={dialogErrors}
              passwordError={passwordError}
              isPending={isPending}
              isCheckingEmail={isCheckingEmail}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirm={onDialogConfirm}
              onCancel={() => setDialogOpen(false)}
              onStepBack={() => {
                setDialogStep(1);
                setPasswordError(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ReviewForm;