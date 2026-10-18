import { useEffect } from "react";
import { FaTimes, FaTrashAlt } from "react-icons/fa";

// A focused confirmation modal prevents accidental removal from the queue.
const ConfirmRemoveModal = ({ item, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onCancel]);

  if (!item) return null;

  const tags = item.tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-wallpaper-title"
        className="w-full max-w-md rounded-2xl border border-accent-white/10 bg-accent-dark p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id="remove-wallpaper-title"
              className="font-medium text-accent-white"
            >
              Remove wallpaper?
            </h2>
            <p className="mt-1 text-sm text-accent-white/45">
              This removes it from the current queue.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-accent-white/50 transition active:bg-white/10 lg:hover:text-accent-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Show exactly which queued image is about to be removed. */}
        <div className="flex items-center gap-3 rounded-xl border border-accent-white/10 bg-accent-white/3 p-3">
          <img
            src={item.preview}
            alt={item.title || "Wallpaper preview"}
            className="h-16 w-16 shrink-0 rounded-lg bg-black/20 object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-accent-white">
              {item.title || "Untitled wallpaper"}
            </p>
            <p className="mt-1 truncate text-xs text-accent-white/45">
              {item.category}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.length ? (
                tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="max-w-full truncate rounded-md bg-accent-white/6 px-2 py-1 text-[10px] text-accent-white/60"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-accent-white/35">
                  No tags added
                </span>
              )}
              {tags.length > 4 && (
                <span className="text-[10px] text-accent-white/40">
                  +{tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-accent-white/10 px-4 py-2.5 text-sm text-accent-white/70 transition active:opacity-70 lg:hover:bg-accent-white/5"
          >
            Keep image
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-2 rounded-xl bg-accent-white px-4 py-2.5 text-sm font-medium text-accent-dark transition active:opacity-80 lg:hover:opacity-90"
          >
            <FaTrashAlt size={12} />
            Remove image
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmRemoveModal;
