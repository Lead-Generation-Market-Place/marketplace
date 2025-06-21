'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const tags = ['Work Quality', 'Responsiveness', 'Value', 'Professionalism', 'Punctuality'];

const ReviewForm = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const maxTags = 3;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < maxTags) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
      {/* Company Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">How would you rate your overall experience with <span className="font-bold">CLARKS CONSTRUCTION COMPANY</span>?</h2>
        <p className="text-gray-600">Good</p>
        <div className="flex space-x-1">
          {[...Array(4)].map((_, i) => (
            <FaStar key={i} className="text-green-500 w-6 h-6" />
          ))}
          <FaStar className="text-gray-300 w-6 h-6" />
        </div>
      </div>

      {/* Tag Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">What did you like about working with CLARKS CONSTRUCTION COMPANY?</h3>
        <p className="text-sm text-gray-500">Choose up to three items. <span className="font-medium">{selectedTags.length}/3</span></p>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full border transition ${
                selectedTags.includes(tag) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Box */}
      <div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Write your comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Optional Photo Upload */}
      <div className="border border-dashed border-gray-400 p-4 rounded-lg text-center text-blue-500 cursor-pointer hover:bg-blue-50">
        <label className="cursor-pointer">
          <input type="file" className="hidden" />
          + Add Photos (optional)
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600">Submit</Button>
      </div>
    </div>
  );
};

export default ReviewForm;
