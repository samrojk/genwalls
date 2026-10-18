import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import WallpaperGrid from "../components/wallpapergrid";
import { supabase } from "../lib/supabase";

const Listing = () => {
  const { pathname } = useLocation();

  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let title = "";
  let description = "";

  switch (pathname) {
    case "/trending":
      title = "Trending";
      description = "Most popular wallpapers right now.";
      break;
    case "/featured":
      title = "Featured";
      description = "Hand-picked wallpapers from our collection.";
      break;
    case "/latest":
      title = "Latest";
      description = "Newest wallpapers added to GenWalls.";
      break;
    default:
      title = "Wallpapers";
      description = "Explore our wallpaper collection.";
  }

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      setError("");

      let query = supabase.from("wallpapers").select("*").eq("published", true);

      if (pathname === "/trending") {
        query = query.eq("trending", true);
      } else if (pathname === "/featured") {
        query = query.eq("featured", true);
      }

      query = query.order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Failed to fetch wallpapers:", error);
        setError("Couldn't load wallpapers. Please try again later.");
      } else {
        setWallpapers(data ?? []);
      }

      setLoading(false);
    };

    fetchWallpapers();
  }, [pathname]);

  return (
    <main className="mx-auto max-w-auto px-4 lg:px-16 py-4 lg:py-10">
      <div className="mb-4 lg:mb-6 flex items-center justify-between">
        <span>
          <h1 className="text-lg lg:text-3xl font-medium lg:font-semibold">
            {title}
          </h1>
          <p className="hidden lg:block mt-1 text-accent-white/64">
            {description}
          </p>
        </span>

        <div className="flex items-center gap-2 lg:gap-4">
          <span className="text-xs lg:text-sm text-accent-white/60">
            {loading ? "Loading..." : `${wallpapers.length} wallpapers`}
          </span>
          <Link
            to="/"
            className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100"
          >
            Back to Home
            <FaAngleRight />
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-accent-white/50">
          Loading wallpapers...
        </p>
      ) : error ? (
        <p className="py-12 text-center text-red-400">{error}</p>
      ) : (
        <WallpaperGrid wallpapers={wallpapers} />
      )}
    </main>
  );
};

export default Listing;
