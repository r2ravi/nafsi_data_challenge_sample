# Best Meal Match — Prompt Pipeline

This document contains the prompts used to build the Best Meal Match application using Kiro. Judges can pass this file into Kiro to reproduce the tool.

---

## Prompt 1: Initial Feature Spec

> I'm participating in the NourishNet data challenge. I need to build a React web app that transforms fragmented, unstructured food distribution data from community websites into a one-stop source of information for households seeking food assistance in the Maryland, metropolitan Washington DC, and surrounding areas. The app should connect families to nearby food distribution events with clear details like location, hours, requirements, and types of food. It must be built exclusively using open source tools and libraries, use a React framework, and be deployable to GitHub Pages. Create a spec for this feature.

**Choice:** Build a Feature → Requirements First

---

## Prompt 2: Refine Requirements with Personalized Intake

> To refine this requirements document further, here is what I specifically want to create: a UI/UX that lets users enter in their zip code or their city, and then, the user should be provided with the opportunity to enter in optional fields, including # of members in household, MAGI if applicable/check unemployed if unemployed, whether individual has access to certain utilities (oven/stove in addition to microwave, or no utilities at all), etc. These websites should be used on the backend or at least a subset of these should be leveraged on the background, to basically populate a set of the results that matches as CLOSELY with the individual's circumstances as possible. FIVE BEST MATCHES SHOULD BE DISPLAYED.
>
> Data sources:
> - https://map.feedingamerica.org
> - https://opendata.maryland.gov
> - https://opendata.dc.gov/
> - https://data.virginia.gov/
> - https://data.princegeorgescountymd.gov/
> - https://www.capitalareafoodbank.org/
> - https://mdfoodbank.org/hunger-in-maryland
> - https://mda.maryland.gov/
> - https://www.ers.usda.gov/data-products/food-environment-atlas
> - https://data.census.gov/
> - https://extension.umd.edu/resource/food-access-resources/
> - https://www.epa.gov/sustainable-management-food/excess-food-opportunities-map
> - https://compass.maryland.gov/map/
> - https://princegeorges.maps.arcgis.com/apps/dashboards/9f9202c51cc345ab9e0e1aa21a23bb76
> - https://pgcfec.org/resources/find-food-food-pantry-listings/
> - https://search.211md.org/?q=Food%20Pantries
> - https://msa.maryland.gov/megafile/msa/speccol/sc5300/sc5339/000113/014000/014769/unrestricted/20120605e-021.pdf
> - https://mdfoodbank.org/find-food/#more
> - https://search.211md.org/search?query=food+pantry
> - https://www.carrollcountymd.gov/media/ky2buxpf/food-pantry-and-soup-kitchen-directory.pdf
> - https://www.hclhic.org/Content/Upload/page/f8bb951b-b863-426b-ae3f-57d0d820d48a.pdf
> - https://kofc-md.org/wp-content/uploads/2019/06/food-pantries-in-mdpdf-1.pdf
> - https://mocofoodcouncil.org/map/
> - https://carolinebettertogether.org/food-pantries
> - https://www.epa.gov/lmop/landfill-technical-data
> - https://usda-fns.maps.arcgis.com/apps/webappviewer/index.html?id=15e1c457b56c4a729861d015cd626a23

---

## Prompt 3: Rename and Build

> Let's rename the React application to "Best Meal Match". Now create the final React package based on the requirements we put together, the goals I outlined, and the fact that we need to make this app easy to maneuver visually for ESL speakers — more focus on visuals than text. Also make this into a GitHub Pages site.

---

## Prompt 4: Continue Implementation

> Resume where we left off. Complete all remaining tasks — install dependencies, build out the matching engine, all UI components, wire the App, configure GitHub Pages deployment, and create documentation.

---

## Reproduction Instructions

To reproduce this application from these prompts:

1. Open Kiro
2. Enter Prompt 1 and select "Build a Feature" → "Requirements"
3. After requirements are generated, enter Prompt 2 to refine
4. Enter Prompt 3 to rename and begin implementation
5. Enter Prompt 4 to complete all remaining tasks
6. Run `npm install` then `npm run dev` to start the app locally
7. Run `npm run deploy` to deploy to GitHub Pages
