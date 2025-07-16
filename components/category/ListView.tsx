import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SubCategory {
  id: string;
  name: string;
  icon: string;
}

interface ListViewProps {
  subcategories: SubCategory[];
  onSelect: (subcategory: SubCategory) => void;
  selectedId: string | null;
}

export default function ListView({ subcategories, onSelect, selectedId }: ListViewProps) {
  return (
    <ul className="space-y-2">
      {subcategories.map((sub) => {
        const Icon =
          (LucideIcons[sub.icon as keyof typeof LucideIcons] as LucideIcon) ??
          LucideIcons.Circle;

        const isSelected = selectedId === sub.id;
        console.log(selectedId,isSelected); //testing for future use

        return (
          <li
            key={sub.id}
            className={`cursor-pointer flex items-center gap-2 py-2 px-2 hover:text-sky-500
              
            `}
            onClick={() => onSelect(sub)}
          >
            <Icon className="w-4 h-4" />
            <span className="capitalize">{sub.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
