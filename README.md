# GenWalls

### Discover your next wallpaper.

GenWalls is a minimal, AI-generated wallpaper discovery platform built to make finding, exploring, and downloading high-quality wallpapers simple. Browse curated collections, explore categories, search by tags, and download wallpapers directly from a clean, responsive interface.

**Live Website:** https://genwalls.pages.dev

---

## ✨ Features

- **Wallpaper Discovery** — Explore a growing collection of AI-generated wallpapers.
- **Trending Collection** — Discover wallpapers marked as trending.
- **Featured Wallpapers** — Browse hand-picked selections.
- **Latest Releases** — Find recently published wallpapers.
- **Category Browsing** — Explore wallpapers across Anime, Cars, Aesthetic, Gaming, Abstract, Fictional, Nature, Space, and other available categories.
- **Search System** — Find wallpapers by title, category, and tags.
- **Wallpaper Detail Pages** — View full-resolution images, image dimensions, categories, and tags.
- **Related Recommendations** — Discover similar wallpapers based on shared tags and categories.
- **Direct Downloads** — Download wallpapers through Cloudinary's image delivery system.
- **Admin Authentication** — Protect the wallpaper upload interface with Supabase Authentication and an authorized admin account.
- **Multi-Image Upload Workflow** — Select multiple images, manage an upload queue, edit metadata, and upload wallpapers through a single interface.
- **Cloud-Based Image Storage** — Store and deliver optimized image assets through Cloudinary.
- **Database-Driven Content** — Store wallpaper metadata in Supabase so published uploads can appear across the website without manually updating a local JSON file.
- **Responsive Interface** — Designed for desktop and mobile screens.
- **Minimal UI** — Prioritizes fast discovery, straightforward navigation, and fewer unnecessary interactions.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production build tooling |
| Tailwind CSS v4 | Utility-first styling and responsive layouts |
| React Router | Client-side routing and dynamic wallpaper pages |
| React Icons | Interface icons |
| Supabase | PostgreSQL database and authentication |
| Supabase Edge Functions | Server-side upload processing and authorization |
| Cloudinary | Image storage, delivery, and download handling |
| Git & GitHub | Source control and repository management |
| Cloudflare Pages | Website hosting and deployment |

---

## 🏗️ Architecture Overview

GenWalls separates the frontend, structured content, authentication, and image storage into distinct services.

### Frontend

The React application renders the homepage, category pages, search results, collections, and individual wallpaper pages. React Router handles navigation, while Tailwind CSS provides the responsive interface.

### Database — Supabase

PostgreSQL stores wallpaper metadata, including:

- Unique slug and title
- Category and tags
- Cloudinary image URL
- Trending and featured flags
- Publication status
- Creation date and timestamp

Published wallpapers are retrieved through Supabase queries. Row Level Security (RLS) restricts public database reads to published records, while public database writes are not enabled.

### Image Storage — Cloudinary

Cloudinary stores uploaded wallpaper files and provides their delivery URLs. Images are uploaded to category-organized folders, keeping image assets separate from the database records that describe them.

### Secure Upload Pipeline

The admin upload workflow uses a Supabase Edge Function to process wallpaper uploads.

1. The admin authenticates with Supabase.
2. The Edge Function validates the user's identity against the configured admin user ID.
3. The function validates the uploaded image and its metadata.
4. A server-side signature is generated for the Cloudinary upload.
5. The image is uploaded to Cloudinary.
6. The resulting image URL and metadata are saved to Supabase.

Cloudinary API credentials and the database service-role credential remain server-side rather than being exposed in the public frontend.

### Content Flow

```text
Admin Upload Interface
        |
        v
Supabase Authentication
        |
        v
Supabase Edge Function
        |
        v
Cloudinary Image Storage
        |
        v
Supabase PostgreSQL
        |
        v
Public React Website
        |
        v
Discover, Explore & Download
```

---

## 🗂️ Core Data Model

The `wallpapers` table represents each published wallpaper as a structured record.

| Field | Description |
|---|---|
| `id` | Unique database identifier |
| `slug` | URL-friendly identifier for detail pages |
| `title` | Wallpaper title |
| `category` | Wallpaper category |
| `tags` | Searchable keywords |
| `image` | Cloudinary delivery URL |
| `trending` | Whether the wallpaper belongs to the trending collection |
| `featured` | Whether the wallpaper belongs to the featured collection |
| `published` | Controls public visibility |
| `createdAt` | Publication date |
| `created_at` | Database creation timestamp |

This structure allows collection pages, search, category browsing, and related recommendations to operate on shared content records.

---

## 🔐 Security & Data Handling

- Supabase Authentication protects access to the admin upload interface.
- The Edge Function independently validates the authenticated user against the configured admin ID.
- Cloudinary upload signatures are generated server-side.
- API secrets and the Supabase service-role key are kept out of client-side code.
- Row Level Security limits anonymous and authenticated database reads to published wallpapers.
- Wallpaper records are inserted through the trusted server-side upload pipeline rather than an unrestricted public write policy.

---

## 🎯 Product Principles

GenWalls is built around a few straightforward principles:

- **Discoverability first** — Make it easy to find the right wallpaper.
- **Minimal by design** — Avoid unnecessary UI, clutter, and friction.
- **Content over complexity** — Keep the experience centered on wallpapers rather than dashboards or extra features.
- **Structured content management** — Keep image files and searchable metadata organized separately.
- **Responsive by default** — Make the experience usable across screen sizes.

---

## 🚀 Future Improvements

Potential areas for further development include:

- Server-side search and pagination for larger collections.
- More advanced image optimization and responsive image delivery.
- Download analytics and popular-wallpaper rankings.
- Automated image moderation and metadata validation.
- Additional filtering by aspect ratio, resolution, and visual style.

---

## 📄 License

Coming soon...

---

**Built with React, Supabase, and Cloudinary.**
