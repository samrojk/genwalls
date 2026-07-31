import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Searchbar from "./searchbar";
import Logo from "../assets/genwalls.webp";
import { CgMenu } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="px-2 lg:px-16 gap-4 sticky top-0 z-50 flex w-full items-center justify-between bg-accent-dark/80 py-3 backdrop-blur-lg">
        <Link
          to="/"
          className="flex items-center gap-2 text-accent-white font-medium text-lg shrink-0 -mr-1.5 lg:mr-0"
        >
          <img src={Logo} alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12" />
          <span className="hidden sm:block">GenWalls</span>
        </Link>

        <Searchbar />

        {/* Desktop Pages */}
        <div className="hidden lg:flex gap-2 items-center">
          <Link
            to="/category"
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
            to="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-dark font-medium px-4 py-2 rounded-xl bg-accent-white hover:opacity-90 transition-all duration-200"
          >
            Buy Me a Coffee ☕
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-accent-white mr-2"
        >
          <CgMenu size={24} />
        </button>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`lg:hidden fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Side Drawer */}
      <aside
        className={`lg:hidden fixed top-0 right-0 z-60 h-screen w-72 bg-accent-dark shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <span className="text-accent-white font-medium text-lg">Menu</span>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-accent-white"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col p-4 gap-2">
          <Link
            to="/category"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-accent-white active:text-accent-white/70 transition"
          >
            Category
          </Link>

          <Link
            to="/trending"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-accent-white active:text-accent-white/70 transition"
          >
            Trending
          </Link>

          <Link
            to="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-3 rounded-xl bg-accent-white text-accent-dark text-center font-medium px-4 py-3 active:opacity-80 transition"
          >
            Buy Me a Coffee ☕
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
