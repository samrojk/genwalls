import React from "react";
import { FaGithub } from "react-icons/fa";

const footer = () => {
  return (
    <div className="flex gap-2 justify-center items-center text-accent-white/60 tracking-wide text-sm">
      © Copyright 2026 GenWalls | Made with{" "}
      <p className="text-accent-white">❤️</p> by
      <a
        href="https://github.com/samrojk"
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-2 px-2 py-1 rounded-md items-center hover:text-accent-white/90 hover:bg-accent-white/5 transition-all duration-200"
      >
        <FaGithub />
        Samroj Khan
      </a>
    </div>
  );
};

export default footer;
