
"use client";

import dynamic from "next/dynamic";

const CategoryContent = dynamic(() => import("./CategoryContent"), {
  loading: () => <div className="p-4">Loading content...</div>,
  ssr: false, // ✅ now allowed because this wrapper is a client component
});

interface SubCategory {
  id: string;
  name: string;
  icon:string;
}

export default function CategoryContentWrapper({ subcategories }: { subcategories: SubCategory[] }) {
  return <CategoryContent subcategories={subcategories} />;
}
