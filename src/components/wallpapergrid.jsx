import WallpaperCard from "./wallpapercard";

const WallpaperGrid = ({ wallpapers }) => {
  return (
    <div className="grid grid-cols-1 gap-3.5 lg:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard key={wallpaper.id} wallpaper={wallpaper} />
      ))}
    </div>
  );
};

export default WallpaperGrid;
