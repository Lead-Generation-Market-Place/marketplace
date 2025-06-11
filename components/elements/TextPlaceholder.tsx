const TextPlaceholder = () => {
  return (
    <div
      role="status"
      className="w-full px-4 sm:px-8 md:px-16 space-y-4 divide-y divide-gray-200 rounded-sm animate-pulse dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <p className="mx-auto mt-5 h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full max-w-[300px] mb-2.5"></p>
      {[...Array(4)].map((_, idx) => (
        <div className="flex items-center justify-between pt-4" key={idx}>
          <div className="w-full">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-3/4 mb-2.5"></div>
            <div className="w-1/2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TextPlaceholder;