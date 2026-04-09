# Best Meal Match 🍎

A React-based web application that connects households in the Maryland, Washington DC, and Virginia area to personalized food assistance resources. Users enter their zip code or city along with optional household details, and the app returns the top 5 best-matching food distribution sites.

## Features

- **Personalized Intake Form** — Enter location (required), household size, income/unemployment status, kitchen access level, dietary needs, and transportation constraints
- **Smart Matching Engine** — Scores resources on proximity, eligibility, food suitability, dietary compatibility, and household fit
- **Top 5 Results** — Displays the five best-matching food resources ranked by relevance
- **Interactive Map** — Leaflet-based map showing matched locations relative to your address
- **ESL-Friendly Design** — Icon-driven UI with minimal text, emoji labels, and visual indicators
- **Responsive** — Works on mobile (320px) through desktop (1920px)
- **Accessible** — ARIA labels, keyboard navigation, high contrast

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

## Setup & Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nafsi_data_challenge_sample.git
cd nafsi_data_challenge_sample

# Install dependencies
npm install
```

## Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Running Tests

```bash
npm test
```

## Deploying to GitHub Pages

1. Update `homepage` in `package.json` with your GitHub username
2. Update `base` in `vite.config.ts` to match your repo name
3. Run:

```bash
npm run deploy
```

This builds the project and pushes the `dist/` folder to the `gh-pages` branch.

## Tech Stack

- **React 18** + TypeScript
- **Vite** — Build tool
- **Leaflet** / react-leaflet — Interactive maps (OpenStreetMap)
- **Lucide React** — Icon library
- **CSS Modules** — Scoped styling
- **Vitest** + fast-check — Testing and property-based testing

## Data Sources

This application aggregates food distribution data from 25+ public sources including:

- Feeding America (map.feedingamerica.org)
- Capital Area Food Bank (capitalareafoodbank.org)
- Maryland Food Bank (mdfoodbank.org)
- 211 Maryland (search.211md.org)
- Maryland Open Data (opendata.maryland.gov)
- DC Open Data (opendata.dc.gov)
- Virginia Open Data (data.virginia.gov)
- U.S. Census Bureau (data.census.gov)
- USDA Food Environment Atlas (ers.usda.gov)
- EPA Excess Food Opportunities Map (epa.gov)
- Prince George's County Food Equity Council (pgcfec.org)
- Montgomery County Food Council (mocofoodcouncil.org)
- And more — see the full list in the requirements document

## Project Structure

```
src/
├── types/index.ts          # TypeScript interfaces
├── data/resourceLoader.ts  # Data fetching and geocoding
├── engine/
│   ├── haversine.ts        # Distance calculation
│   ├── profileBuilder.ts   # Intake form → profile
│   ├── scoreCalculator.ts  # Scoring components
│   └── matchingEngine.ts   # Top-5 matching
├── components/
│   ├── Header.tsx           # App header
│   ├── IntakeForm.tsx       # User intake form
│   ├── ResultCard.tsx       # Single result display
│   ├── ResultsPanel.tsx     # Results list
│   ├── MapView.tsx          # Leaflet map
│   ├── LoadingIndicator.tsx # Loading spinner
│   └── ErrorMessage.tsx     # Error display
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles
public/data/
├── resources.json           # Food distribution resource data
└── zipcodes.json            # Zip code geocoding lookup
```

## License

Open source — built for the NourishNet Data Challenge.
