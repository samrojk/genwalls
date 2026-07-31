import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiSearchAiLine } from "react-icons/ri";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 border border-accent-white/4 bg-accent-white/6 px-4 py-2 rounded-xl w-full min-w-60 max-w-100"
    >
      <button type="submit">
        <RiSearchAiLine size={22} className="text-accent-white" />
      </button>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search wallpapers..."
        className="w-full bg-transparent text-sm text-accent-white outline-none placeholder:text-accent-white/40"
      />
    </form>
  );
};

export default Searchbar;
