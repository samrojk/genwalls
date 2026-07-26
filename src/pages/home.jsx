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
      <div className="px-16">
        <Navbar />
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
            <section id="trending" className="pb-20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium">Trending 🔥</h2>

                <span className="text-sm text-accent-white/60">
                  {trendingWallpapers.length} wallpapers
                </span>
              </div>

              <WallpaperGrid wallpapers={trendingWallpapers} />
            </section>

            <section id="featured" className="pb-20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium">Featured</h2>

                <span className="text-sm text-accent-white/60">
                  {featuredWallpapers.length} wallpapers
                </span>
              </div>

              <WallpaperGrid wallpapers={featuredWallpapers} />
            </section>

            <section id="latest" className="pb-20">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium">Latest</h2>

                <span className="text-sm text-accent-white/60">
                  {latestWallpapers.length} wallpapers
                </span>
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
