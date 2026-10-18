import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaAngleRight } from "react-icons/fa6";
import WallpaperGrid from "../components/wallpapergrid";
import { supabase } from "../lib/supabase";

const Category = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallpapers = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("wallpapers")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch categories:", error);
        setError("Couldn't load categories. Please try again later.");
      } else {
        setWallpapers(data ?? []);
      }

      setLoading(false);
    };

    fetchWallpapers();
  }, []);

  const categories = [
    ...new Set(wallpapers.map((wallpaper) => wallpaper.category)),
  ];

  const categoryWallpapers = slug
    ? wallpapers.filter(
        (wallpaper) => wallpaper.category.toLowerCase() === slug.toLowerCase(),
      )
    : [];

  const categoryName = categoryWallpapers[0]?.category;

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="text-accent-white/50">Loading categories...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-6">
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  // /category
  if (!slug) {
    return (
      <main className="mx-auto max-w-auto px-4 lg:px-16 py-4 lg:py-10">
        <div className="flex items-center justify-between">
          <span>
            <h1 className="text-lg lg:text-3xl font-medium lg:font-semibold">
              Categories
            </h1>
            <p className="hidden lg:block mt-1 text-accent-white/64">
              Browse wallpapers by category
            </p>
          </span>

          <div className="flex items-center gap-2 lg:gap-4">
            <span className="text-xs lg:text-sm text-accent-white/60">
              {categories.length} categories
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

        {categories.length === 0 ? (
          <p className="py-12 text-center text-accent-white/50">
            No categories available yet.
          </p>
        ) : (
          <div className="mt-4 lg:mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryItems = wallpapers.filter(
                (wallpaper) => wallpaper.category === category,
              );
              const preview = categoryItems[0];

              return (
                <Link
                  key={category}
                  to={`/category/${category.toLowerCase()}`}
                  className="group relative block overflow-hidden rounded-xl"
                >
                  <img
                    src={preview.image}
                    alt={category}
                    loading="lazy"
                    className="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/35 to-transparent p-4 pt-14 overflow-hidden">
                    <div className="translate-y-6 transition-all duration-300 group-hover:translate-y-0">
                      <h3 className="font-medium text-accent-white">
                        {category}
                      </h3>

                      <p className="mt-1 translate-y-3 opacity-0 text-sm text-white/60 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {categoryItems.length} Wallpapers
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    );
  }

  // /category/:slug
  if (categoryWallpapers.length === 0) {
    return (
      <main className="flex min-h-[71vh] items-center justify-center px-6">
        <div className="text-center">
          <span className="text-xs lg:text-sm text-accent-white/50">
            CATEGORY NOT FOUND
          </span>
          <h1 className="mt-1 lg:mt-2 text-3xl lg:text-4xl font-semibold">
            Nothing here yet.
          </h1>
          <p className="mt-2 text-sm lg:text-base text-accent-white/50">
            This category doesn't exist or has no wallpapers...
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/80 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100"
          >
            <FaArrowLeft size={14} />
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-auto px-4 lg:px-16 py-4 lg:py-10">
      <div className="mb-4 lg:mb-6 flex items-center justify-between">
        <div className="flex lg:items-center gap-4 flex-col lg:flex-row w-full">
          <button
            onClick={() => navigate(-1)}
            className="-ml-1 inline-flex items-center gap-2 rounded-xl border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/80 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100 w-fit"
          >
            <FaArrowLeft size={14} />
            Back
          </button>
          <h1 className="text-lg lg:text-xl font-medium lg:font-semibold">
            {categoryName} Wallpapers
          </h1>
        </div>

        <p className="mt-14 lg:mt-2 text-xs lg:text-sm text-accent-white/50 w-24">
          {categoryWallpapers.length} wallpapers
        </p>
      </div>

      <WallpaperGrid wallpapers={categoryWallpapers} />
    </main>
  );
};

export default Category;
