# FreeWay - AI-assisted car rental dashboard

FreeWay is a full-stack car rental web app built as a Full Stack course final project.
Customers browse a fleet (Compact / SUV / Premium), book vehicles, pay (demo) and manage bookings,
and get help from an **AI assistant powered by Google Gemini** that knows the fleet and the customer's
own booking history. Admins manage vehicles, all bookings and users.

> A full code walkthrough in Hebrew is in [`הסבר_קוד.md`](./הסבר_קוד.md).

## Features

- **Auth**: register / login with JWT, passwords hashed with bcrypt, roles `user` and `admin`.
- **What's new popup**: shown once after every deploy (build id, commit message and date are injected by Vite; change list lives in `frontend/src/version.js`).
- **Sign in with Google**: one-click login with a Google account (Google Identity Services in the browser, token verified on the server).
- **Vehicles**: catalog with filters (category, transmission, seats, price, search), details page. Admin CRUD.
- **Bookings**: create with live price calculation, date-overlap check, edit / cancel / pay (demo). Admin sees and manages all.
- **Dashboard** (follows the UI reference): stat tiles (bookings this month, availability %, CO2 saved), AI panel with quick actions, pickup map card, next booking card, payment card, recommended vehicles, promo card.
- **AI (server-side only, Gemini)**:
  - **Chat assistant** (`/api/ai/chat`, `/api/ai/chat/stream`) - structured system prompt that receives the user's bookings and the available fleet **from the DB**; answers stream to the browser (SSE). Conversations and messages are **saved in the DB**.
  - **Actions with tool use (function calling)**: the assistant can **book** or **cancel** for the user ("book the Toyota Yaris from 20/10/2026 to 30/10/2026"). Gemini asks for the `create_booking` / `cancel_booking` tool declared in `backend/src/ai/tools.js`; the server runs it through the normal bookings service (date checks, overlap check, price calculation), sends the result back to Gemini, and the model confirms to the user. Max 3 tool rounds per message.
  - **Recommended for you** (`/api/ai/recommendations`) - Gemini **structured JSON output** (vehicle ids + reasons + score) based on booking history; ids are validated and the result is **saved in the DB**.
  - Rate limiting (10 AI requests / minute / user), 20s timeout (AbortController), clear HTTP errors (429 / 502 / 503 / 504).
- **Hebrew / English UI with RTL support**: language toggle in the top bar, on the login page and in Profile → Settings. The choice is saved in `localStorage`, `<html dir>` flips to `rtl` for Hebrew, and the AI assistant answers in the chosen language (`language` field in the chat request).
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
│       ├── ai/                # prompts.js (system prompts + JSON schema), tools.js (AI actions)
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
        ├── context/           # AuthContext.jsx, LanguageContext.jsx
        ├── i18n/              # en.js, he.js, index.js (translations, no library)
        ├── hooks/             # useFetch.js
        ├── components/        # layout (incl. LanguageToggle), routing, ui, dashboard, vehicles, bookings, ai, admin
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
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for Sign in with Google (optional) |

**frontend/.env**: `VITE_API_URL` - the backend URL ending with `/api`. `VITE_GOOGLE_CLIENT_ID` - same Google client ID as the backend (optional, hides the Google button when empty).

### Sign in with Google setup

1. Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create a project and an **OAuth client ID** of type **Web application**.
2. Under **Authorized JavaScript origins** add `http://localhost:5173` and your Vercel URL (for example `https://freeway.vercel.app`). No redirect URI is needed.
3. Copy the client ID (ends with `.apps.googleusercontent.com`) into `GOOGLE_CLIENT_ID` (backend / Railway) and `VITE_GOOGLE_CLIENT_ID` (frontend / Vercel). Redeploy the frontend after changing it.
4. Flow: the Google button gives the browser an ID token -> `POST /api/auth/google` -> the server verifies it with `google-auth-library` -> finds the user by `google_id`, links an existing account with the same email, or creates a new `user` -> returns our JWT. Accounts created this way have no password.

## API overview

| Method | Path | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | public | Server / DB / AI status |
| POST | `/api/auth/register` | public | Create account (role user) |
| POST | `/api/auth/login` | public | Login, returns JWT |
| POST | `/api/auth/google` | public | Sign in with Google (ID token), returns JWT |
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
3. **New service -> GitHub repo**. Setting **Root Directory** to `backend` is optional: the root `package.json` and `railway.json` forward the build and start commands to the backend, so the default root also works.
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

## Credits

Vehicle photos in the seed data are served from [Unsplash](https://unsplash.com) (free license). The dashboard hero car is a local SVG.

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
