import type { IntakeFormData, HouseholdProfile } from '../types/index';
import { geocodeZipCode, geocodeCity } from '../data/resourceLoader';

/**
 * Converts raw IntakeFormData into a fully resolved HouseholdProfile.
 * Resolves location via zip code or city geocoding.
 * Throws if no valid location can be resolved.
 */
export async function buildProfile(
  formData: IntakeFormData
): Promise<HouseholdProfile> {
  let coords: { lat: number; lng: number } | null = null;

  if (formData.zipCode) {
    coords = await geocodeZipCode(formData.zipCode.trim());
  }

  if (!coords && formData.city) {
    coords = await geocodeCity(formData.city.trim());
  }

  if (!coords) {
    throw new Error(
      'Unable to resolve location. Please enter a valid zip code or city.'
    );
  }

  return {
    location: {
      zipCode: formData.zipCode?.trim(),
      city: formData.city?.trim(),
      lat: coords.lat,
      lng: coords.lng,
    },
    householdSize: formData.householdSize,
    income: {
      magi: formData.isUnemployed ? undefined : formData.magi,
      isUnemployed: formData.isUnemployed,
    },
    utilityAccess: formData.utilityAccess,
    dietaryRestrictions: formData.dietaryRestrictions,
    mobilityLimitations: formData.mobilityLimitations,
  };
}

/** Serializes a HouseholdProfile to a JSON string. */
export function serializeProfile(profile: HouseholdProfile): string {
  return JSON.stringify(profile);
}

/** Deserializes a JSON string back into a HouseholdProfile with basic validation. */
export function deserializeProfile(json: string): HouseholdProfile {
  const parsed = JSON.parse(json);

  if (!parsed.location || typeof parsed.location.lat !== 'number' || typeof parsed.location.lng !== 'number') {
    throw new Error('Invalid HouseholdProfile: missing or invalid location');
  }

  if (!['oven-stove', 'microwave-only', 'none'].includes(parsed.utilityAccess)) {
    throw new Error('Invalid HouseholdProfile: invalid utilityAccess');
  }

  return parsed as HouseholdProfile;
}
