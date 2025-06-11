'use client';

import { useEffect, useState } from 'react';
import stringSimilarity from 'string-similarity';
import ServiceQuestion from '@/components/question/ServiceQuestion';
import Link from 'next/link';
import SearchButton from '@/components/elements/SearchButton';
import ResetButton from '@/components/elements/ResetButton';
import TextPlaceholder from '@/components/elements/TextPlaceholder';
import { ArrowLeft, X } from 'lucide-react';

type Category = {
  id: number;
  name: string;
};

interface SearchResultProps {
  categories: Category[];
  search: string;
  zipcode: string;
  exactMatch: Category[] | null;
  location: string;
  fetchError: string | null;
}

export default function SearchResult({
  categories,
  search,
  zipcode,
  exactMatch,
  location,
  fetchError,
}: SearchResultProps) {
  const [bestMatch, setBestMatch] = useState<Category | null>(null);
  const [otherMatches, setOtherMatches] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (categories.length > 0 && search.trim()) {
      const lowerSearch = search.toLowerCase();
      const names = categories.map((c) => c.name.toLowerCase());

      const { bestMatch: best, ratings } = stringSimilarity.findBestMatch(lowerSearch, names);
      const bestMatchCat = categories.find(
        (cat) => cat.name.toLowerCase() === best.target
      );
      console.log(ratings);
      const isValidBestMatch = best.rating > 0.1 && !!bestMatchCat;

      setBestMatch(isValidBestMatch ? bestMatchCat! : null);

      const others = categories
        .filter((cat) => {
          const similarity = stringSimilarity.compareTwoStrings(
            cat.name.toLowerCase(),
            lowerSearch
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
      setSelectedCategory(isValidBestMatch ? bestMatchCat! : null);
    } else {
      setBestMatch(null);
      setOtherMatches([]);
      setSelectedCategory(null);
    }

    setLoading(false);
  }, [categories, search]);

  const toggleSelect = (id: number) => {
    const category = [...(otherMatches ?? []), bestMatch]
      .find((cat) => cat && cat.id === id) || null;
    setSelectedCategory(category);
  };

  const submitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('Please select a category before continuing.');
      return;
    }
    setSubmitted(true);
  };

  // Handle early returns after all hooks
  if (exactMatch && exactMatch.length > 0) {
    return (
      <>
        <div className="px-3 py-2 flex flex-row justify-between items-center text-gray-500 dark:text-gray-300">
          <p
            className="cursor-pointer hover:text-[#0096C7]"
            onClick={() => window.history.back()}>
            <ArrowLeft />
          </p>
          <p
            className="cursor-pointer hover:text-red-600"
            onClick={() => (window.location.href = '/')}>
            <X />
          </p>
        </div>
        <ServiceQuestion exactMatch={exactMatch} />
      </>
    );
  }

  if (submitted && selectedCategory) {
    return (
      <>
        <div className="px-3 py-2 flex flex-row justify-between items-center text-gray-500 dark:text-gray-300">
          <p
            className="cursor-pointer hover:text-[#0096C7]"
            onClick={() => window.history.back()}>
            <ArrowLeft />
          </p>
          <p
            className="cursor-pointer hover:text-red-600"
            onClick={() => (window.location.href = '/')}>
            <X />
          </p>
        </div>
        <ServiceQuestion exactMatch={[selectedCategory]} />
      </>
    );
  }

  if (loading) return <TextPlaceholder />;
  if (fetchError) return <p className="text-red-500 text-center">Error: {fetchError}</p>;

  return (
    <>
      <div className="px-3 py-2 flex flex-row justify-between items-center text-gray-500 dark:text-gray-300">
        <p
          className="cursor-pointer hover:text-[#0096C7]"
          onClick={() => window.history.back()}>
          <ArrowLeft />
        </p>
        <p
          className="cursor-pointer hover:text-red-600"
          onClick={() => (window.location.href = '/')}>
          <X />
        </p>
      </div>
      <form className="flex flex-col gap-4" onSubmit={submitAnswer}>
        <h1 className="text-xl font-bold mb-4 text-center dark:text-gray-100">
          Here&apos;s what we found that best matches your search.
        </h1>
        <p className="text-gray-400 dark:text-gray-400 text-sm">
          Zip Code: {zipcode} | {location}
        </p>

        {bestMatch && (
          <ul>
            <li className="flex items-center gap-3 p-4 bg-[#0096C7]/10 dark:bg-[#0096C7]/20 border border-[#0096C7] rounded shadow-sm">
              <input
                type="radio"
                name="answer"
                checked={selectedCategory?.id === bestMatch.id}
                onChange={() => toggleSelect(bestMatch.id)}
                className="form-checkbox h-5 w-5 text-blue-600"
                id={`cat-${bestMatch.id}`}
              />
              <label
                htmlFor={`cat-${bestMatch.id}`}
                className="text-gray-800 dark:text-gray-100 cursor-pointer"
              >
                {bestMatch.name}
              </label>
            </li>
          </ul>
        )}

        {otherMatches.length > 0 && (
          <>
            <h2 className="text-md font-bold text-gray-700 dark:text-gray-200">Other Possible Matches</h2>
            <ul className="space-y-3">
              {otherMatches.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm hover:shadow transition-shadow"
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedCategory?.id === cat.id}
                    onChange={() => toggleSelect(cat.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                    id={`cat-${cat.id}`}
                  />
                  <label
                    htmlFor={`cat-${cat.id}`}
                    className="font-light text-gray-800 dark:text-gray-100 cursor-pointer"
                  >
                    {cat.name}
                  </label>
                </li>
              ))}
            </ul>
          </>
        )}

        {!bestMatch && otherMatches.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 italic text-center">
            No results matched your search.
          </p>
        )}

        <p className="font-extralight text-sm my-2 text-center dark:text-gray-300">
          Not what you are looking for?{' '}
          <Link className="text-[#0077B6] dark:text-sky-400" href="/">
            Edit your search
          </Link>
        </p>

        <div className="flex flex-row mx-auto w-[90%] sm:w-[60%] md:w-[50%] gap-2">
          <ResetButton type="Skip" loading={false} />
          <SearchButton type="Next" loading={false} />
        </div>
      </form>
    </>
  );
}