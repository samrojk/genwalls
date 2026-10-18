import { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const inputClass =
  "w-full rounded-lg border border-accent-white/10 bg-black/10 px-3 py-2 text-xs text-accent-white outline-none transition focus:border-accent-white/30 placeholder:text-accent-white/30";

// A single queued wallpaper: thumbnail, editable title/tags/category, and remove action.
const WallpaperQueueItem = ({ item, categories, onChange, onRemove }) => {
  const [expanded, setExpanded] = useState(false);

  const tags = item.tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <article className="overflow-hidden rounded-xl border border-accent-white/10 bg-accent-white/2.5">
      {/* Compact slab: preview at left, title/tags in the middle, remove at right. */}
      <div className="flex items-center gap-3 p-3">
        <img
          src={item.preview}
          alt={item.title || "Wallpaper preview"}
          className="h-16 w-16 shrink-0 rounded-lg bg-black/20 object-cover"
        />

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="min-w-0 flex-1 text-left"
          aria-expanded={expanded}
        >
          <span className="block truncate text-sm font-medium text-accent-white">
            {item.title || "Untitled wallpaper"}
          </span>
          <span className="mt-1 block truncate text-xs text-accent-white/45">
            {tags.length ? tags.join(", ") : "No tags added"}
          </span>
          <span className="mt-1 block text-[11px] text-accent-white/35">
            {item.category} · {item.createdAt}
          </span>
        </button>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.title || item.file.name}`}
          title="Remove image"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-accent-white/45 transition active:bg-white/10 active:text-accent-white lg:hover:bg-white/5 lg:hover:text-accent-white"
        >
          <FaTimes size={14} />
        </button>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-label={
            expanded ? "Hide wallpaper details" : "Edit wallpaper details"
          }
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-accent-white/40 transition active:bg-white/10 lg:hover:text-accent-white"
        >
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
      </div>

      {/* Expand a slab to edit metadata for this specific image. */}
      {expanded && (
        <div className="space-y-3 border-t border-accent-white/10 p-3">
          <div>
            <label className="mb-1.5 block text-xs text-accent-white/55">
              Title
            </label>
            <input
              value={item.title}
              onChange={(event) =>
                onChange(item.key, { title: event.target.value })
              }
              className={inputClass}
              placeholder="Wallpaper title"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-accent-white/55">
              Category
            </label>
            <select
              value={item.category}
              onChange={(event) =>
                onChange(item.key, { category: event.target.value })
              }
              className={inputClass}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-accent-dark"
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-accent-white/55">
              Tags (comma-separated)
            </label>
            <input
              value={item.tagsInput}
              onChange={(event) =>
                onChange(item.key, { tagsInput: event.target.value })
              }
              className={inputClass}
              placeholder="anime, dark, 4k"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-accent-white/55">
              Date added
            </label>
            <input
              type="date"
              value={item.createdAt}
              onChange={(event) =>
                onChange(item.key, { createdAt: event.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs text-accent-white/65">
              <input
                type="checkbox"
                checked={item.trending}
                onChange={(event) =>
                  onChange(item.key, { trending: event.target.checked })
                }
                className="size-3.5 accent-white"
              />
              Trending
            </label>

            <label className="flex items-center gap-2 text-xs text-accent-white/65">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(event) =>
                  onChange(item.key, { featured: event.target.checked })
                }
                className="size-3.5 accent-white"
              />
              Featured
            </label>
          </div>
        </div>
      )}
    </article>
  );
};

export default WallpaperQueueItem;
