# Best Meal Match — Prompt Pipeline

This document contains the complete prompt pipeline used to build the Best Meal Match application using Kiro. Judges can pass these prompts sequentially into Kiro to reproduce the tool as a React package.

---

## Prompt 1: Initial Feature Spec

```
I'm participating in the NourishNet data challenge organized by a University of Maryland-led
team receiving NSF funding. I need to build a React web app that transforms fragmented,
unstructured food distribution data from community websites into a one-stop source of
information for households seeking food assistance in the Maryland, metropolitan Washington
DC, and surrounding areas.

The app should connect families to nearby food distribution events with clear details like
location, hours, requirements, and types of food. It must be built exclusively using open
source tools and libraries, use a React framework, and be deployable to GitHub Pages.

Create a spec for this feature.
```

**Selections:** Build a Feature → Requirements First

---

## Prompt 2: Refine Requirements with Personalized Intake and Data Sources

```
To refine this requirements document further, here is what I specifically want to create:
a UI/UX that lets users enter in their zip code or their city, and then, the user should be
provided with the opportunity to enter in optional fields, including # of members in household,
MAGI if applicable/check unemployed if unemployed, whether individual has access to certain
utilities (oven/stove in addition to microwave, or no utilities at all), etc.

These websites should be used on the backend or at least a subset of these should be
leveraged on the background, to basically populate a set of the results that matches as
CLOSELY with the individual's circumstances as possible. FIVE BEST MATCHES SHOULD BE DISPLAYED.

Data sources:
- https://map.feedingamerica.org
- https://opendata.maryland.gov
- https://opendata.dc.gov/
- https://data.virginia.gov/
- https://data.princegeorgescountymd.gov/
- https://www.capitalareafoodbank.org/
- https://mdfoodbank.org/hunger-in-maryland
- https://mda.maryland.gov/
- https://www.ers.usda.gov/data-products/food-environment-atlas
- https://data.census.gov/
- https://extension.umd.edu/resource/food-access-resources/
- https://www.epa.gov/sustainable-management-food/excess-food-opportunities-map
- https://compass.maryland.gov/map/
- https://princegeorges.maps.arcgis.com/apps/dashboards/9f9202c51cc345ab9e0e1aa21a23bb76
- https://pgcfec.org/resources/find-food-food-pantry-listings/
- https://search.211md.org/?q=Food%20Pantries
- https://msa.maryland.gov/megafile/msa/speccol/sc5300/sc5339/000113/014000/014769/unrestricted/20120605e-021.pdf
- https://mdfoodbank.org/find-food/#more
- https://search.211md.org/search?query=food+pantry
- https://www.carrollcountymd.gov/media/ky2buxpf/food-pantry-and-soup-kitchen-directory.pdf
- https://www.hclhic.org/Content/Upload/page/f8bb951b-b863-426b-ae3f-57d0d820d48a.pdf
- https://kofc-md.org/wp-content/uploads/2019/06/food-pantries-in-mdpdf-1.pdf
- https://mocofoodcouncil.org/map/
- https://carolinebettertogether.org/food-pantries
- https://www.epa.gov/lmop/landfill-technical-data
- https://usda-fns.maps.arcgis.com/apps/webappviewer/index.html?id=15e1c457b56c4a729861d015cd626a23
```

---

## Prompt 3: Rename Application and Begin Build

```
Let's also rename the React application I'm building to "Best Meal Match".

Now create the final React package based on the requirements we put together, the goals I
outlined that served as the motivation for the requirements doc, and the fact that we need
to make this app easy to maneuver visually for ESL speakers — so more focus on visuals
than text. Also can we make this into a GitHub Pages site as well? So can you generate the
React app as well as the GitHub Pages site that can be used to play around directly with
the app we create.
```

---

## Prompt 4: Continue Implementation

```
Resume where we left off. Complete all remaining tasks.
```

---

## Prompt 5: Install Dependencies

```
Can you install dependencies because this is being pushed to GitHub.
```

*(Required Node.js installation first, then ran `npm install`)*

---

## Prompt 6: Flatten Project Structure

```
Anything that is not in the nafsi_data_challenge_sample subfolder, move it to the root;
if any of the files are duplicates, delete them from the subfolder. After ensuring
everything from the subfolder is in the root, delete the subfolder.
```

---

## Prompt 7: Final Packaging

```
Wrap up the application into a subfolder within the root, and within the root, create a
README that describes how to run the application and markdown of the entire prompt pipeline.
```

---

## Reproduction Instructions

To reproduce this application from these prompts using Kiro:

1. Open Kiro in an empty workspace
2. Enter **Prompt 1** — select "Build a Feature" → "Requirements" when asked
3. After requirements are generated, enter **Prompt 2** to refine with personalized intake and data sources
4. Enter **Prompt 3** to rename to "Best Meal Match" and begin implementation with ESL-friendly design and GitHub Pages
5. Enter **Prompt 4** to complete all remaining implementation tasks
6. Ensure Node.js is installed, then enter **Prompt 5** to install dependencies
7. Enter **Prompt 6** to flatten the project structure
8. Enter **Prompt 7** to package into final deliverable structure

### Running the Result

```bash
cd best-meal-match
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Deploying to GitHub Pages

```bash
cd best-meal-match
npm run deploy
```
