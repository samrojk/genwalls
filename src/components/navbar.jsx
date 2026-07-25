import { Link } from "react-router-dom";
import Searchbar from "./searchbar";
import Logo from "../assets/genwalls.webp";

const navbar = () => {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-accent-dark/80 py-2 backdrop-blur-lg">
      <Link
        to="/"
        className="flex items-center gap-2 text-accent-white font-medium text-lg"
      >
        <img src={Logo} alt="Logo" className="w-12 h-12" />
        GenWalls
      </Link>

      <Searchbar />
      <div className="flex gap-2">
        <Link
          to="/category/anime"
          className="text-accent-white/88 hover:text-accent-white px-4 py-1 rounded-xl hover:bg-white/5 transition-all duration-200"
        >
          Category
        </Link>
      </div>
    </nav>
  );
};

export default navbar;
