import { Link } from "react-router-dom";
import Searchbar from "./searchbar";
import Logo from "../assets/genwalls.webp";

const navbar = () => {
  return (
    <nav className="px-16 sticky top-0 z-50 flex w-full items-center justify-between bg-accent-dark/80 py-3 backdrop-blur-lg">
      <Link
        to="/"
        className="flex items-center gap-2 text-accent-white font-medium text-lg"
      >
        <img src={Logo} alt="Logo" className="w-12 h-12" />
        GenWalls
      </Link>

      <Searchbar />
      {/* Pages */}
      <div className="flex gap-2 items-center">
        <Link
          to="/category/anime"
          className="text-accent-white/88 hover:text-accent-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
        >
          Category
        </Link>
        <Link
          to="/trending"
          className="text-accent-white/88 hover:text-accent-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
        >
          Trending
        </Link>
        <Link
          hidden
          to="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-white/88 hover:text-accent-white px-4 py-2 rounded-xl border border-accent-white/4 hover:border-accent-white/8 bg-white/2 hover:bg-accent-white/5 transition-all duration-200"
        >
          Buy Me a Coffee ☕
        </Link>
      </div>
    </nav>
  );
};

export default navbar;
