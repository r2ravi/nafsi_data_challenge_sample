import type { HouseholdProfile, Resource, ScoreWeights } from '../types/index';
import { haversineDistance } from './haversine';

const MAX_RADIUS_MILES = 50;

const DEFAULT_WEIGHTS: ScoreWeights = {
  proximity: 0.35,
  eligibility: 0.25,
  foodSuitability: 0.20,
  dietaryMatch: 0.10,
  householdFit: 0.10,
};

/**
 * Proximity score: 1.0 at 0 miles, 0.0 at MAX_RADIUS_MILES or beyond.
 */
export function proximityScore(
  profileLat: number,
  profileLng: number,
  resourceLat: number,
  resourceLng: number
): number {
  const dist = haversineDistance(profileLat, profileLng, resourceLat, resourceLng);
  if (dist >= MAX_RADIUS_MILES) return 0;
  return 1 - dist / MAX_RADIUS_MILES;
}

/**
 * Eligibility score based on income threshold and household size range.
 * 1.0 = full match, 0.5 = partial, 0.75 = no data available.
 */
export function eligibilityScore(profile: HouseholdProfile, resource: Resource): number {
  let incomeScore = 0.75;
  let sizeScore = 0.75;

  // Income check
  if (resource.incomeThreshold != null) {
    if (profile.income?.isUnemployed) {
      incomeScore = 1.0; // Unemployed always qualifies
    } else if (profile.income?.magi != null) {
      incomeScore = profile.income.magi <= resource.incomeThreshold ? 1.0 : 0.0;
    }
  }

  // Household size check
  if (resource.householdSizeRange && profile.householdSize != null) {
    const { min, max } = resource.householdSizeRange;
    sizeScore =
      profile.householdSize >= min && profile.householdSize <= max ? 1.0 : 0.5;
  }

  return (incomeScore + sizeScore) / 2;
}

/**
 * Food suitability score based on household utility access.
 * Checks if the resource offers food compatible with the household's cooking capabilities.
 */
export function foodSuitabilityScore(profile: HouseholdProfile, resource: Resource): number {
  if (!resource.utilityRequirements || resource.utilityRequirements.length === 0) {
    return 0.75; // No data — neutral score
  }

  if (resource.utilityRequirements.includes(profile.utilityAccess)) {
    return 1.0;
  }

  // Oven-stove can handle anything; microwave-only can handle microwave + none items
  if (profile.utilityAccess === 'oven-stove') return 0.8;
  if (profile.utilityAccess === 'microwave-only' && resource.utilityRequirements.includes('none')) return 0.7;

  return 0.3;
}

/**
 * Dietary match score: proportion of household dietary restrictions
 * that the resource can accommodate.
 */
export function dietaryMatchScore(profile: HouseholdProfile, resource: Resource): number {
  if (!profile.dietaryRestrictions || profile.dietaryRestrictions.length === 0) {
    return 1.0; // No restrictions — perfect match
  }

  if (!resource.dietaryOptions || resource.dietaryOptions.length === 0) {
    return 0.5; // No data on resource dietary options
  }

  const resourceOptions = new Set(resource.dietaryOptions.map((d) => d.toLowerCase()));
  let matched = 0;
  for (const restriction of profile.dietaryRestrictions) {
    if (resourceOptions.has(restriction.toLowerCase())) {
      matched++;
    }
  }

  return matched / profile.dietaryRestrictions.length;
}

/**
 * Household fit score: whether household size falls within the resource's range.
 */
export function householdFitScore(profile: HouseholdProfile, resource: Resource): number {
  if (!profile.householdSize || !resource.householdSizeRange) {
    return 0.75; // No data — neutral
  }

  const { min, max } = resource.householdSizeRange;
  if (profile.householdSize >= min && profile.householdSize <= max) return 1.0;

  // Partial credit if close
  const distance = profile.householdSize < min
    ? min - profile.householdSize
    : profile.householdSize - max;

  return Math.max(0, 1 - distance * 0.2);
}

/**
 * Computes the overall weighted match score for a resource against a profile.
 * Returns a value in [0, 1].
 */
export function scoreResource(
  profile: HouseholdProfile,
  resource: Resource,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number {
  const prox = proximityScore(profile.location.lat, profile.location.lng, resource.lat, resource.lng);
  const elig = eligibilityScore(profile, resource);
  const food = foodSuitabilityScore(profile, resource);
  const diet = dietaryMatchScore(profile, resource);
  const fit = householdFitScore(profile, resource);

  const raw =
    weights.proximity * prox +
    weights.eligibility * elig +
    weights.foodSuitability * food +
    weights.dietaryMatch * diet +
    weights.householdFit * fit;

  return Math.min(1, Math.max(0, raw));
}
