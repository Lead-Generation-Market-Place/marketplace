"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import stringSimilarity from 'string-similarity';
import Link from 'next/link';
import SearchButton from '@/components/elements/SearchButton';
import useCategories from '@/hooks/useCategory';
import TextPlaceholder from '@/components/elements/TextPlaceholder';

type Category = {
  id: number;
  name: string;
};

export default function ServicePage() {
  const { categories, error } = useCategories();
  const [bestMatch, setBestMatch] = useState<Category | null>(null);
  const [otherMatches, setOtherMatches] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const zipcode = searchParams.get('zipcode') || '';
  

  useEffect(() => {
    // Start loading when categories or search change
    setLoading(true);

    if (categories.length > 0 && search.trim()) {
      const names = categories.map((c) => c.name.toLowerCase());
      const { bestMatch: best, ratings } = stringSimilarity.findBestMatch(
        search.toLowerCase(),
        names
      );
      console.log("Ratiing: ", ratings);
      const bestMatchCat = categories.find(
        (cat) => cat.name.toLowerCase() === best.target
      );

      const isValidBestMatch = best.rating > 0.3 && bestMatchCat;

      setBestMatch(isValidBestMatch ? bestMatchCat! : null);

      const others = categories
        .filter((cat) => {
          const similarity = stringSimilarity.compareTwoStrings(
            cat.name.toLowerCase(),
            search.toLowerCase()
          );
          return (
            similarity > 0.3 &&
            similarity <= 0.7 &&
            (!isValidBestMatch || cat.id !== bestMatchCat!.id)
          );
        })
        .filter(
          (cat, index, self) =>
            index === self.findIndex((c) => c.name.toLowerCase() === cat.name.toLowerCase())
        );

      setOtherMatches(others);

      if (isValidBestMatch) {
        setSelectedIds(new Set([bestMatchCat!.id]));
      } else {
        setSelectedIds(new Set());
      }
    } else {
      setBestMatch(null);
      setOtherMatches([]);
      setSelectedIds(new Set());
      console.log("No search term provided", error);
    }

    // Stop loading after processing
    setLoading(false);
    console.log("zip code: ", zipcode);
  }, [categories, search]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  // Spinner while loading
  if (loading) {
    return (
        <TextPlaceholder/>
    );
  }

  return (
    <div className="p-6 lg:mx-50 xl:mx-50 md:mx-30 sm:mx-10 my-3">
      <form action="#" className="flex flex-col gap-4">
        <h1 className="text-xl font-bold mb-4 text-center">
          Here&apos;s what we found that best matches your search.
        </h1>

        {bestMatch ? (
          <div>
            <ul>
              <li className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-300 rounded shadow-sm">
                <input
                  type="checkbox"
                  checked={selectedIds.has(bestMatch.id)}
                  onChange={() => toggleSelect(bestMatch.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                  id={`cat-${bestMatch.id}`}
                />
                <label htmlFor={`cat-${bestMatch.id}`} className="font-light text-gray-800 cursor-pointer">
                  {bestMatch.name}
                </label>
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 italic"></p>
        )}

        {otherMatches.length > 0 && (
          <div>
            <h2 className="text-md font-bold text-gray-700">Other Possible Matches</h2>
            <ul className="space-y-3">
              {otherMatches.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow transition-shadow"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(cat.id)}
                    onChange={() => toggleSelect(cat.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    id={`cat-${cat.id}`}
                  />
                  <label htmlFor={`cat-${cat.id}`} className="font-light text-gray-800 cursor-pointer">
                    {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!bestMatch && otherMatches.length === 0 && (
          <p className="text-gray-500 italic"></p>
        )}

        <p className="font-extralight text-sm my-2">
          Not what you are looking for?{' '}
          <Link className="text-[#0077B6]" href="/">
            Edit your search
          </Link>
        </p>
        <SearchButton type="Next" loading={false} />
      </form>
    </div>
  );
}