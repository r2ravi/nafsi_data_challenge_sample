# NourishNet Data Challenge — Best Meal Match

This repository contains our submission for the NourishNet Data Challenge organized by the University of Maryland. The deliverable is **Best Meal Match**, a React web application that connects households in the MD/DC/VA area to personalized food assistance resources.

## Repository Structure

```
├── best-meal-match/       # Final React Package (Deliverable 2)
│   ├── src/               # Application source code
│   ├── public/data/       # Static food resource + zip code data
│   ├── dist/              # Production build output
│   ├── package.json       # Dependencies and scripts
│   ├── README.md          # Detailed app documentation
│   └── PROMPTS.md         # App-level prompt notes
├── PROMPTS.md             # Prompt Pipeline (Deliverable 1)
└── README.md              # This file (Deliverable 3)
```

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later (includes npm)

### Install & Run

```bash
cd best-meal-match
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
cd best-meal-match
npm run build
```

Output goes to `best-meal-match/dist/`.

### Deploy to GitHub Pages

1. In `best-meal-match/package.json`, replace `YOUR_GITHUB_USERNAME` in the `homepage` field with your actual GitHub username
2. In `best-meal-match/vite.config.ts`, update the `base` path to match your repo name
3. Run:

```bash
cd best-meal-match
npm run deploy
```

This builds the project and pushes `dist/` to the `gh-pages` branch.

### Run Tests

```bash
cd best-meal-match
npm test
```

## What It Does

Best Meal Match helps food-insecure households find the most relevant food assistance near them:

1. **Enter your location** — zip code or city (required)
2. **Add household details** (optional) — household size, income/unemployment, kitchen access (oven, microwave, or none), dietary needs, transportation
3. **Get your top 5 matches** — ranked by proximity, eligibility fit, food type suitability, and dietary compatibility
4. **View on a map** — interactive Leaflet map with numbered markers

The app is designed to be ESL-friendly with icon-driven UI, minimal text, emoji labels, and large touch targets.

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Leaflet / react-leaflet (OpenStreetMap)
- Lucide React (icons)
- CSS Modules (scoped styling)
- Vitest + fast-check (testing)

## Data Sources

The app aggregates food distribution data from 25+ public sources including Feeding America, Capital Area Food Bank, Maryland Food Bank, 211 Maryland, Maryland/DC/Virginia open data portals, U.S. Census Bureau, USDA, EPA, and county-level food councils. See `PROMPTS.md` for the full list.

## Deliverables

| # | Deliverable | Location |
|---|-------------|----------|
| 1 | Prompt Markdown File | [`PROMPTS.md`](./PROMPTS.md) |
| 2 | Final React Package | [`best-meal-match/`](./best-meal-match/) |
| 3 | README | This file |
