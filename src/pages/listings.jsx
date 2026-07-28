import { Link, useLocation } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import WallpaperGrid from "../components/wallpapergrid";
import wallpapers from "../data/wallpapers.json";

const Listing = () => {
  const { pathname } = useLocation();

  let title = "";
  let description = "";
  let filteredWallpapers = [];

  switch (pathname) {
    case "/trending":
      title = "Trending";
      description = "Most popular wallpapers right now.";
      filteredWallpapers = wallpapers.filter((wallpaper) => wallpaper.trending);
      break;

    case "/featured":
      title = "Featured";
      description = "Hand-picked wallpapers from our collection.";
      filteredWallpapers = wallpapers.filter((wallpaper) => wallpaper.featured);
      break;

    case "/latest":
      title = "Latest";
      description = "Newest wallpapers added to GenWalls.";
      filteredWallpapers = [...wallpapers].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      break;

    default:
      title = "Wallpapers";
      filteredWallpapers = wallpapers;
  }

  return (
    <>
      <main className="mx-auto max-w-auto px-16 py-10">
        <div className="mb-6 flex items-center justify-between">
          <span>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-1 text-accent-white/64">{description}</p>
          </span>

          <div className="flex items-center gap-4">
            <span className="text-sm text-accent-white/60">
              {filteredWallpapers.length} wallpapers
            </span>
            <Link
              to="/"
              className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
            >
              Back to Home
              <FaAngleRight />
            </Link>
          </div>
        </div>

        <WallpaperGrid wallpapers={filteredWallpapers} />
      </main>
    </>
  );
};

export default Listing;
