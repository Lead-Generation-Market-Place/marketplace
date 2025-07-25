"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SkeletonCardView from "./SkeletonCardView";
import SkeletonListView from "./SkeletonListView";

// Lazy load
const ListView = dynamic(() => import("./ListView"), {
  loading: () => <SkeletonListView />,
});
const CardView = dynamic(() => import("./CardView"), {
  loading: () => <SkeletonCardView />,
});

interface SubCategory {
  id: string;
  name: string;
  icon: string;
}

interface CategoryContentProps {
  subcategories: SubCategory[];
}

export default function CategoryContent({ subcategories }: CategoryContentProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 p-4">
          <ListView
            subcategories={subcategories}
            onSelect={(subcategories) => setSelectedSubcategory(subcategories)}
            selectedId={selectedSubcategory?.id || null}
          />
        </div>
        <div className="md:col-span-3 p-4">
          <CardView
            subcategories={subcategories}
            selectedSubcategory={selectedSubcategory}
          />
        </div>
      </div>
    </div>
  );
}
