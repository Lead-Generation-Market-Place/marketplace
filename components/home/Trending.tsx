"use client";
import { useState } from "react";
import Image from "next/image";
import { LocateFixed } from "lucide-react";

const categories = [
  {
    name: "Home Improvement",
    subcategories: [
      "Painting",
      "Plumbing",
      "Electrical",
    ]
  },
  {
    name: "Home Re-Modeling",
    subcategories: [
      "Kitchen Remodeling",
      "Bathroom Remodeling",
      "Basement Finishing"
    ]
  },
  {
    name: "Weddings",
    subcategories: [
      "Photography",
      "Catering",
      "Decorations"
    ]
  },
  {
    name: "Events",
    subcategories: [
      "Corporate Events",
      "Birthday Parties",
      "Concerts"
    ]
  },
  {
    name: "More...",
    subcategories: [
      "Pet Services",
      "Automotive",
      "Tutoring"
    ]
  }
];

const Trending = () => {
  // Set "Home Improvement" as the default selected category
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].name);

  // Find the selected category object for displaying subcategories
  const categoryObj = categories.find(cat => cat.name === selectedCategory);

  return (
    <div className="w-full py-10 pb-15 max-w-6xl mx-auto px-2">
      <h2 className="text-xl font-semibold py-2 ">
        Explore more projects
      </h2>
      
      <div className="flex flex-row gap-4 flex-wrap font-semibold text-sm">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`hover:text-sky-500 focus:outline-none pb-2  ${selectedCategory === cat.name ? "text-sky-500 border-b-2 border-sky-500" : ""}`}
            onClick={() => setSelectedCategory(cat.name)}
            type="button"
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {categoryObj && (
          <div>
            <h4 className="font-semibold mb-2">{categoryObj.name} Services</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categoryObj.subcategories.map((sub) => (
                <div
                  key={sub}
                  className="rounded-t overflow-hidden flex flex-col justify-start bg-white"
                >
                  <Image
                    src="/images/image4.jpg"
                    width={80}
                    height={80}
                    alt="Subcategory Image"
                    className="w-full h-30 object-cover mb-2 rounded"
                  />
                  <div className="text-start p-2">
                    <p className="font-semibold text-gray-700">{sub}</p>
                    <LocateFixed className="text-sky-500 inline-block mr-1 text-xs"/>
                    <span className="text-sm">see pros near you</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;