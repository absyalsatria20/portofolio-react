# Project Memory — Portofolio React

Updated: 2026-10-22

## Project Identity

- Project: personal portfolio website Absyal Satria.
- This folder is frontend only.
- Frontend path: `C:/Users/user/Documents/MY PORTOFOLIO 2/portofolio-react`
- Backend path: `C:/Users/user/Documents/MY PORTOFOLIO 2/portofolio-backend`
- Git branch: `main`
- Git remote: `https://github.com/absyalsatria20/portofolio-react.git`
- Frontend sudah deploy di Vercel.
- Vercel terhubung ke repository GitHub frontend.
- Commit/push ke branch deployment akan memicu deploy otomatis dan menerbitkan pembaruan frontend di Vercel.
- Setelah push, verifikasi deployment Vercel jika perubahan perlu diuji di production.
- Do not store secrets, PINs, tokens, or `.env` values in this file.

## Frontend Stack

- React 19.
- Vite 8.
- Tailwind CSS 3.
- Framer Motion.
- Oxlint.
- Phosphor Icons loaded from CDN in `index.html`.
- Google Font Outfit loaded from Google Fonts.
- Build commands:
  - `npm run lint`
  - `npm run build`
- `npm install` has been run successfully.
- Latest verification passed:
  - `npm run lint`
  - `npm run build`
  - `git diff --check`

## Main Frontend Files

- `src/App.jsx`: page shell, fixed Cloudinary background, parallax scroll effect, section composition.
- `src/components/Navbar.jsx`: fixed navigation, active-section detection, responsive navigation.
- `src/components/Hero.jsx`: introduction, profile card, CV link, CTA buttons.
- `src/components/Portfolio.jsx`: project loading, cache, filtering, masonry layout, lazy observer, modal, admin actions, reorder mode.
- `src/components/About.jsx`: graphic design, motion graphic, and software skill sections.
- `src/components/Contact.jsx`: WhatsApp and email contact CTA.
- `src/components/Footer.jsx`: footer.
- `src/components/ScrollToTop.jsx`: scroll-to-top button.
- `src/index.css`: Tailwind setup, font import, base body and scrollbar styles.
- `src/App.css`: mostly leftover Vite/template CSS; not central to current portfolio UI.
- `index.html`: Indonesian document, title, favicon, fonts, Phosphor Icons, `noindex,nofollow`.

## Backend and Data Architecture

- Laravel 12 backend runs on Vercel.
- Aiven MySQL stores project metadata.
- Cloudinary stores image and video media.
- Frontend uploads media directly to Cloudinary.
- Laravel stores only Cloudinary URL and project metadata.
- Frontend reads project metadata from Laravel API.
- Browser loads media directly from Cloudinary.

Flow:

`React → Cloudinary` for direct media upload.

`React → Laravel on Vercel → Aiven MySQL` for metadata CRUD.

`React → Laravel on Vercel → Cloudinary URLs` for project list metadata.

## API Contract

Configured through `VITE_API_URL`.

- `GET /projects`: returns projects ordered by `sort_order`.
- `POST /projects`: adds project; requires backend `ADMIN_PIN` through `secret_pin` payload.
- `DELETE /projects/{id}`: deletes project metadata; requires `secret_pin`.
- `POST /projects/reorder`: updates project ordering; requires `secret_pin`.

Project fields:

- `id`
- `sort_order`
- `type`: `image` or `video`
- `category`: `graphic` or `motion`
- `src`: Cloudinary URL
- `thumbTime`: optional video frame time
- timestamps

## Current Portfolio Behavior

- Portfolio data is loaded in `src/components/Portfolio.jsx`.
- `useInViewOnce('300px')` mounts card media when card approaches viewport.
- Image card media no longer uses native `loading="lazy"`; this was removed because it added a second lazy-loading layer after the custom `IntersectionObserver`.
- Image cards use `decoding="async"`.
- Video cards currently still use `<video preload="metadata">` with `#t=` fragment as thumbnails.
- Modal preview renders full image or video after card selection.
- Desktop layout uses 3 columns.
- Mobile layout uses 2 columns.
- Project filters: `graphic`, `motion`, `all`.
- Admin mode supports add, delete, and reorder.

## Implemented Refresh Cache

Commit:

`625d231 perf: cache portfolio projects on refresh`

Behavior:

- Cache key: `portfolio-projects-cache`.
- `localStorage` stores project metadata JSON.
- Cached projects render immediately after refresh.
- API fetch continues in background.
- Successful API response replaces UI data and updates localStorage.
- API failure does not remove valid cached data.
- Invalid/non-2xx API responses are treated as errors.
- Cache stores metadata and URLs only; it does not store image or video files.

Important limitation:

- Media still loads from Cloudinary after refresh.
- Metadata cache fixes API wait, not media download time.

## Latest Code Change

Commit:

`0293358 perf: avoid delayed portfolio image loading`

Change:

- Removed native `loading="lazy"` from portfolio image cards.
- Custom `IntersectionObserver` remains active.
- Mobile testing showed images appear normally after this change.
- Desktop can still appear slower; this may be media size, Cloudinary delivery, browser cache, deployment cache, or video behavior.

## Current Known Issues

1. Video thumbnails can appear white/black or load slowly.
   - Current cards load actual `.mp4` files with `preload="metadata"`.
   - `#t=` is not a real thumbnail file; browser still processes the video.
   - This can create many metadata requests and unstable visual loading while scrolling.

2. Desktop media may appear slower than mobile.
   - Need Network profiling before changing more code.
   - Separate API timing, image download timing, and video metadata timing.

3. `window.location.reload()` remains after delete and after add-project callback.
   - It is not part of current refresh-cache improvement scope.
   - If changed later, cache must be updated explicitly after CRUD operations.

4. Some `About.jsx` references use missing-looking paths:
   - `ASSET/design_h8dmhj.jpg`
   - `ASSET/MOTION_2_dzjlye.png`
   Verify before changing.

5. Backend production configuration has risks reviewed earlier:
   - `APP_DEBUG=true` in backend `vercel.json`.
   - Backend uses PIN protection rather than Sanctum for project write operations.
   Do not change from frontend without explicit request.

## Deferred Video Plan

Plan file:

`VIDEO-THUMBNAIL-OPTIMIZATION-PLAN.md`

Do not execute without explicit user instruction.

Recommended approach:

1. Build Cloudinary poster URL from video URL and `thumbTime`.
2. Use poster `<img>` for video cards.
3. Use poster `<img>` for video thumbnails in edit layout.
4. Keep full `<video>` only in modal preview.
5. Test Cloudinary URL transformation against existing video URLs first.
6. Add fallback if a poster URL cannot be generated.
7. Run lint/build and test first visit, refresh, scroll, filters, modal, and edit layout.

Alternative lower-impact approach:

- Add `poster` to existing `<video>` while retaining `preload="metadata"`.
- Less effective because browser still requests video metadata.

## Backup

Local backup exists and was intentionally not committed:

`src/components/Portfolio.jsx.backup-before-cache`

It represents `Portfolio.jsx` before the localStorage cache change.

Backup hash at creation:

`8e0378f8afe6dca10a4380353932b137102016d89b0812f5f88bc680340d2c3f`

Rollback command if needed:

```bash
cp src/components/Portfolio.jsx.backup-before-cache src/components/Portfolio.jsx
```

Do not delete or commit backup without user instruction.

## Git and Change Rules

- User wants planning before execution.
- User wants explicit permission before code or database changes.
- Do not modify backend, database, Cloudinary, or frontend code while only reviewing/planning.
- User prefers concise Indonesian explanations.
- Before execution, explain proposed change and wait for permission when request is ambiguous.
- Do not commit or push unless user explicitly requests it.
- Do not include `.env`, PIN, credentials, or tokens in commits or documentation.
- After code changes, run relevant lint/build checks.
- Report what changed, what was verified, and what remains.
- Preserve subtle, smooth animations; avoid aggressive blinking or distracting motion.

## Commit History Relevant to Current Work

- `0293358 perf: avoid delayed portfolio image loading`
- `625d231 perf: cache portfolio projects on refresh`
- `226e087 Update Resume IPK`
- `62f4ed2 update resume`
- `7385eff api env master`

## Current Repository State

At last check:

- `main` was pushed to `origin/main` at `0293358`.
- Backup file remains untracked locally.
- `PROJECT_MEMORY.md` and `VIDEO-THUMBNAIL-OPTIMIZATION-PLAN.md` are local documentation files unless separately committed.
