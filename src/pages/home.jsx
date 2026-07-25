import Navbar from "../components/navbar";
import Categorychips from "../components/categorychips";

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
        </main>
      </div>
    </>
  );
};

export default home;
