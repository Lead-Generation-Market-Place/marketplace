'use client';

import React from 'react';

interface TagsSelectorProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  businessName: string | null;
  maxTags: number;
  className?: string;
  selectedClassName?: string;
  unselectedClassName?: string;
}

const TagsSelector = React.memo(function TagsSelector({ 
  tags, 
  selectedTags, 
  onToggleTag, 
  businessName,
  maxTags,
  className = "px-4 py-2 rounded-[4px] border text-[13px] font-normal transition focus:outline-none focus:ring-1 focus:ring-[#0096C7]",
  selectedClassName = "bg-[#0096C7] text-white border-[#0096C7]",
  unselectedClassName = "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
}: TagsSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[16px] font-semibold text-gray-900 dark:text-gray-100">
        What did you like about working with <span className="font-bold text-[#023E8A] dark:text-white">{businessName}</span>?
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            className={`${className} ${
              selectedTags.includes(tag) ? selectedClassName : unselectedClassName
            }`}
            aria-pressed={selectedTags.includes(tag)}
            disabled={!selectedTags.includes(tag) && selectedTags.length >= maxTags}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
});

export default TagsSelector;