import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import Navbar from "../components/navbar";
import Categorychips from "../components/categorychips";
import wallpapers from "../data/wallpapers.json";
import WallpaperGrid from "../components/wallpapergrid";

const home = () => {
  const trendingWallpapers = wallpapers
    .filter((wallpaper) => wallpaper.trending)
    .slice(0, 4);

  const featuredWallpapers = wallpapers
    .filter((wallpaper) => wallpaper.featured)
    .slice(0, 4);

  const latestWallpapers = [...wallpapers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <>
      <Navbar />
      <div className="px-16">
        <main className="mx-auto max-w-350">
          <section className="py-18 text-center">
            <h1 className="text-accent-white font-semibold text-5xl tracking-tight">
              Find your next wallpaper.
            </h1>
            <p className="text-accent-white/50 text-base mt-4">
              Explore high-quality AI-generated wallpapers made for every
              screen.
            </p>
            <Categorychips />
          </section>

          {/* Wallpapers Section */}
          <section>
            {/* Trending Section */}
            <section id="trending" className="pb-20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium">Trending 🔥</h2>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-accent-white/60">
                    {trendingWallpapers.length} wallpapers
                  </span>
                  <Link
                    to="/trending"
                    className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
                  >
                    Show all
                    <FaAngleRight />
                  </Link>
                </div>
              </div>

              <WallpaperGrid wallpapers={trendingWallpapers} />
            </section>

            {/* Featured Section */}
            <section id="featured" className="pb-20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium">Featured</h2>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-accent-white/60">
                    {featuredWallpapers.length} wallpapers
                  </span>
                  <Link
                    to="/featured"
                    className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
                  >
                    Hand-picked
                    <FaAngleRight />
                  </Link>
                </div>
              </div>

              <WallpaperGrid wallpapers={featuredWallpapers} />
            </section>

            {/* Latest Section */}
            <section id="latest" className="pb-20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium">Latest</h2>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-accent-white/60">
                    {latestWallpapers.length} wallpapers
                  </span>
                  <Link
                    to="/latest"
                    className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
                  >
                    Explore all
                    <FaAngleRight />
                  </Link>
                </div>
              </div>

              <WallpaperGrid wallpapers={latestWallpapers} />
            </section>
          </section>
        </main>
      </div>
    </>
  );
};

export default home;
