/** Utility access levels for a household's cooking capabilities */
export type UtilityAccess = 'oven-stove' | 'microwave-only' | 'none';

/** Intake form raw data before profile construction */
export interface IntakeFormData {
  zipCode?: string;
  city?: string;
  householdSize?: number;
  magi?: number;
  isUnemployed: boolean;
  utilityAccess: UtilityAccess;
  dietaryRestrictions?: string[];
  mobilityLimitations?: string[];
}

/** Structured household profile produced by ProfileBuilder */
export interface HouseholdProfile {
  location: {
    zipCode?: string;
    city?: string;
    lat: number;
    lng: number;
  };
  householdSize?: number;
  income?: {
    magi?: number;
    isUnemployed: boolean;
  };
  utilityAccess: UtilityAccess;
  dietaryRestrictions?: string[];
  mobilityLimitations?: string[];
}

/** A food distribution resource from the static JSON dataset */
export interface Resource {
  id: string;
  organizationName: string;
  address: string;
  lat: number;
  lng: number;
  operatingHours: string;
  foodTypes: string[];
  eligibilityRequirements: string[];
  contactInfo: string;
  sourceAttribution: string;
  householdSizeRange?: { min: number; max: number };
  incomeThreshold?: number;
  utilityRequirements?: UtilityAccess[];
  dietaryOptions?: string[];
}

/** A resource scored by the matching engine */
export interface ScoredResource {
  resource: Resource;
  matchScore: number;
  distanceMiles: number;
}

/** Weights for each scoring component in the matching engine */
export interface ScoreWeights {
  proximity: number;
  eligibility: number;
  foodSuitability: number;
  dietaryMatch: number;
  householdFit: number;
}

/** Application-level state for the main App component */
export interface AppState {
  phase: 'intake' | 'loading' | 'results' | 'error';
  profile: HouseholdProfile | null;
  results: ScoredResource[];
  error: string | null;
}

/** Entry in the static zip code lookup table */
export interface ZipCodeEntry {
  lat: number;
  lng: number;
  city: string;
  state: string;
}
