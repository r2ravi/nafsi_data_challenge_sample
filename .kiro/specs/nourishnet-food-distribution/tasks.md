# Implementation Plan: Best Meal Match (NourishNet Food Distribution)

## Overview

Build a static React + TypeScript SPA ("Best Meal Match") that helps households in the MD/DC/VA area find personalized food assistance. The app uses Vite, react-leaflet, CSS Modules, and deploys to GitHub Pages. All code lives in `nafsi_data_challenge_sample/`. Implementation proceeds from project scaffolding → core types → data layer → matching engine → UI components → styling → testing → deployment config → documentation.

## Tasks

- [x] 1. Scaffold project structure and install dependencies
  - [x] 1.1 Initialize Vite + React + TypeScript project in `nafsi_data_challenge_sample/`
    - Run `npm create vite@latest` with react-ts template
    - Install dependencies: `react-leaflet`, `leaflet`, `lucide-react`
    - Install dev dependencies: `vitest`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@types/leaflet`
    - Configure `vite.config.ts` with GitHub Pages `base` path
    - Configure `vitest.config.ts` with jsdom environment
    - _Requirements: 7.1, 7.4, 7.5_

  - [x] 1.2 Create directory structure and placeholder files
    - Create `src/types/`, `src/components/`, `src/engine/`, `src/data/`, `src/__tests__/`, `public/data/`
    - Create test setup file `src/__tests__/setup.ts`
    - _Requirements: 7.4_

- [x] 2. Define core types and interfaces
  - [x] 2.1 Create type definitions in `src/types/index.ts`
    - Define `HouseholdProfile`, `IntakeFormData`, `Resource`, `ScoredResource`, `ScoreWeights`, `AppState` interfaces
    - Define `UtilityAccess` type union: `'oven-stove' | 'microwave-only' | 'none'`
    - Define `ZipCodeEntry` interface for the zip code lookup table
    - _Requirements: 1.5, 2.2, 3.2_

- [x] 3. Implement data layer
  - [x] 3.1 Create static JSON data files in `public/data/`
    - Create `resources.json` with sample Resource objects covering MD/DC/VA food distribution sites from the 25+ public sources
    - Create `zipcodes.json` with MD/DC/VA zip code → lat/lng/city/state lookup entries
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 3.2 Implement ResourceLoader in `src/data/resourceLoader.ts`
    - Implement `loadResources()` — fetches and caches `resources.json`
    - Implement `geocodeZipCode(zip)` — looks up zip in `zipcodes.json`
    - Implement `geocodeCity(city)` — case-insensitive city lookup in `zipcodes.json`
    - Implement `deduplicateResources(resources)` — merges duplicates by org name + address, retaining most complete info
    - Handle fetch errors gracefully (log warning, return empty/null)
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 3.3 Write property test for Resource round-trip parsing (Property 6)
    - **Property 6: Resource round-trip parsing**
    - Serialize a valid Resource to JSON and re-parse; result must deeply equal original
    - **Validates: Requirements 3.2, 3.6**

  - [ ]* 3.4 Write property test for duplicate merging (Property 7)
    - **Property 7: Duplicate merging preserves completeness**
    - For any set of Resources with duplicates, merged output retains all non-empty fields and contains no duplicates
    - **Validates: Requirements 3.4**

- [x] 4. Implement ProfileBuilder and Haversine distance
  - [x] 4.1 Implement ProfileBuilder in `src/engine/profileBuilder.ts`
    - Implement `buildProfile(formData)` — converts IntakeFormData to HouseholdProfile, resolving location via geocoding
    - Implement `serializeProfile(profile)` — JSON serialization
    - Implement `deserializeProfile(json)` — JSON deserialization with validation
    - _Requirements: 1.5, 1.6_

  - [x] 4.2 Implement Haversine distance in `src/engine/haversine.ts`
    - Implement `haversineDistance(lat1, lng1, lat2, lng2)` — returns distance in miles
    - Pure function, no side effects
    - _Requirements: 2.2_

  - [ ]* 4.3 Write property test for profile construction (Property 1)
    - **Property 1: Profile construction preserves all form fields**
    - For any valid IntakeFormData, `buildProfile` output must contain every entered field value
    - **Validates: Requirements 1.5**

  - [ ]* 4.4 Write property test for HouseholdProfile round-trip (Property 2)
    - **Property 2: HouseholdProfile JSON round-trip**
    - For any valid HouseholdProfile, serialize then deserialize must produce deeply equal object
    - **Validates: Requirements 1.6**

- [ ] 5. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement Matching Engine
  - [x] 6.1 Implement ScoreCalculator in `src/engine/scoreCalculator.ts`
    - Implement proximity score (0–1): inverse distance with 50-mile max radius
    - Implement eligibility score (0–1): income threshold + household size range matching (full=1.0, partial=0.5, no data=0.75)
    - Implement food suitability score (0–1): utility access compatibility check
    - Implement dietary match score (0–1): proportion of dietary restrictions satisfied
    - Implement household fit score (0–1): household size within resource range
    - Implement `scoreResource(profile, resource, weights)` — weighted sum of all components
    - _Requirements: 2.1, 2.2_

  - [x] 6.2 Implement MatchingEngine in `src/engine/matchingEngine.ts`
    - Implement `getTopMatches(profile, resources, maxResults=5)` — scores all resources, sorts descending by score with distance tiebreaker, returns top 5
    - Handle edge case: fewer than 5 resources returns all available
    - Handle edge case: zero resources returns empty array
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.7_

  - [ ]* 6.3 Write property test for match score validity (Property 3)
    - **Property 3: Match score validity and boundedness**
    - For any valid profile and resource, score must be in [0, 1]
    - **Validates: Requirements 2.2**

  - [ ]* 6.4 Write property test for Top-K matching invariant (Property 4)
    - **Property 4: Top-K matching invariant**
    - Results ≤ 5, sorted descending by score, ties broken by ascending distance, no higher-scoring resource excluded
    - **Validates: Requirements 2.1, 2.3, 2.4, 2.5, 2.7**

- [ ] 7. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement UI components
  - [x] 8.1 Implement Header component in `src/components/Header.tsx` and `src/components/Header.module.css`
    - App title "Best Meal Match" with Lucide food/home icons
    - Minimal text, ESL-friendly visual design
    - _Requirements: 5.1_

  - [x] 8.2 Implement IntakeForm component in `src/components/IntakeForm.tsx` and `src/components/IntakeForm.module.css`
    - Zip code / city text field as primary required input with Lucide MapPin icon
    - Optional fields: household size, MAGI with unemployed checkbox, utility access radio group, dietary restrictions, mobility limitations
    - All form labels use Lucide icons alongside minimal text
    - Validation: require zip/city, show inline error if empty on submit
    - Unemployed checkbox disables MAGI input
    - On submit, call `onSubmit(profile)` with built HouseholdProfile
    - ARIA labels on all interactive elements, keyboard navigable
    - Large touch targets (min 44x44px)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1, 5.2, 5.3, 5.5_

  - [x] 8.3 Implement ResultCard component in `src/components/ResultCard.tsx` and `src/components/ResultCard.module.css`
    - Display rank position, organization name, address, distance, food types, eligibility summary, operating hours
    - Color-coded match quality (green/yellow/orange)
    - Lucide icons for each attribute (MapPin, Clock, Utensils, Users, etc.)
    - _Requirements: 2.6, 5.1_

  - [x] 8.4 Implement ResultsPanel component in `src/components/ResultsPanel.tsx` and `src/components/ResultsPanel.module.css`
    - Renders ranked list of up to 5 ResultCards
    - Shows zero-results message with suggestion to broaden search when empty
    - _Requirements: 2.6, 6.5_

  - [x] 8.5 Implement MapView component in `src/components/MapView.tsx` and `src/components/MapView.module.css`
    - react-leaflet MapContainer with OpenStreetMap TileLayer
    - Numbered markers (1–5) for matched resources
    - Distinct home marker for household location
    - Popup on marker click: org name, address, distance, hours
    - Loading placeholder while tiles load
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.4_

  - [x] 8.6 Implement LoadingIndicator and ErrorMessage components
    - `src/components/LoadingIndicator.tsx` — spinner with optional message, icon-driven
    - `src/components/ErrorMessage.tsx` — user-friendly error with retry button
    - _Requirements: 6.1, 6.2_

  - [ ]* 8.7 Write property test for ResultCard completeness (Property 5)
    - **Property 5: ResultCard renders all required fields**
    - For any valid ScoredResource and rank, rendered output must contain rank, org name, address, distance, food types, eligibility, hours
    - **Validates: Requirements 2.6**

- [x] 9. Wire App component and state management
  - [x] 9.1 Implement App component in `src/App.tsx` and `src/App.module.css`
    - Manage AppState: `'intake' | 'loading' | 'results' | 'error'`
    - Wire IntakeForm → MatchingEngine → ResultsPanel + MapView data flow
    - Show LoadingIndicator during matching
    - Show ErrorMessage on errors with retry
    - Wrap map in Suspense with loading fallback
    - Add ErrorBoundary for unexpected errors
    - _Requirements: 1.5, 2.1, 6.1, 6.2, 6.3, 6.5_

  - [x] 9.2 Implement responsive layout styles
    - Mobile-optimized layout below 768px (stacked form, cards, map)
    - Desktop layout: side-by-side results panel and map
    - Support 320px to 1920px viewport widths
    - Color contrast ratio ≥ 4.5:1 for all text
    - _Requirements: 5.1, 5.4, 5.5_

- [ ] 10. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. GitHub Pages deployment configuration
  - [x] 11.1 Configure deployment
    - Verify `vite.config.ts` has correct `base` path for GitHub Pages
    - Install `gh-pages` package
    - Add `predeploy` and `deploy` scripts to `package.json`
    - _Requirements: 7.4, 7.5_

- [x] 12. Create documentation
  - [x] 12.1 Create README.md in `nafsi_data_challenge_sample/`
    - Project overview and purpose
    - Prerequisites (Node.js version)
    - Setup, install, build, and run instructions
    - Deployment instructions for GitHub Pages
    - Data sources attribution
    - License information
    - _Requirements: 7.2, 7.4_

  - [x] 12.2 Create prompt markdown file in `nafsi_data_challenge_sample/`
    - Document the final prompts used to build the application
    - _Requirements: 7.3_

- [ ] 13. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All code is created in `nafsi_data_challenge_sample/` directory
- The app uses Lucide React icons throughout for ESL-friendly visual design
