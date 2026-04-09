# Requirements Document

## Introduction

Best Meal Match is a React-based web application that helps households in the Maryland, metropolitan Washington DC, and surrounding areas find personalized food assistance. The application collects household circumstances through a guided intake flow, then matches the household against food distribution data aggregated from over 25 public data sources. The Matching_Engine scores and ranks results, presenting the top five best-fit food distribution resources based on proximity, eligibility, household size, income, and utility access. The tool is built entirely with open-source technologies and publicly available datasets.

## Glossary

- **BestMealMatch_App**: The React-based single-page web application named "Best Meal Match" that serves as the unified food distribution information platform
- **Intake_Form**: The UI component that collects a Household_User's location and optional household circumstance fields
- **Household_Profile**: The structured data object produced by the Intake_Form, containing the user's location, household size, income status, utility access, and other circumstance fields
- **Matching_Engine**: The backend module that scores and ranks food distribution resources against a Household_Profile and returns the top five matches
- **Data_Ingestion_Engine**: The module responsible for fetching, parsing, and normalizing food distribution data from the configured Data_Sources into structured Resource objects
- **Map_View**: The interactive map component that displays food distribution resource locations geographically
- **Resource**: A food distribution location or program operated by a nonprofit, community organization, faith-based group, or local agency, including food pantries, food banks, meal programs, and distribution events
- **Organization**: A nonprofit, community group, faith-based group, or local agency that operates one or more Resources
- **Household_User**: A person or family seeking information about nearby food distribution resources
- **Service_Area**: The geographic region covering Maryland, metropolitan Washington DC, and surrounding areas
- **MAGI**: Modified Adjusted Gross Income, used to determine eligibility for certain food assistance programs
- **Utility_Access**: A household's access to cooking appliances — specifically whether the household has an oven/stove, only a microwave, or no cooking utilities at all — which affects the types of food that are practical for the household
- **Match_Score**: A numeric score assigned by the Matching_Engine to each Resource indicating how closely it fits the Household_Profile, considering proximity, eligibility, food types, household size, and income
- **Data_Source**: One of the configured public websites or open data portals from which the Data_Ingestion_Engine fetches food distribution information
- **Result_Card**: The UI component that displays a single matched Resource with its details and Match_Score ranking

## Requirements

### Requirement 1: Personalized Intake Flow

**User Story:** As a Household_User, I want to enter my location and household circumstances through a guided form, so that the application can find food assistance resources tailored to my situation.

#### Acceptance Criteria

1. WHEN a Household_User opens the BestMealMatch_App, THE Intake_Form SHALL display a zip code or city text field as the primary required input.
2. IF a Household_User submits the Intake_Form without entering a zip code or city, THEN THE Intake_Form SHALL display a validation error indicating that location is required.
3. THE Intake_Form SHALL display the following optional fields after the location field: number of household members, MAGI input with a companion "unemployed" checkbox, Utility_Access selection (oven/stove, microwave only, or no cooking utilities), dietary restrictions, and mobility or transportation limitations.
4. WHEN a Household_User checks the "unemployed" checkbox, THE Intake_Form SHALL disable the MAGI input field and record the income status as unemployed.
5. WHEN a Household_User submits the Intake_Form with at least a valid zip code or city, THE Intake_Form SHALL produce a Household_Profile object containing all entered fields.
6. FOR ALL valid Intake_Form submissions, serializing the resulting Household_Profile to JSON and deserializing it back SHALL produce an equivalent Household_Profile object (round-trip property).

### Requirement 2: Personalized Matching and Scoring

**User Story:** As a Household_User, I want the application to match my household circumstances against available food resources, so that I receive the most relevant results for my situation.

#### Acceptance Criteria

1. WHEN the Intake_Form produces a Household_Profile, THE Matching_Engine SHALL score each Resource in the Service_Area against the Household_Profile.
2. THE Matching_Engine SHALL compute the Match_Score for each Resource by evaluating: geographic proximity to the entered location, eligibility requirements alignment with household income and size, food type suitability based on the household's Utility_Access, and any dietary restriction compatibility.
3. THE Matching_Engine SHALL rank all scored Resources in descending order of Match_Score and return exactly the top five Resources.
4. WHEN two or more Resources have an identical Match_Score, THE Matching_Engine SHALL break the tie by selecting the Resource with the shorter geographic distance to the household location.
5. IF fewer than five Resources exist in the dataset, THEN THE Matching_Engine SHALL return all available Resources ranked by Match_Score.
6. WHEN the Matching_Engine returns results, THE BestMealMatch_App SHALL display exactly five Result_Cards (or fewer per criterion 5), each showing: rank position, organization name, address, distance from entered location, food types available, eligibility summary, and operating hours.
7. FOR ALL Household_Profiles, the number of results returned by the Matching_Engine SHALL be less than or equal to five.

### Requirement 3: Data Ingestion from Public Sources

**User Story:** As a developer, I want the application to ingest and normalize food distribution data from configured public data sources, so that the Matching_Engine has a comprehensive dataset to score against.

#### Acceptance Criteria

1. THE Data_Ingestion_Engine SHALL fetch and parse food distribution data from the following Data_Sources: Feeding America food bank locator (map.feedingamerica.org), Maryland Open Data (opendata.maryland.gov), DC Open Data (opendata.dc.gov), Virginia Open Data (data.virginia.gov), Prince George's County Open Data (data.princegeorgescountymd.gov), Capital Area Food Bank (capitalareafoodbank.org), Maryland Food Bank (mdfoodbank.org), Maryland Department of Agriculture (mda.maryland.gov), USDA Food Environment Atlas (ers.usda.gov), U.S. Census Bureau data (data.census.gov), UMD Extension food access resources (extension.umd.edu), EPA Excess Food Opportunities Map (epa.gov), Maryland COMPASS map (compass.maryland.gov), Prince George's County food dashboard (princegeorges.maps.arcgis.com), PGC Food Equity Council pantry listings (pgcfec.org), 211 Maryland food pantry search (search.211md.org), Maryland State Archives food pantry data (msa.maryland.gov), Carroll County food pantry directory (carrollcountymd.gov), Howard County food resource listing (hclhic.org), Knights of Columbus Maryland food pantries (kofc-md.org), Montgomery County Food Council map (mocofoodcouncil.org), Caroline County food pantries (carolinebettertogether.org), EPA LMOP landfill data (epa.gov/lmop), and USDA FNS SNAP retailer locator (usda-fns.maps.arcgis.com).
2. THE Data_Ingestion_Engine SHALL transform raw data from each Data_Source into structured Resource objects containing: organization name, address, geographic coordinates, operating hours, food types offered, eligibility requirements, contact information, and source attribution.
3. IF a Data_Source is unavailable or returns an error during ingestion, THEN THE Data_Ingestion_Engine SHALL log a warning identifying the failed source and continue ingesting from the remaining Data_Sources.
4. IF the Data_Ingestion_Engine encounters duplicate Resources from multiple Data_Sources, THEN THE Data_Ingestion_Engine SHALL merge the duplicates into a single Resource retaining the most complete information.
5. THE Data_Ingestion_Engine SHALL produce structured Resource objects that the Matching_Engine can consume.
6. FOR ALL valid raw data records, parsing a record into a Resource object and then serializing the Resource object back to the normalized format and re-parsing SHALL produce an equivalent Resource object (round-trip property).

### Requirement 4: Interactive Map View

**User Story:** As a Household_User, I want to see my top matched food distribution resources on an interactive map, so that I can visually assess their locations relative to my household.

#### Acceptance Criteria

1. WHEN the Matching_Engine returns results, THE Map_View SHALL display the matched Resource locations as numbered markers (1 through 5) on an interactive map centered on the household's entered location.
2. WHEN a Household_User clicks on a map marker, THE Map_View SHALL display a popup with the Resource organization name, address, distance, and operating hours.
3. THE Map_View SHALL use an open-source mapping library to render the interactive map.
4. WHEN the Household_User zooms or pans the map, THE Map_View SHALL keep the numbered result markers visible.
5. THE Map_View SHALL display the household's entered location as a distinct marker differentiated from the Resource markers.

### Requirement 5: Responsive Design and Accessibility

**User Story:** As a Household_User accessing the application on a mobile device, I want the interface to be usable on any screen size, so that I can find food distribution resources from any device.

#### Acceptance Criteria

1. THE BestMealMatch_App SHALL render a usable layout on screen widths from 320 pixels to 1920 pixels.
2. THE BestMealMatch_App SHALL provide keyboard navigation for all interactive elements.
3. THE BestMealMatch_App SHALL include ARIA labels on all interactive elements to support screen reader usage.
4. THE BestMealMatch_App SHALL maintain a color contrast ratio of at least 4.5:1 for all text content against its background.
5. WHEN the viewport width is less than 768 pixels, THE BestMealMatch_App SHALL display a mobile-optimized layout for the Intake_Form and Result_Cards.

### Requirement 6: Error Handling and Loading States

**User Story:** As a Household_User, I want clear feedback when data is loading or errors occur, so that I understand the application state at all times.

#### Acceptance Criteria

1. WHILE the Matching_Engine is computing results, THE BestMealMatch_App SHALL display a loading indicator.
2. IF an unexpected error occurs during matching or data loading, THEN THE BestMealMatch_App SHALL display a user-friendly error message with a retry option.
3. IF the user's browser does not support geolocation, THEN THE BestMealMatch_App SHALL allow manual location entry via the Intake_Form as the primary input method.
4. WHILE the Map_View is loading map tiles, THE Map_View SHALL display a loading placeholder.
5. IF the Matching_Engine finds zero Resources matching the Household_Profile, THEN THE BestMealMatch_App SHALL display a message suggesting the user broaden the search by adjusting optional intake fields or expanding the location radius.

### Requirement 7: Open Source Compliance and Reproducibility

**User Story:** As a challenge evaluator, I want the application to be built exclusively with open-source tools and be reproducible from prompts, so that the submission meets challenge requirements.

#### Acceptance Criteria

1. THE BestMealMatch_App SHALL use only open-source libraries and tools with OSI-approved licenses.
2. THE BestMealMatch_App SHALL include a README.md file with complete setup, build, and run instructions.
3. THE BestMealMatch_App SHALL include a prompt markdown file documenting the final prompts used to build the application.
4. WHEN a reviewer follows the README.md instructions, THE BestMealMatch_App SHALL build and run without errors on a standard development environment with Node.js installed.
5. THE BestMealMatch_App SHALL not depend on any proprietary cloud services for core functionality.
