# 🏔️ Mountain Ecosystem (Mountain BnB)

A web platform for discovering and listing mountain stays, built with React, TypeScript, Vite, and Supabase.

**Live site:** [mountain-ecosystem.vercel.app](https://mountain-ecosystem.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-backend-3FCF8E?logo=supabase&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Data Modes](#data-modes)
- [Database Setup (Supabase)](#database-setup-supabase)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## About

Mountain Ecosystem is a single-page application for browsing and publishing mountain accommodation listings. It uses Supabase as its backend (database and API) and is deployed to Vercel.

<!-- TODO: Add 2–3 sentences describing your audience and goals, e.g. who the hosts and guests are, which regions you cover, and what makes the project different. -->

## Features

- Browse published mountain stay listings
- Client-side routing with React Router
- Runtime-validated data using Zod
- Clean empty states when no listings are published yet
- Optional preview mode with demo data for design review
- Responsive UI styled with Tailwind CSS

<!-- TODO: Add or remove features to match what the app actually does (search, filters, booking, host dashboard, authentication, maps, etc.). -->

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI framework | [React 19](https://react.dev) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Build tool | [Vite](https://vitejs.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Routing | [React Router 7](https://reactrouter.com) |
| Backend / database | [Supabase](https://supabase.com) (`@supabase/supabase-js`) |
| Validation | [Zod](https://zod.dev) |
| Icons | [Lucide](https://lucide.dev) |
| Linting | [Oxlint](https://oxc.rs) |
| Hosting | [Vercel](https://vercel.com) |

## Project Structure

```
mountain-ecosystem/
├── public/              # Static assets
├── src/                 # Application source code
├── supabase/            # Supabase database configuration / schema
├── .env.example         # Environment variable template
├── .oxlintrc.json       # Oxlint configuration
├── index.html           # App entry HTML
├── package.json         # Dependencies and scripts
├── tsconfig*.json       # TypeScript configuration
├── vercel.json          # Vercel deployment configuration
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (a current LTS release or newer)
- npm
- A free [Supabase](https://supabase.com) project

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mountainecosystem-max/mountain-ecosystem.git
cd mountain-ecosystem

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env

# 4. Add your Supabase credentials to .env (see below), then start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. You can find your Supabase URL and anon key in the Supabase dashboard under **Settings → API**.

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase publishable (anon) key | `your-publishable-anon-key` |
| `VITE_DATA_MODE` | `production` or `preview` (see below) | `production` |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`. Only the public anon key belongs in this frontend app. Never expose the Supabase `service_role` key here.

## Data Modes

The `VITE_DATA_MODE` variable controls where the app gets its data:

| Mode | Behavior |
| --- | --- |
| `production` | Reads live data from the Supabase database only. When no listings are published, the UI shows clean empty states. |
| `preview` | Uses temporary development data for demonstrations and design review. |

Use `preview` while designing or demoing, and always use `production` for real deployments.

## Database Setup (Supabase)

1. Create a new project at [app.supabase.com](https://app.supabase.com).
2. Apply the schema and policies from the [`supabase/`](./supabase) folder (via the Supabase SQL editor or the Supabase CLI).
3. Copy the project URL and anon key into your `.env` file.
4. Make sure Row Level Security (RLS) policies are enabled so that only published listings are publicly readable.

<!-- TODO: List the main tables (e.g. listings, profiles, bookings) and any storage buckets once you finalize the schema. -->

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload |
| `npm run build` | Type-check with `tsc -b` and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint on the codebase |

## Deployment

The project is configured for [Vercel](https://vercel.com) (see `vercel.json`).

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_DATA_MODE=production` under **Project Settings → Environment Variables**.
4. Deploy. Vercel will run `npm run build` and serve the output.

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Run `npm run lint` and `npm run build` to make sure everything passes
5. Push the branch and open a Pull Request

## License

<!-- TODO: Until then, all rights are reserved by the author. -->

---

Built by [mountainecosystem-max](https://github.com/mountainecosystem-max).

