import { Link } from "react-router-dom";

const WallpaperCard = ({ wallpaper }) => {
  return (
    <Link
      to={`/wallpaper/${wallpaper.slug}`}
      className="group relative block overflow-hidden rounded-xl"
    >
      <img
        src={wallpaper.image}
        alt={wallpaper.title}
        loading="lazy"
        className="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-4 pt-12 opacity-0 transition-opacity duration-250 group-hover:opacity-100">
        <h3 className="font-medium text-accent-white">{wallpaper.title}</h3>

        <p className="mt-1 text-sm text-white/60">Category: {wallpaper.category}</p>
      </div>
    </Link>
  );
};

export default WallpaperCard;
