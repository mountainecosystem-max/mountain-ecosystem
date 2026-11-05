# Mountain Ecosystem

A pan-India mountain digital platform for discovering and posting mountain properties, finding mountain jobs with accommodation, and sharing community field experiences.

**Live site:** https://mountain-ecosystem.vercel.app

## Overview

Mountain Ecosystem connects people living, working, and investing in India's mountain regions. It covers Himachal Pradesh, Uttarakhand, Ladakh, Kashmir, Sikkim, the Bengal Hills, and the Nilgiris.

## Features

- **Properties:** list and discover mountain properties for long-term lease or outright sale
- **Jobs:** post vacancies and apply for verified mountain jobs that include accommodation
- **Community:** share and read on-the-ground field experiences from mountain regions
- **Ground reports:** [transparent local price and travel information, e.g. shared taxi fares — confirm]
- [Auth, search and filters, listing management — add what applies]

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite |
| Backend / Database | Supabase |
| Linting | Oxlint |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js [version, e.g. 20+]
- npm
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/mountainecosystem-max/mountain-ecosystem.git
cd mountain-ecosystem
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `[VITE_SUPABASE_URL]` | Supabase project URL |
| `[VITE_SUPABASE_ANON_KEY]` | Supabase anon (public) key |

Never commit real keys. `.env` is gitignored.

### Database Setup

The `supabase/` folder holds the database [schema / migrations]. Apply it to your Supabase project:

```bash
[command, e.g. supabase db push]
```

### Run Locally

```bash
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run lint` | Run Oxlint |

## Project Structure

```
├── public/        # Static assets (logo, icons)
├── src/           # React + TypeScript source
├── supabase/      # Database schema and config
├── index.html     # App entry point and SEO metadata
└── vercel.json    # Vercel configuration
```

## Deployment

Deployed on Vercel. Pushes to `main` deploy automatically. Add the same environment variables in your Vercel project settings.

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss major changes.

