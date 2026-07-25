import { RiSearchAiLine } from "react-icons/ri";

const searchbar = () => {
  return (
    <div className="flex items-center gap-3 border border-accent-white/4 bg-accent-white/6 px-4 py-2 rounded-xl w-full max-w-100">
      <button>
        <RiSearchAiLine size={22} className="text-accent-white" />
      </button>

      <input
        type="text"
        placeholder="Search wallpapers..."
        className="w-full bg-transparent text-sm text-accent-white outline-none placeholder:text-accent-white/40"
      />
    </div>
  );
};

export default searchbar;