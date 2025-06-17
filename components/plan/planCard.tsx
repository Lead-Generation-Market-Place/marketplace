import { CircleCheckBig, X, SunDim } from "lucide-react";

interface TodoCardProps {
  title: string;
  description?: string;
  badgeText?: string;
  isCompleting?:boolean;
  onMarkDone?: () => void;
  onGetItDone?: () => void;
  onRemove?: () => void;
  showBadge?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PlanCard = ({
  title,
  description,
  badgeText,
  isCompleting,
  onMarkDone,
  onGetItDone,
  onRemove,
  showBadge,
  className,
  children,
}: TodoCardProps) => {

  return (
    <div
      className={`relative flex flex-col justify-between min-h-[150px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors ${className || ""}`}
    >
      {showBadge && badgeText && (
        <span className="inline-flex max-w-max items-center gap-1 text-xs font-semibold text-violet-800 bg-violet-100 rounded-full px-2 py-1 mb-1 dark:text-violet-300 dark:bg-violet-900">
          <SunDim className="inline h-5 w-5" />
          {badgeText}
        </span>
      )}
      <p className="text-sky-600 dark:text-sky-400 font-semibold capitalize break-words" title={title}>
        {title}
      </p>
      {description && (
        <p
        className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis mt-1 mb-1"
        title={description}
      >
        {description}
      </p>
      )}
      <div className="flex-1" />
      <div className="py-1 text-gray-500 dark:text-gray-400 flex justify-center gap-4 items-center flex-wrap gap-2">
        <button
          className="border border-gray-300 dark:border-gray-600 rounded text-sky-500 py-1 px-3 hover:bg-sky-50 dark:hover:bg-gray-800 transition"
          onClick={onMarkDone}
        >
          <CircleCheckBig className="w-4 h-4 inline mr-1" />
          {isCompleting ? ('progress...'): ('Mark Done')}
        </button>
        <button
          className="border border-sky-500 bg-sky-500 rounded text-white px-2 py-1 hover:bg-sky-600 dark:hover:bg-sky-400 transition"
          onClick={onGetItDone}
        >
          Get it Done
        </button>
      </div>
      {onRemove && (
        <span
          className="absolute top-3 right-3 hover:text-sky-500 cursor-pointer transition-colors"
          title="Remove"
          onClick={onRemove}
        >
          <X className="w-5 h-5" />
        </span>
      )}
      {children}
    </div>
  );
};

export default PlanCard;