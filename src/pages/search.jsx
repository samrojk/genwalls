import { useSearchParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import WallpaperGrid from "../components/wallpapergrid";
import wallpapers from "../data/wallpapers.json";

const search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const normalizedQuery = query.toLowerCase().trim();

  const results = wallpapers.filter((wallpaper) => {
    const titleMatch = wallpaper.title.toLowerCase().includes(normalizedQuery);

    const categoryMatch = wallpaper.category
      .toLowerCase()
      .includes(normalizedQuery);

    const tagsMatch = wallpaper.tags.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery),
    );

    return titleMatch || categoryMatch || tagsMatch;
  });

  return (
    <>
      <main className="mx-auto max-w-auto px-4 lg:px-16 py-4 lg:py-10">
        <div className="mb-4 lg:mb-6 flex items-center justify-between">
          <div className="flex lg:items-center gap-4 flex-col-reverse lg:flex-row w-full">
            <button
              onClick={() => navigate(-1)}
              className="-ml-1 inline-flex items-center gap-2 rounded-xl border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/80 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5 scale-95 lg:scale-100 w-fit"
            >
              <FaArrowLeft size={14} />
              Back
            </button>
            <h1 className="text-sm lg:text-xl font-normal lg:font-medium text-accent-white/95">
              Search results for "{query}"
            </h1>
          </div>

          <p className="flex gap-1.5 mt-8 lg:mt-2 text-sm text-accent-white/50 lg:w-37">
            {results.length}{" "}
            <span className="hidden lg:block">wallpapers found</span>
            <span className="lg:hidden block">results</span>
          </p>
        </div>

        {results.length > 0 ? (
          <WallpaperGrid wallpapers={results} />
        ) : (
          <div className="flex min-h-[50vh] items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-medium">No wallpapers found</h2>
              <p className="mt-2 text-sm text-accent-white/50">
                Try searching for something else.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default search;
