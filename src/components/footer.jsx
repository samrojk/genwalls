import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-accent-white/6 bg-accent-white/1">
      <div className="mx-auto flex items-center justify-between px-16 pt-4 pb-8">
        <p className="text-accent-white/40 text-sm">© 2026 GenWalls</p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/samrojk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-white/60 text-sm hover:text-accent-white px-4 py-2 rounded-xl hover:bg-accent-white/5 transition-all duration-200"
          >
            <FaGithub />
            GitHub
          </a>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-white/60 text-sm hover:text-accent-white px-4 py-2 rounded-xl hover:bg-accent-white/5 transition-all duration-200"
          >
            Buy Me a Coffee ☕
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
