const TextPlaceholder = () => {
  return (
        <div role="status" className="w-full px-18 space-y-4 divide-y divide-gray-200 rounded-sm animate-pulse dark:divide-gray-700">
            <p className="mx-auto mt-5 h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-100 mb-2.5"></p>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-34 mb-2.5"></div>
                    <div className="w-42 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-34 mb-2.5"></div>
                    <div className="w-42 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-34 mb-2.5"></div>
                    <div className="w-42 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div>
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-34 mb-2.5"></div>
                    <div className="w-42 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
  );
}
export default TextPlaceholder;