
const filterOptions = {
  region: ["All", "US/CA/UK/Australia", "Western Europe", "Asia", "Africa", "America"],
  age: ["All", "Teen 18+", "20s", "30s", "40+"],
  ethnicity: ["All", "Asian", "Black", "White", "Latina"],
  fetish: ["All", "Anal", "BDSM", "Feet", "Leather", "Group Sex"],
  language: ["All", "Deutsch", "English", "Spanish", "French", "Other"],
};

export default function Filters({ region, age, ethnicity, fetish, language, onFilterChange }: { region: string; age: string; ethnicity: string; fetish: string; language: string; onFilterChange: (key: string, value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 items-center bg-[#222] rounded-lg px-2 py-3">
      {Object.entries(filterOptions).map(([key, options]) => (
        <div key={key} className="flex flex-col">
          <label className="text-xs text-[#bbb] mb-1 capitalize">{key}</label>
          <select
            className="bg-[#181818] text-white border border-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
            value={eval(key)}
            onChange={(e) => onFilterChange(key, e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt} value={opt === "All" ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button
        type="button"
        className="ml-auto bg-[#1976d2] hover:bg-[#1565c0] text-white px-4 py-2 rounded flex items-center gap-2"
        onClick={() => window.location.reload()}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v6h6M20 20v-6h-6"/><path d="M20 4a16 16 0 0 0-16 16"/></svg>
        Refresh
      </button>
    </div>
  );
}