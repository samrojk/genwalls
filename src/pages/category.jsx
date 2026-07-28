import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaAngleRight } from "react-icons/fa6";
import Navbar from "../components/navbar";
import WallpaperGrid from "../components/wallpapergrid";
import wallpapers from "../data/wallpapers.json";

const Category = () => {
  const { slug } = useParams();

  // /category page
  if (!slug) {
    const categories = [...new Set(wallpapers.map((w) => w.category))];
    const totalCategories = categories.length;

    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-auto px-16 py-10">
          <div className="flex items-center justify-between">
            <span>
              <h1 className="text-3xl font-semibold">Categories</h1>
              <p className="mt-1 text-accent-white/64">
                Browse wallpapers by category
              </p>
            </span>

            <div className="flex items-center gap-4">
              <span className="text-sm text-accent-white/60">
                {totalCategories} categories
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

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const preview = wallpapers.find((w) => w.category === category);

              const count = wallpapers.filter(
                (w) => w.category === category,
              ).length;

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
                        {count} Wallpapers
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </>
    );
  }

  // /category/:slug
  const categoryWallpapers = wallpapers.filter(
    (wallpaper) => wallpaper.category.toLowerCase() === slug.toLowerCase(),
  );
  const navigate = useNavigate();

  const categoryName = categoryWallpapers[0]?.category;

  if (categoryWallpapers.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="text-center">
            <span className="text-sm text-accent-white/50">
              CATEGORY NOT FOUND
            </span>
            <h1 className="mt-2 text-4xl font-semibold">Nothing here yet.</h1>
            <p className="mt-2 text-accent-white/50">
              This category doesn't exist or has no wallpapers...
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/80 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
            >
              <FaArrowLeft size={14} />
              Go Back
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-auto px-16 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/80 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
            >
              <FaArrowLeft size={14} />
              Back
            </button>
            <h1 className="text-xl font-semibold">{categoryName} Wallpapers</h1>
          </div>

          <p className="mt-2 text-sm text-accent-white/50">
            {categoryWallpapers.length} wallpapers
          </p>
        </div>

        <WallpaperGrid wallpapers={categoryWallpapers} />
      </main>
    </>
  );
};

export default Category;
