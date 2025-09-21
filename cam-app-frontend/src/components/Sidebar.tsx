"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Categories } from "@/types/Schema";


export default function Sidebar({ categories }: { categories: Categories[] }) {
  const router = useRouter();
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const debouncedSubs = useDebounce(selectedSubs, 500);
  const mainCategories = categories.filter((cat) => !cat.parent_name);

  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});

  const handleAccordionToggle = (mainName: string) => {
    setOpenAccordions((prev) => ({ ...prev, [mainName]: !prev[mainName] }));
  };

  const handleCheckboxChange = (subName: string) => {
    setSelectedSubs((prev) =>
      prev.includes(subName)
        ? prev.filter((s) => s !== subName)
        : [...prev, subName]
    );
  };

  useEffect(() => {
    if (debouncedSubs.length > 0) {
      router.push(`/stream?filters=${debouncedSubs.join(",")}`);
    } else {
      router.push(`/stream`);
    }
  }, [debouncedSubs, router]);

  return (
    <div className="w-full h-full bg-[#1a1a1a] text-white p-0">
      {mainCategories.map((main) => (
        <div key={main.name} className="border-b border-[#222]">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-transparent hover:bg-[#222] focus:outline-none"
            onClick={() => handleAccordionToggle(main.name)}
          >
            <span className="font-medium text-[#bbb]">{main.name}</span>
            <span className={`transition-transform ${openAccordions[main.name] ? 'rotate-90' : ''}`}>
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          {openAccordions[main.name] && (
            <ul className="pl-4 pb-2">
              {categories
                .filter((sub) => sub.parent_name === main.name)
                .map((sub) => (
                  <li key={sub.name} className="flex items-center py-2 hover:bg-[#222] rounded px-2">
                    <input
                      type="checkbox"
                      checked={selectedSubs.includes(sub.name)}
                      onChange={() => handleCheckboxChange(sub.name)}
                      className="accent-white mr-2 w-4 h-4"
                    />
                    <span className="text-[#bbb]">{sub.name}</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
