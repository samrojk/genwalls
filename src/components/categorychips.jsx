import { Link } from "react-router-dom";

const categories = [
  "Anime",
  "Cars",
  "Aesthetic",
  "Gaming",
  "Nature",
  "Space & Sci-Fi",
  "Abstract",
];

const categorychips = () => {
  return (
    <div className="mt-6 flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Link
          key={category}
          to={`/category/${category.toLowerCase()}`}
          className="rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default categorychips;
