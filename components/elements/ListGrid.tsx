
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

type Item = {
  id: string | number;
  name: string;
  link: string; // computed before passing in
};

type ListGridProps = {
  items: Item[];
  title: string;
  breadcrumb: string;
  breadcrumbHref?: string;
};

export default function ListGrid({ items, title, breadcrumb, breadcrumbHref = '/' }: ListGridProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm font-light uppercase flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
        <Link href={breadcrumbHref} className="hover:text-sky-500">
          Yelpax
        </Link>
        <ChevronRight className="w-5 h-5" />
        <span>{breadcrumb}</span>
      </div>

      <h1 className="capitalize border-b border-gray-200 dark:border-gray-700 text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-6 py-6">
        {title}
      </h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-20">
          <Image
            src="/notFound.svg"
            alt="No items found"
            width={200}
            height={200}
            className="mx-auto mb-4" />
          <p className="text-lg">No items found</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center">
          {items.map((item) => (
            <li key={item.id} className="text-start text-sm">
              <Link
                href={item.link}
                className="text-sky-600 dark:text-sky-400 hover:text-sky-500 capitalize"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

