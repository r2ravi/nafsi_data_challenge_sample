import type { HouseholdProfile, Resource, ScoredResource } from '../types/index';
import { scoreResource } from './scoreCalculator';
import { haversineDistance } from './haversine';

export function getTopMatches(profile: HouseholdProfile, resources: Resource[], maxResults: number = 5): ScoredResource[] {
  const scored: ScoredResource[] = resources.map((resource) => ({
    resource,
    matchScore: scoreResource(profile, resource),
    distanceMiles: haversineDistance(profile.location.lat, profile.location.lng, resource.lat, resource.lng),
  }));
  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.distanceMiles - b.distanceMiles;
  });
  return scored.slice(0, maxResults);
}
