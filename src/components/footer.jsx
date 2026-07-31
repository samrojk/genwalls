import { FaGithub, FaCoffee } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-accent-white/6 bg-accent-dark/80 backdrop-blur-lg">
      <div className="mx-auto flex items-center justify-between px-4 lg:px-16 pt-4 pb-8">
        <p className="text-sm text-accent-white/40">© 2026 GenWalls</p>

        <div className="flex items-center gap-1 lg:gap-3">
          <a
            href="https://github.com/samrojk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-4 lg:px-4 py-2
            text-sm text-accent-white/90 lg:text-accent-white/60
            transition-all duration-200
            active:opacity-70 lg:active:opacity-100
            lg:hover:bg-white/5 lg:hover:text-accent-white"
          >
            <FaGithub className="size-6 lg:size-4.5" />
            <span className="hidden lg:block">GitHub</span>
          </a>

          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-4 lg:px-4 py-2
            text-sm text-accent-white/90 lg:text-accent-white/60
            transition-all duration-200
            active:opacity-70 lg:active:opacity-100
            lg:hover:bg-white/5 lg:hover:text-accent-white"
          >
            <FaCoffee className="size-6 lg:size-4.5 lg:hidden" />
            <span className="hidden lg:block">Buy Me a Coffee ☕</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
