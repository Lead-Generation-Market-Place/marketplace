export default function SkeletonListView() {
  return (
    <div role="status" aria-live="polite" className="space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
      ))}
    </div>
  );
}
