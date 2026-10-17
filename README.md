# FreeWay - AI-assisted car rental dashboard

FreeWay is a full-stack car rental web app built as a Full Stack course final project.
Customers browse a fleet (Compact / SUV / Premium), book vehicles, pay (demo) and manage bookings,
and get help from an **AI assistant powered by Google Gemini** that knows the fleet and the customer's
own booking history. Admins manage vehicles, all bookings and users.

> A full code walkthrough in Hebrew is in [`הסבר_קוד.md`](./הסבר_קוד.md).

## Features

- **Auth**: register / login with JWT, passwords hashed with bcrypt, roles `user` and `admin`.
- **Vehicles**: catalog with filters (category, transmission, seats, price, search), details page. Admin CRUD.
- **Bookings**: create with live price calculation, date-overlap check, edit / cancel / pay (demo). Admin sees and manages all.
- **Dashboard** (follows the UI reference): stat tiles (bookings this month, availability %, CO2 saved), AI panel with quick actions, pickup map card, next booking card, payment card, recommended vehicles, promo card.
- **AI (server-side only, Gemini)**:
  - **Chat assistant** (`/api/ai/chat`, `/api/ai/chat/stream`) - structured system prompt that receives the user's bookings and the available fleet **from the DB**; answers stream to the browser (SSE). Conversations and messages are **saved in the DB**.
  - **Recommended for you** (`/api/ai/recommendations`) - Gemini **structured JSON output** (vehicle ids + reasons + score) based on booking history; ids are validated and the result is **saved in the DB**.
  - Rate limiting (10 AI requests / minute / user), 20s timeout (AbortController), clear HTTP errors (429 / 502 / 503 / 504).
- Loading, error and empty states on every page; client-side and server-side validation with clear messages; responsive (bottom navigation on mobile).

## Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19 + Vite, React Router 7, Context API, plain CSS, lucide-react icons |
| Backend | Node.js + Express 5, express-validator, helmet, cors, express-rate-limit |
| Database | PostgreSQL (`pg`, plain SQL in `schema.sql`) |
| Auth | JWT (`jsonwebtoken`) + `bcrypt` |
| AI | Google Gemini via `@google/genai` (default model `gemini-3.8-flash`) |
| Deploy | Frontend on Vercel, backend + PostgreSQL on Railway |

## Project structure

```
Freeway/
├── README.md
├── הסבר_קוד.md                # Hebrew explanation of all the code
├── docs/                      # UI reference + screenshots
├── backend/
│   ├── server.js              # entry point
│   ├── railway.json, Procfile # Railway deploy config
│   ├── .env.example
│   └── src/
│       ├── app.js             # Express app: middleware + routes
│       ├── config/            # env.js, db.js
│       ├── middleware/        # auth.js, validate.js, rateLimit.js, errorHandler.js
│       ├── routes/            # one file per feature: auth, users, vehicles, bookings, stats, ai, health
│       ├── controllers/       # one file per feature
│       ├── services/          # business logic + SQL (incl. gemini.service.js, aiChat, aiRecommendations, aiContext)
│       ├── ai/prompts.js      # Gemini system prompts + JSON schema
│       ├── db/                # schema.sql, migrate.js, seed.js
│       └── utils/             # AppError.js, dates.js
└── frontend/
    ├── index.html             # SEO meta tags
    ├── vercel.json            # SPA rewrites
    ├── .env.example
    ├── public/cars/*.svg      # vehicle illustrations
    └── src/
        ├── main.jsx, App.jsx  # entry + routes
        ├── api/               # one file per feature (client, auth, vehicles, bookings, stats, users, ai)
        ├── context/           # AuthContext.jsx
        ├── hooks/             # useFetch.js
        ├── components/        # layout, routing, ui, dashboard, vehicles, bookings, ai, admin
        ├── pages/             # one file per page
        ├── utils/             # validation, format, pickup locations
        └── styles/            # base, layout, components, dashboard, pages
```

## Pages

| Route | Page | Access |
| --- | --- | --- |
| `/login`, `/register` | Login / Register | public |
| `/` | Dashboard | user |
| `/vehicles` | Vehicle catalog + filters | user |
| `/vehicles/:id` | Vehicle details + booking form | user |
| `/bookings` | My bookings (pay / edit / cancel) | user |
| `/assistant` | AI chat (streaming, saved conversations) | user |
| `/profile` | Profile + settings | user |
| `/admin` | Manage vehicles, bookings, users | admin |

## Run locally

Requirements: Node.js 20+, PostgreSQL 14+ (local install or a Railway database), a Gemini API key from
[Google AI Studio](https://aistudio.google.com/app/apikey) (the app runs without it; AI routes return a clear 503).

```bash
# 1. Create a database
createdb freeway

# 2. Backend
cd backend
cp .env.example .env          # fill DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
npm install
npm run db:setup              # creates tables + seed data (db:migrate + db:seed)
npm run dev                   # http://localhost:4000/api/health

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env          # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                   # http://localhost:5173
```

The server does not print logs to the console (course requirement). Check that it is up with
`GET http://localhost:4000/api/health` - it reports the database and AI status.

### Test users (created by `npm run db:seed`)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@freeway.com` | `Admin123!` |
| User | `user@freeway.com` | `User123!` |

`db:seed` clears all tables and inserts 2 users, 10 vehicles and 4 sample bookings for the regular user.

## Environment variables

**backend/.env** (see `backend/.env.example`)

| Name | Description |
| --- | --- |
| `PORT` | API port (Railway sets it automatically) |
| `NODE_ENV` | `development` / `production` |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma separated |
| `DATABASE_URL` | PostgreSQL connection string |
| `DB_SSL` | `true` when the DB needs SSL (Railway public URL) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | JWT signing secret and lifetime |
| `GEMINI_API_KEY` | Google Gemini key - **server only, never commit it** |
| `GEMINI_MODEL` | Default `gemini-3.8-flash` |
| `AI_TIMEOUT_MS` | Gemini timeout, default 20000 |

**frontend/.env**: `VITE_API_URL` - the backend URL ending with `/api`.

## API overview

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | public | Server / DB / AI status |
| POST | `/api/auth/register` | public | Create account (role user) |
| POST | `/api/auth/login` | public | Login, returns JWT |
| GET | `/api/auth/me` | user | Current user |
| PATCH | `/api/users/me` | user | Update name / password |
| GET | `/api/users` | admin | List users |
| PATCH | `/api/users/:id/role` | admin | Change role |
| DELETE | `/api/users/:id` | admin | Delete user |
| GET | `/api/vehicles` | public | List + filters (`category, transmission, minSeats, maxPrice, available, search`) |
| GET | `/api/vehicles/:id` | public | Vehicle details |
| POST / PUT / DELETE | `/api/vehicles[/:id]` | admin | Vehicle CRUD |
| GET | `/api/bookings` | user | My bookings |
| GET | `/api/bookings/all` | admin | All bookings |
| GET | `/api/bookings/:id` | owner/admin | One booking |
| POST | `/api/bookings` | user | Create booking |
| PUT | `/api/bookings/:id` | owner | Edit pending booking |
| PATCH | `/api/bookings/:id/cancel` | owner/admin | Cancel |
| PATCH | `/api/bookings/:id/pay` | owner | Demo payment -> confirmed |
| PATCH | `/api/bookings/:id/status` | admin | Set status |
| DELETE | `/api/bookings/:id` | admin | Delete booking |
| GET | `/api/stats/me` | user | Dashboard tiles |
| GET | `/api/stats/admin` | admin | Admin totals |
| POST | `/api/ai/chat` | user, rate limited | Chat (full answer) |
| POST | `/api/ai/chat/stream` | user, rate limited | Chat (Server-Sent Events) |
| GET | `/api/ai/conversations` | user | Saved conversations |
| GET | `/api/ai/conversations/:id/messages` | owner | Messages |
| DELETE | `/api/ai/conversations/:id` | owner | Delete conversation |
| GET | `/api/ai/recommendations` | user | Saved AI picks |
| POST | `/api/ai/recommendations` | user, rate limited | Generate new AI picks (structured JSON) |

Errors always look like `{ "error": { "message": "...", "details": [{ "field", "message" }] } }`.

## Deployment

### 1. Database + backend on Railway

1. Push the repo to GitHub.
2. In [Railway](https://railway.com) create a project -> **Add PostgreSQL**.
3. **New service -> GitHub repo**, set **Root Directory** to `backend`.
   `backend/railway.json` sets the start command (`npm run db:migrate && npm start`) and health check `/api/health`.
4. Service **Variables**:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (reference to the Postgres service)
   - `NODE_ENV=production`, `JWT_SECRET=<long random string>`, `GEMINI_API_KEY=<your key>`
   - `CORS_ORIGIN=https://<your-app>.vercel.app` (fill after step 2)
   - `DB_SSL=false` with the private `DATABASE_URL`; use `true` if you connect via the public proxy URL.
5. Settings -> Networking -> **Generate Domain**. Check `https://<backend>.up.railway.app/api/health`.
6. Seed once (from your computer): `cd backend && DATABASE_URL="<Railway public URL>" DB_SSL=true npm run db:seed`
   (or `railway run npm run db:seed` with the Railway CLI).

### 2. Frontend on Vercel

1. In [Vercel](https://vercel.com) -> **Add New Project** -> import the repo.
2. **Root Directory**: `frontend`. Framework preset: **Vite** (build `npm run build`, output `dist`).
3. Environment variable: `VITE_API_URL=https://<backend>.up.railway.app/api`.
4. Deploy. `frontend/vercel.json` rewrites all paths to `index.html` so React Router deep links work.
5. Put the Vercel URL in Railway's `CORS_ORIGIN` and redeploy the backend.

## Screenshots

The UI reference is in [`docs/ui-reference.jpg`](./docs/ui-reference.jpg). Add your screenshots to `docs/screenshots/`:

| Dashboard | Vehicles | AI Assistant | Admin |
| --- | --- | --- | --- |
| `docs/screenshots/dashboard.png` | `docs/screenshots/vehicles.png` | `docs/screenshots/assistant.png` | `docs/screenshots/admin.png` |

## Security notes

- The Gemini key exists only in the backend `.env` / Railway variables; the browser only calls our API.
- `.env` files are git-ignored; only `.env.example` files (no real values) are committed.
- All SQL uses `$1, $2` parameters (no SQL injection). Helmet headers, CORS whitelist, rate limits on `/api`, auth and AI routes.
- Payment is a demo: no card data is collected or stored.
