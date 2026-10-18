import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";
import Categorychips from "../components/categorychips";
import WallpaperGrid from "../components/wallpapergrid";
import { supabase } from "../lib/supabase";

const home = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallpapers = async () => {
      const { data, error } = await supabase
        .from("wallpapers")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch wallpapers:", error);
        setError("Couldn't load wallpapers. Please try again later.");
      } else {
        setWallpapers(data ?? []);
      }

      setLoading(false);
    };

    fetchWallpapers();
  }, []);

  // ALL TRENDING
  const allTrendingWallpapers = wallpapers.filter(
    (wallpaper) => wallpaper.trending,
  );

  // Show only 3 trending on homepage
  const trendingWallpapers = allTrendingWallpapers.slice(0, 3);

  // ALL FEATURED
  const allFeaturedWallpapers = wallpapers.filter(
    (wallpaper) => wallpaper.featured,
  );

  // Remove wallpapers already displayed in Trending
  const featuredWallpapers = allFeaturedWallpapers
    .filter(
      (wallpaper) =>
        !trendingWallpapers.some((trending) => trending.id === wallpaper.id),
    )
    .slice(0, 3);

  // ALL WALLPAPERS SORTED NEWEST FIRST
  const allLatestWallpapers = [...wallpapers].sort(
    (a, b) =>
      new Date(b.createdAt ?? b.created_at) -
      new Date(a.createdAt ?? a.created_at),
  );

  // Remove anything already displayed in Trending or Featured
  const latestWallpapers = allLatestWallpapers
    .filter(
      (wallpaper) =>
        !trendingWallpapers.some((trending) => trending.id === wallpaper.id) &&
        !featuredWallpapers.some((featured) => featured.id === wallpaper.id),
    )
    .slice(0, 12);

  return (
    <>
      <div className="px-4 lg:px-16">
        <main className="mx-auto max-w-auto">
          <section className="mb-4 lg:mb-0 py-8 lg:py-16 text-center justify-items-center">
            <h1 className="text-accent-white font-semibold text-4xl lg:text-5xl tracking-tight">
              Find your next wallpaper.
            </h1>
            <p className="text-accent-white/50 w-80 lg:w-auto text-sm lg:text-base mt-2 lg:mt-4">
              Explore high-quality AI-generated wallpapers made for every
              screen.
            </p>
            <Categorychips />
          </section>

          {loading ? (
            <p className="py-12 text-center text-accent-white/50">
              Loading wallpapers...
            </p>
          ) : error ? (
            <p className="py-12 text-center text-red-400">{error}</p>
          ) : (
            <section>
              {/* Trending Section */}
              <section id="trending" className="pb-14 lg:pb-20">
                <div className="mb-4 lg:mb-6 flex items-center justify-between">
                  <h2 className="text-lg lg:text-2xl font-medium">
                    Trending 🔥
                  </h2>

                  <div className="flex items-center gap-2 lg:gap-4">
                    <span className="text-xs lg:text-sm text-accent-white/60">
                      {allTrendingWallpapers.length} wallpapers
                    </span>
                    <Link
                      to="/trending"
                      className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100"
                    >
                      Show all
                      <FaAngleRight />
                    </Link>
                  </div>
                </div>

                <WallpaperGrid wallpapers={trendingWallpapers} />
              </section>

              {/* Featured Section */}
              <section id="featured" className="pb-14 lg:pb-20">
                <div className="mb-4 lg:mb-6 flex items-center justify-between">
                  <h2 className="text-lg lg:text-2xl font-medium">Featured</h2>

                  <div className="flex items-center gap-2 lg:gap-4">
                    <span className="text-xs text-accent-white/60">
                      {allFeaturedWallpapers.length} wallpapers
                    </span>
                    <Link
                      to="/featured"
                      className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100"
                    >
                      Hand-picked
                      <FaAngleRight />
                    </Link>
                  </div>
                </div>

                <WallpaperGrid wallpapers={featuredWallpapers} />
              </section>

              {/* Latest Section */}
              <section id="latest" className="pb-6 lg:pb-20">
                <div className="mb-4 lg:mb-6 flex items-center justify-between">
                  <h2 className="text-lg lg:text-2xl font-medium">Latest</h2>

                  <div className="flex items-center gap-2 lg:gap-4">
                    <span className="text-xs text-accent-white/60">
                      {allLatestWallpapers.length} wallpapers
                    </span>
                    <Link
                      to="/latest"
                      className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100"
                    >
                      Explore all
                      <FaAngleRight />
                    </Link>
                  </div>
                </div>

                <WallpaperGrid wallpapers={latestWallpapers} />

                <div className="mt-6 flex justify-center">
                  <Link
                    to="/latest"
                    className="flex items-center gap-1 text-sm rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100"
                  >
                    Show more
                    <FaAngleDown />
                  </Link>
                </div>
              </section>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default home;
