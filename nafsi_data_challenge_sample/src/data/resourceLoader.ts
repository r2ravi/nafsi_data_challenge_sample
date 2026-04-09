import type { Resource, ZipCodeEntry } from '../types/index';

/** Cached resources after first successful load */
let cachedResources: Resource[] | null = null;

/** Cached zip code lookup table after first successful load */
let cachedZipCodes: Record<string, ZipCodeEntry> | null = null;

/**
 * Fetches and caches the resources.json data file.
 * Returns cached data on subsequent calls.
 * On fetch error, logs a warning and returns an empty array.
 */
export async function loadResources(): Promise<Resource[]> {
  if (cachedResources !== null) {
    return cachedResources;
  }

  try {
    const response = await fetch('./data/resources.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.status}`);
    }
    const data: Resource[] = await response.json();
    cachedResources = data;
    return cachedResources;
  } catch (error) {
    console.warn('Unable to load resources.json:', error);
    return [];
  }
}

/**
 * Loads and caches the zipcodes.json lookup table.
 */
async function loadZipCodes(): Promise<Record<string, ZipCodeEntry> | null> {
  if (cachedZipCodes !== null) {
    return cachedZipCodes;
  }

  try {
    const response = await fetch('./data/zipcodes.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch zipcodes: ${response.status}`);
    }
    const data: Record<string, ZipCodeEntry> = await response.json();
    cachedZipCodes = data;
    return cachedZipCodes;
  } catch (error) {
    console.warn('Unable to load zipcodes.json:', error);
    return null;
  }
}

/**
 * Looks up a zip code in the static zipcodes.json table.
 * Returns lat/lng if found, null otherwise.
 * On fetch error, logs a warning and returns null.
 */
export async function geocodeZipCode(
  zip: string
): Promise<{ lat: number; lng: number } | null> {
  const zipCodes = await loadZipCodes();
  if (!zipCodes) {
    return null;
  }

  const entry = zipCodes[zip];
  if (!entry) {
    return null;
  }

  return { lat: entry.lat, lng: entry.lng };
}

/**
 * Case-insensitive city lookup in the zipcodes.json table.
 * Returns the lat/lng of the first matching entry, or null if not found.
 * On fetch error, logs a warning and returns null.
 */
export async function geocodeCity(
  city: string
): Promise<{ lat: number; lng: number } | null> {
  const zipCodes = await loadZipCodes();
  if (!zipCodes) {
    return null;
  }

  const normalizedCity = city.trim().toLowerCase();

  for (const entry of Object.values(zipCodes)) {
    if (entry.city.toLowerCase() === normalizedCity) {
      return { lat: entry.lat, lng: entry.lng };
    }
  }

  return null;
}

/**
 * Merges duplicate resources (same organization name + address) into a single
 * resource retaining the most complete information. For array fields, unions
 * all values. For scalar fields, prefers non-empty/non-undefined values.
 */
export function deduplicateResources(resources: Resource[]): Resource[] {
  const map = new Map<string, Resource>();

  for (const resource of resources) {
    const key = `${resource.organizationName.toLowerCase()}|${resource.address.toLowerCase()}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, { ...resource });
      continue;
    }

    // Merge: prefer non-empty values, union arrays
    map.set(key, mergeResources(existing, resource));
  }

  return Array.from(map.values());
}

/**
 * Merges two Resource objects, keeping the most complete information.
 * The first resource is treated as the base; the second fills in gaps.
 */
function mergeResources(base: Resource, other: Resource): Resource {
  const ft = unionArrays(base.foodTypes, other.foodTypes);
  const er = unionArrays(base.eligibilityRequirements, other.eligibilityRequirements);
  return {
    id: base.id || other.id,
    organizationName: base.organizationName || other.organizationName,
    address: base.address || other.address,
    lat: base.lat ?? other.lat,
    lng: base.lng ?? other.lng,
    operatingHours: base.operatingHours || other.operatingHours,
    foodTypes: ft !== undefined ? ft : [],
    eligibilityRequirements: er !== undefined ? er : [],
    contactInfo: base.contactInfo || other.contactInfo,
    sourceAttribution: base.sourceAttribution || other.sourceAttribution,
    householdSizeRange: mergeHouseholdSizeRange(
      base.householdSizeRange,
      other.householdSizeRange
    ),
    incomeThreshold: base.incomeThreshold ?? other.incomeThreshold,
    utilityRequirements: unionArrays(
      base.utilityRequirements,
      other.utilityRequirements
    ),
    dietaryOptions: unionArrays(base.dietaryOptions, other.dietaryOptions),
  };
}

/** Returns the union of two arrays, removing duplicates. */
function unionArrays<T>(a?: T[], b?: T[]): T[] | undefined {
  if (!a && !b) return undefined;
  if (!a) return b ? [...b] : undefined;
  if (!b) return [...a];
  return [...new Set([...a, ...b])];
}

/** Merges household size ranges, taking the widest span. */
function mergeHouseholdSizeRange(
  a?: { min: number; max: number },
  b?: { min: number; max: number }
): { min: number; max: number } | undefined {
  if (!a && !b) return undefined;
  if (!a) return b;
  if (!b) return a;
  return {
    min: Math.min(a.min, b.min),
    max: Math.max(a.max, b.max),
  };
}

/**
 * Resets the internal caches. Useful for testing.
 */
export function _resetCache(): void {
  cachedResources = null;
  cachedZipCodes = null;
}
