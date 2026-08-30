# wwwebart

A minimalist artist portfolio with an integrated, single-owner CMS. Deploy an independent copy to Vercel or run it locally with Docker.

## Deploy your own copy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcesardevgado%2Fwwwebart&project-name=wwwebart&repository-name=wwwebart&env=ADMIN_PASSWORD%2CSESSION_SECRET%2CSTORAGE_DRIVER%2CMAX_UPLOAD_MB&envDescription=Choose+an+admin+password+%2810%2B+characters%29+and+a+random+session+secret+%2832%2B+characters%29.&envDefaults=%7B%22STORAGE_DRIVER%22%3A%22vercel-blob%22%2C%22MAX_UPLOAD_MB%22%3A%2250%22%7D&stores=%5B%7B%22type%22%3A%22blob%22%7D%2C%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22tursocloud%22%2C%22productSlug%22%3A%22turso%22%2C%22protocol%22%3A%22storage%22%7D%5D)

The deployment flow creates:

- A new Git repository in your account, independent of this template.
- A Vercel project for the Next.js application.
- A Turso database for CMS content.
- A public Vercel Blob store for uploaded artwork.

During setup, choose an `ADMIN_PASSWORD` of at least 10 characters and generate a `SESSION_SECRET` of at least 32 random characters. Accept the Turso and Blob storage prompts. Vercel supplies their credentials automatically. The first build creates the database schema and sample portfolio.

After deployment, visit `/admin`, sign in with your admin password, and replace the sample profile and artwork. Changes in the original `wwwebart` repository do not modify your copy, database, uploads, or running deployment.

Vercel installations upload directly from the browser to Blob storage. `MAX_UPLOAD_MB` controls the per-file limit and defaults to 50 MB for local installations and the value selected during deployment for Vercel.

## Local development

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Local development uses a libSQL-compatible SQLite file at `data/portfolio.db` and stores uploads under `data/uploads`. Open `http://localhost:3000/admin` and sign in with `ADMIN_PASSWORD`.

The database and storage drivers are selected through environment variables:

```env
# Local or Docker
DATABASE_PATH=./data/portfolio.db
STORAGE_DRIVER=local
UPLOAD_DIR=./data/uploads

# Vercel
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
STORAGE_DRIVER=vercel-blob
BLOB_READ_WRITE_TOKEN=...
```

## CMS features

- Edit the artist profile, portrait, biography, and ordered links.
- Create, draft, publish, delete, and reorder artworks.
- Present images, videos, external links, sandboxed iframes, and registered interactive components.
- Attach and order multiple media items per artwork.
- Serve uploaded local files through a protected media route or use Vercel Blob URLs in cloud deployments.

Sessions are HMAC-signed, HttpOnly, SameSite=Lax, and Secure in production. Every mutation checks authentication again. There is no public registration or password-reset flow.

## Self-hosting with Docker

Create `.env`, then run:

```bash
docker compose up -d
```

The `portfolio_data` volume persists the SQLite database and uploads. Back up a local installation with `npm run backup`. Cloud deployments should use Turso's backup tools and the Vercel Blob dashboard.

## Development

```bash
npm run lint
npm run build
```

Run `npm run db:generate` after changing `db/schema.ts`. Theme and fallback SEO settings live in `config/site.ts`; content edited through the CMS lives in the configured database.

## License

MIT. The generated sample images are included for use with this template.
