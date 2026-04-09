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

export function proximityScore(profileLat: number, profileLng: number, resourceLat: number, resourceLng: number): number {
  const dist = haversineDistance(profileLat, profileLng, resourceLat, resourceLng);
  if (dist >= MAX_RADIUS_MILES) return 0;
  return 1 - dist / MAX_RADIUS_MILES;
}

export function eligibilityScore(profile: HouseholdProfile, resource: Resource): number {
  let incomeScore = 0.75;
  let sizeScore = 0.75;
  if (resource.incomeThreshold != null) {
    if (profile.income?.isUnemployed) incomeScore = 1.0;
    else if (profile.income?.magi != null) incomeScore = profile.income.magi <= resource.incomeThreshold ? 1.0 : 0.0;
  }
  if (resource.householdSizeRange && profile.householdSize != null) {
    const { min, max } = resource.householdSizeRange;
    sizeScore = profile.householdSize >= min && profile.householdSize <= max ? 1.0 : 0.5;
  }
  return (incomeScore + sizeScore) / 2;
}

export function foodSuitabilityScore(profile: HouseholdProfile, resource: Resource): number {
  if (!resource.utilityRequirements || resource.utilityRequirements.length === 0) return 0.75;
  if (resource.utilityRequirements.includes(profile.utilityAccess)) return 1.0;
  if (profile.utilityAccess === 'oven-stove') return 0.8;
  if (profile.utilityAccess === 'microwave-only' && resource.utilityRequirements.includes('none')) return 0.7;
  return 0.3;
}

export function dietaryMatchScore(profile: HouseholdProfile, resource: Resource): number {
  if (!profile.dietaryRestrictions || profile.dietaryRestrictions.length === 0) return 1.0;
  if (!resource.dietaryOptions || resource.dietaryOptions.length === 0) return 0.5;
  const resourceOptions = new Set(resource.dietaryOptions.map((d) => d.toLowerCase()));
  let matched = 0;
  for (const restriction of profile.dietaryRestrictions) {
    if (resourceOptions.has(restriction.toLowerCase())) matched++;
  }
  return matched / profile.dietaryRestrictions.length;
}

export function householdFitScore(profile: HouseholdProfile, resource: Resource): number {
  if (!profile.householdSize || !resource.householdSizeRange) return 0.75;
  const { min, max } = resource.householdSizeRange;
  if (profile.householdSize >= min && profile.householdSize <= max) return 1.0;
  const distance = profile.householdSize < min ? min - profile.householdSize : profile.householdSize - max;
  return Math.max(0, 1 - distance * 0.2);
}

export function scoreResource(profile: HouseholdProfile, resource: Resource, weights: ScoreWeights = DEFAULT_WEIGHTS): number {
  const prox = proximityScore(profile.location.lat, profile.location.lng, resource.lat, resource.lng);
  const elig = eligibilityScore(profile, resource);
  const food = foodSuitabilityScore(profile, resource);
  const diet = dietaryMatchScore(profile, resource);
  const fit = householdFitScore(profile, resource);
  const raw = weights.proximity * prox + weights.eligibility * elig + weights.foodSuitability * food + weights.dietaryMatch * diet + weights.householdFit * fit;
  return Math.min(1, Math.max(0, raw));
}
