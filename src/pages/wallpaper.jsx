import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaAngleRight } from "react-icons/fa6";
import WallpaperGrid from "../components/wallpapergrid";
import wallpapers from "../data/wallpapers.json";

const wallpaper = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const wallpaper = wallpapers.find((item) => item.slug === slug);

  if (!wallpaper) {
    return (
      <>
        <main className="flex min-h-[71vh] items-center justify-center px-6">
          <div className="text-center">
            <span className="text-sm text-accent-white/50">404 ERROR</span>
            <h1 className="mt-2 text-4xl font-semibold">Lost in the walls!</h1>
            <p className="mt-2 text-accent-white/50">
              We couldn't find the wallpaper you're looking for...
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

  const relatedWallpapers = wallpapers
    .filter((w) => w.id !== wallpaper.id)
    .map((w) => {
      const matchingTags = w.tags.filter((tag) =>
        wallpaper.tags.includes(tag),
      ).length;

      const score =
        matchingTags * 5 + (w.category === wallpaper.category ? 3 : 0);

      return { ...w, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <>
      <main className="mx-auto px-16 pb-10 py-8">
        {/* Back btn */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-accent-white/80 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        <section className="grid overflow-hidden rounded-2xl border border-accent-white/6 bg-accent-white/2 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* image */}
          <div className="flex min-h-125 items-center justify-center bg-accent-dark lg:min-h-132 p-4">
            <img
              src={wallpaper.image}
              alt={wallpaper.title}
              onLoad={(e) => {
                setDimensions({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                });
              }}
              className="max-h-[70vh] max-w-full rounded-xl object-contain"
            />
          </div>

          {/* Content */}
          <aside className="flex flex-col border-t border-accent-white/6 p-4 lg:border-t-0 lg:border-l">
            <div>
              <p className="text-sm text-accent-white/64">
                {wallpaper.category}
              </p>
              <h1 className="mt-2 text-2xl font-semibold">{wallpaper.title}</h1>

              <div className="mt-2 h-5 flex flex-wrap items-center gap-2 text-sm text-accent-white/64">
                {dimensions.width > 0 ? (
                  <>
                    <span>
                      {dimensions.width > dimensions.height
                        ? "Desktop"
                        : dimensions.width < dimensions.height
                          ? "Mobile"
                          : "Profile picture"}
                    </span>

                    <span>•</span>

                    <span>
                      {dimensions.width} × {dimensions.height}
                    </span>
                  </>
                ) : (
                  <div className="h-4 w-full animate-pulse rounded-xl bg-accent-white/2" />
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-accent-white/88">
                Tags
              </p>

              <div className="flex flex-wrap gap-2">
                {wallpaper.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-accent-white/8 bg-accent-white/2 px-3 py-1.5 text-xs text-accent-white/64"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Download */}
            <div className="mt-auto pt-10">
              <a
                href={wallpaper.image}
                download
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-white px-4 py-3 font-medium text-accent-dark transition hover:opacity-90"
              >
                <FaDownload />
                Download wallpaper
              </a>
              <p className="mt-3 text-center text-xs text-accent-white/40">
                Free for personal use
              </p>
            </div>
          </aside>
        </section>

        {/* Related */}
        {relatedWallpapers.length > 0 && (
          <section>
            <div className="mt-16 mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium">More like this</h2>

              <Link
                to={`/category/${wallpaper.category.toLowerCase()}`}
                className="flex items-center gap-1 rounded-full border bg-accent-white/2 border-accent-white/4 px-4 py-2 text-sm text-accent-white/64 transition-all duration-200 hover:border-accent-white/8 hover:text-accent-white hover:bg-accent-white/5"
              >
                View all
                <FaAngleRight />
              </Link>
            </div>

            <WallpaperGrid wallpapers={relatedWallpapers} />
          </section>
        )}
      </main>
    </>
  );
};

export default wallpaper;
