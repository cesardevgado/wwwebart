# Open Catalog

An open-source artist portfolio with a deliberately small, self-hosted control panel. The public site remains an artwork-first digital exhibition catalog; `/admin` manages only the artist profile, links, artwork records, publication state, ordering, and media.

## Local setup

```bash
cp .env.example .env
npm install
npm run db:generate   # only when changing db/schema.ts
npm run db:migrate
npm run db:seed
npm run dev
```

Set `ADMIN_PASSWORD` to at least 10 characters and `SESSION_SECRET` to at least 32 random characters before seeding. `db:seed` hashes the password with bcrypt; plaintext passwords and hashes are never sent to the browser. Changing `ADMIN_PASSWORD` followed by `npm run db:seed` replaces the owner password.

Open `http://localhost:3000/admin`, sign in with `ADMIN_PASSWORD`, and use:

- **Profile** to edit the artist name, tagline, plain-text biography, portrait, and ordered social/contact links.
- **Artworks** to add, edit, delete, reorder, draft, or publish work.
- **Log out** to invalidate the HttpOnly session cookie.

Sessions are HMAC-signed, HttpOnly, SameSite=Lax, and Secure in production. Every mutation repeats the authorization check. There is no registration or password-reset flow.

## Artwork publishing

New artworks default to **Draft**. Draft routes return 404 and drafts do not appear in the public archive or sitemap. Change Status to **Published** and save to make the work public immediately.

The artwork list supports pointer drag-and-drop and accessible up/down buttons. Its saved order directly controls the public catalog; year does not override the curator's sequence. Deletion requires a second confirmation and removes locally uploaded media with the record.

Supported media:

- **Image:** JPG, PNG, WebP, GIF, or AVIF upload/URL, plus alternative text.
- **Video:** MP4 or WebM upload/URL with autoplay, muted, loop, and controls options.
- **Interactive:** a sandboxed external URL or developer-registered component key.
- **External:** a link to work presented on another site.

On the edit page, **Primary Media** is displayed first at the top of the public artwork page. Use **Additional Media** to attach more images, videos, and sandboxed iframe URLs to the same work. Drag these items—or use their up/down buttons—to control the single-column order shown after the primary media.

Uploads are MIME- and extension-validated, size-limited, randomly renamed, stored outside `public`, and served through `/media/[key]` with content-type protection. Configure the limit with `MAX_UPLOAD_MB`.

To register a trusted interactive component, add its key to `lib/interactive-registry.ts` and map its rendering in `components/ArtworkViewer.tsx`. Database JavaScript is never evaluated.

## Data, storage, and backups

By default editable state lives in:

```text
data/portfolio.db
data/uploads/
```

Back up both with `npm run backup`. This creates a timestamped copy under `backups/`. Test restoring backups periodically. `lib/storage/types.ts` defines the storage adapter contract; `LocalStorageAdapter` is the included implementation and can later be replaced with S3 or R2.

## Production and self-hosting

For a regular Node host or VPS:

```bash
npm run db:migrate
npm run db:seed
npm run build
npm start
```

Keep the database and uploads on a persistent disk. A reverse proxy should provide HTTPS, which activates Secure session cookies.

Docker is included. Create `.env`, then run `docker compose up -d`. The `portfolio_data` volume persists `/data`.

Serverless hosts such as Vercel generally do not offer persistent writable filesystems. For those environments, replace local SQLite with a persistent compatible database and implement the same storage interface using R2/S3-compatible object storage. No Vercel-specific API is required.

## Development

Use `npm run lint` and `npm run build`. Theme colors, font, navigation height, canonical URL, and fallback SEO text remain in `config/site.ts`. The CMS-managed database is the primary content source; old MDX examples are retained only as developer reference.

## License

MIT. The generated sample images are included for use with this template.
