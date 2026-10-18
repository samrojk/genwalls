import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaCloudUploadAlt, FaImage, FaLayerGroup } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import WallpaperQueueItem from "../components/WallpaperQueueItem";
import ConfirmRemoveModal from "../components/ConfirmRemoveModal";

const inputClass =
  "w-full rounded-xl border border-accent-white/10 bg-accent-white/[0.03] px-4 py-3 text-sm text-accent-white outline-none transition focus:border-accent-white/30 placeholder:text-accent-white/30";

const labelClass = "mb-2 block text-sm font-medium text-accent-white/80";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const getTitleFromFilename = (filename) =>
  filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const createQueueItem = (file, category) => ({
  key: `${file.name}-${file.size}-${file.lastModified}-${
    globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
  }`,
  file,
  preview: URL.createObjectURL(file),
  title: getTitleFromFilename(file.name),
  category,
  tagsInput: "",
  createdAt: today(),
  trending: false,
  featured: false,
});

const getFunctionErrorMessage = async (error) => {
  let message = error?.message || "The upload request failed.";

  try {
    const payload = await error?.context?.clone?.().json();
    if (payload?.error) message = payload.error;
    else if (payload?.message) message = payload.message;
  } catch {
    // The response may not contain JSON; use the original error message.
  }

  if (message.toLowerCase().includes("failed to send a request")) {
    return "Could not reach the upload function. Check your internet connection and that the function is deployed.";
  }

  return message;
};

const Upload = () => {
  const categories = useMemo(
    () => [
      "Abstract",
      "Aesthetic",
      "Anime",
      "Cars",
      "Fictional",
      "Gaming",
      "Nature",
      "Space",
    ],
    [],
  );

  const fileInputRef = useRef(null);
  const previewUrlsRef = useRef(new Set());

  const [queue, setQueue] = useState([]);
  const [defaultCategory, setDefaultCategory] = useState(categories[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    completed: 0,
    total: 0,
  });

  const selectedCategory = useCustomCategory
    ? customCategory.trim()
    : defaultCategory;

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
    };
  }, []);

  const addFiles = (fileList) => {
    if (isUploading) return;

    const selectedFiles = Array.from(fileList || []);
    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) &&
        file.size > 0 &&
        file.size <= MAX_FILE_SIZE,
    );
    const invalidCount = selectedFiles.length - validFiles.length;

    if (invalidCount) {
      setStatus(
        `${invalidCount} file(s) skipped. Use JPG, PNG, WebP, or AVIF images under 10 MB each.`,
      );
    } else {
      setStatus("");
    }

    if (!validFiles.length) return;

    setQueue((current) => {
      const existing = new Set(
        current.map(
          (item) =>
            `${item.file.name}-${item.file.size}-${item.file.lastModified}`,
        ),
      );

      const additions = validFiles
        .filter(
          (file) =>
            !existing.has(`${file.name}-${file.size}-${file.lastModified}`),
        )
        .map((file) => {
          const item = createQueueItem(file, selectedCategory || categories[0]);
          previewUrlsRef.current.add(item.preview);
          return item;
        });

      if (!additions.length) {
        setStatus("Those images are already in the upload queue.");
        return current;
      }

      return [...current, ...additions];
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmRemoval = () => {
    if (!pendingRemoval || isUploading) return;

    URL.revokeObjectURL(pendingRemoval.preview);
    previewUrlsRef.current.delete(pendingRemoval.preview);

    setQueue((current) =>
      current.filter((item) => item.key !== pendingRemoval.key),
    );
    setPendingRemoval(null);
    setStatus("");
  };

  const updateItem = (key, updates) => {
    if (isUploading) return;

    setQueue((current) =>
      current.map((item) =>
        item.key === key ? { ...item, ...updates } : item,
      ),
    );
  };

  const groupedQueue = useMemo(() => {
    const groups = new Map();

    [...queue]
      .sort((a, b) => a.category.localeCompare(b.category))
      .forEach((item) => {
        if (!groups.has(item.category)) groups.set(item.category, []);
        groups.get(item.category).push(item);
      });

    return [...groups.entries()];
  }, [queue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isUploading) return;

    if (!queue.length) {
      setStatus("Add at least one image to the upload queue.");
      return;
    }

    const incomplete = queue.some(
      (item) => !item.title.trim() || !item.category.trim() || !item.createdAt,
    );

    if (incomplete) {
      setStatus("Please add a title, category, and date for every image.");
      return;
    }

    const unsupported = queue.find(
      (item) =>
        !ALLOWED_TYPES.includes(item.file.type) ||
        item.file.size === 0 ||
        item.file.size > MAX_FILE_SIZE,
    );

    if (unsupported) {
      setStatus(
        `“${unsupported.file.name}” is not supported or exceeds the 10 MB limit.`,
      );
      return;
    }

    const itemsToUpload = [...queue];
    const failures = [];
    let successes = 0;

    setIsUploading(true);
    setUploadProgress({ completed: 0, total: itemsToUpload.length });
    setStatus(`Starting upload of ${itemsToUpload.length} wallpaper(s)…`);

    try {
      for (let index = 0; index < itemsToUpload.length; index += 1) {
        const item = itemsToUpload[index];
        setStatus(
          `Uploading ${index + 1} of ${itemsToUpload.length}: ${item.title}`,
        );

        const tags = [
          ...new Set(
            item.tagsInput
              .split(",")
              .map((tag) => tag.trim().toLowerCase())
              .filter(Boolean),
          ),
        ];

        const metadata = {
          slug: createSlug(item.title),
          title: item.title.trim(),
          category: item.category.trim(),
          tags,
          trending: item.trending,
          featured: item.featured,
          createdAt: item.createdAt,
        };

        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("metadata", JSON.stringify(metadata));

        const { data, error } = await supabase.functions.invoke(
          "upload-wallpaper",
          { body: formData },
        );

        if (error) {
          failures.push({
            title: item.title,
            message: await getFunctionErrorMessage(error),
          });
        } else if (!data?.success || !data?.wallpaper?.image) {
          failures.push({
            title: item.title,
            message:
              data?.error || "The server returned an unexpected response.",
          });
        } else {
          successes += 1;

          URL.revokeObjectURL(item.preview);
          previewUrlsRef.current.delete(item.preview);
          setQueue((current) =>
            current.filter((queued) => queued.key !== item.key),
          );
        }

        setUploadProgress({
          completed: index + 1,
          total: itemsToUpload.length,
        });
      }

      if (failures.length === 0) {
        setStatus(
          `Successfully uploaded ${successes} wallpaper${
            successes === 1 ? "" : "s"
          } to Cloudinary and saved ${
            successes === 1 ? "its record" : "their records"
          } in Supabase.`,
        );
      } else {
        const firstFailure = failures[0];
        setStatus(
          `${successes} uploaded, ${failures.length} failed. First error for “${firstFailure.title}”: ${firstFailure.message}. Failed items remain in the queue so you can retry.`,
        );
      }
    } catch (error) {
      setStatus(
        `Upload stopped unexpectedly: ${
          error?.message || "Unknown error"
        }. Any failed items still in the queue can be retried.`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent-white/40">
            GenWalls / Admin
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-accent-white sm:text-3xl">
            Wallpaper studio
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-accent-white/50">
            Add wallpapers, organize your collection, and publish them to your
            library.
          </p>
        </div>

        <Link
          to="/"
          className="shrink-0 rounded-xl border border-accent-white/10 px-3 py-2 text-sm text-accent-white/70 transition active:opacity-70 lg:hover:bg-accent-white/5 lg:hover:text-accent-white"
        >
          Back to site
        </Link>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-accent-white/10 bg-accent-white/[0.02] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-white/10 bg-accent-white/[0.04]">
                <FaCloudUploadAlt className="text-lg text-accent-white/70" />
              </div>
              <div>
                <h2 className="font-medium text-accent-white">
                  Add wallpapers
                </h2>
                <p className="mt-1 text-xs text-accent-white/40">
                  Select multiple images or drag them below
                </p>
              </div>
            </div>

            <label className={labelClass} htmlFor="defaultCategory">
              Default category for new images
            </label>
            <select
              id="defaultCategory"
              disabled={isUploading}
              value={useCustomCategory ? "__new__" : defaultCategory}
              onChange={(event) => {
                if (event.target.value === "__new__") {
                  setUseCustomCategory(true);
                } else {
                  setUseCustomCategory(false);
                  setDefaultCategory(event.target.value);
                }
              }}
              className={inputClass}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-[#131314]"
                >
                  {category}
                </option>
              ))}
              <option value="__new__" className="bg-[#131314]">
                + New category
              </option>
            </select>

            {useCustomCategory && (
              <input
                value={customCategory}
                disabled={isUploading}
                onChange={(event) => setCustomCategory(event.target.value)}
                placeholder="Enter new category"
                aria-label="New category name"
                className={`${inputClass} mt-3`}
              />
            )}

            <div
              onDragEnter={(event) => {
                event.preventDefault();
                if (!isUploading) setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                if (!isUploading) setIsDragging(true);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setIsDragging(false);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                addFiles(event.dataTransfer.files);
              }}
              className={`mt-5 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-accent-white/60 bg-accent-white/[0.08]"
                  : "border-accent-white/15 bg-accent-white/[0.02] hover:border-accent-white/30"
              } ${isUploading ? "opacity-50" : ""}`}
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border transition ${
                  isDragging
                    ? "border-accent-white/30 bg-accent-white/10"
                    : "border-accent-white/10 bg-accent-white/[0.04]"
                }`}
              >
                <FaCloudUploadAlt className="text-2xl text-accent-white/70" />
              </div>
              <p className="text-sm font-medium text-accent-white">
                {isDragging
                  ? "Drop your wallpapers here"
                  : "Drag and drop wallpapers"}
              </p>
              <p className="mt-2 max-w-xs text-xs leading-5 text-accent-white/40">
                JPG, PNG, WebP, or AVIF. Maximum 10 MB per image.
              </p>

              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 rounded-xl border border-accent-white/10 bg-accent-white/[0.04] px-4 py-2.5 text-xs font-medium text-accent-white/80 transition disabled:opacity-40 active:opacity-70 lg:hover:bg-accent-white/[0.08]"
              >
                Browse files
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
                multiple
                disabled={isUploading}
                onChange={(event) => addFiles(event.target.files)}
                className="hidden"
              />
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-accent-white/40">
              <FaImage className="mt-0.5 shrink-0" />
              <p>
                Images are previewed locally until uploaded. Successful uploads
                are removed from this queue automatically.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-accent-white/10 bg-accent-white/[0.02] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-white/10 bg-accent-white/[0.04]">
                <FaLayerGroup className="text-accent-white/70" />
              </div>
              <div>
                <h2 className="font-medium text-accent-white">
                  Upload workflow
                </h2>
                <p className="mt-1 text-xs text-accent-white/40">
                  Images are processed one at a time
                </p>
              </div>
            </div>

            <ol className="space-y-3">
              {[
                ["01", "Add images", "Select one or more wallpapers."],
                [
                  "02",
                  "Review details",
                  "Set titles, categories, tags, and flags.",
                ],
                [
                  "03",
                  "Upload",
                  "Store images in Cloudinary and records in Supabase.",
                ],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-white/[0.05] text-[10px] font-semibold text-accent-white/50">
                    {number}
                  </span>
                  <div>
                    <p className="text-sm text-accent-white/80">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-accent-white/40">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-accent-white/10 bg-accent-white/[0.02] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-white/10 bg-accent-white/[0.04]">
                  <FaImage className="text-accent-white/70" />
                </div>
                <div>
                  <h2 className="font-medium text-accent-white">
                    Ready to upload
                  </h2>
                  <p className="mt-1 text-xs text-accent-white/40">
                    Review each wallpaper before sending
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-lg border border-accent-white/10 bg-accent-white/[0.04] px-2.5 py-1.5 text-xs tabular-nums text-accent-white/70">
                {queue.length} {queue.length === 1 ? "image" : "images"}
              </span>
            </div>

            {queue.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-accent-white/10 bg-black/10 px-5 py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-white/[0.04]">
                  <FaImage className="text-lg text-accent-white/35" />
                </div>
                <p className="text-sm font-medium text-accent-white/70">
                  Your queue is empty
                </p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-accent-white/40">
                  Add images using the picker to see previews and edit their
                  details here.
                </p>
              </div>
            ) : (
              <div
                className={`max-h-[min(68vh,760px)] space-y-6 overflow-y-auto pr-1 ${
                  isUploading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {groupedQueue.map(([category, items]) => (
                  <div key={category}>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-white/60">
                        {category}
                      </h3>
                      <span className="text-xs tabular-nums text-accent-white/35">
                        {items.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <WallpaperQueueItem
                          key={item.key}
                          item={item}
                          categories={categories}
                          onChange={updateItem}
                          onRemove={() => setPendingRemoval(item)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {isUploading && (
            <section
              className="rounded-xl border border-accent-white/10 bg-accent-white/[0.03] p-4"
              aria-live="polite"
            >
              <div className="mb-2 flex items-center justify-between text-xs text-accent-white/60">
                <span>Upload progress</span>
                <span>
                  {uploadProgress.completed} / {uploadProgress.total}
                </span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-accent-white/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={uploadProgress.total}
                aria-valuenow={uploadProgress.completed}
              >
                <div
                  className="h-full rounded-full bg-accent-white transition-all"
                  style={{
                    width: `${
                      uploadProgress.total
                        ? (uploadProgress.completed / uploadProgress.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </section>
          )}

          {status && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-xl border border-accent-white/10 bg-accent-white/[0.03] p-4 text-sm leading-6 text-accent-white/70"
            >
              {status}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              disabled={queue.length === 0 || isUploading}
              className="w-full rounded-xl bg-accent-white px-5 py-3.5 text-sm font-semibold text-accent-dark transition disabled:cursor-not-allowed disabled:opacity-40 active:opacity-80 lg:hover:opacity-90"
            >
              {isUploading
                ? "Uploading…"
                : `Upload ${queue.length || ""} wallpaper${
                    queue.length === 1 ? "" : "s"
                  }`}
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-accent-white/35">
              Each successful upload saves its Cloudinary URL and metadata in
              Supabase.
            </p>
          </form>
        </aside>
      </div>

      <ConfirmRemoveModal
        item={pendingRemoval}
        onCancel={() => setPendingRemoval(null)}
        onConfirm={confirmRemoval}
      />
    </div>
  );
};

export default Upload;
