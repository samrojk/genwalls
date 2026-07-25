import Navbar from "../components/navbar";
import Categorychips from "../components/categorychips";
import wallpapers from "../data/wallpapers.json";
import WallpaperGrid from "../components/wallpapergrid";

const home = () => {
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
          <section className="pb-20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium">Explore</h2>

              <span className="text-sm text-accent-white/50">
                {wallpapers.length} wallpapers
              </span>
            </div>

            <WallpaperGrid wallpapers={wallpapers} />
          </section>
        </main>
      </div>
    </>
  );
};

export default home;
