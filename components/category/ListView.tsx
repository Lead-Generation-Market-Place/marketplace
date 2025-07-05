export type SubCategory = {
  id: string;
  name: string;
};

interface ListViewProps {
  subcategories: SubCategory[];
  selectedId: string | null;
  onSelect: (id: string, name: string) => void;
}

export default function ListView({ subcategories, selectedId, onSelect }: ListViewProps) {
  return (
    <ul className="space-y-1">
      {subcategories.map((sub) => (
        <li
          key={sub.id}
          onClick={() => onSelect(sub.id, sub.name)}
          className={`cursor-pointer py-2 px-3 rounded text-sm transition-colors duration-200
            ${
              sub.id === selectedId
                ? "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
        >
          {sub.name}
        </li>
      ))}
    </ul>
  );
}
