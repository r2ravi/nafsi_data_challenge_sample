import type { Resource, ZipCodeEntry } from '../types/index';

let cachedResources: Resource[] | null = null;
let cachedZipCodes: Record<string, ZipCodeEntry> | null = null;

export async function loadResources(): Promise<Resource[]> {
  if (cachedResources !== null) return cachedResources;
  try {
    const response = await fetch('./data/resources.json');
    if (!response.ok) throw new Error(`Failed to fetch resources: ${response.status}`);
    const data: Resource[] = await response.json();
    cachedResources = data;
    return cachedResources;
  } catch (error) {
    console.warn('Unable to load resources.json:', error);
    return [];
  }
}

async function loadZipCodes(): Promise<Record<string, ZipCodeEntry> | null> {
  if (cachedZipCodes !== null) return cachedZipCodes;
  try {
    const response = await fetch('./data/zipcodes.json');
    if (!response.ok) throw new Error(`Failed to fetch zipcodes: ${response.status}`);
    const data: Record<string, ZipCodeEntry> = await response.json();
    cachedZipCodes = data;
    return cachedZipCodes;
  } catch (error) {
    console.warn('Unable to load zipcodes.json:', error);
    return null;
  }
}

export async function geocodeZipCode(zip: string): Promise<{ lat: number; lng: number } | null> {
  const zipCodes = await loadZipCodes();
  if (!zipCodes) return null;
  const entry = zipCodes[zip];
  return entry ? { lat: entry.lat, lng: entry.lng } : null;
}

export async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  const zipCodes = await loadZipCodes();
  if (!zipCodes) return null;
  const normalizedCity = city.trim().toLowerCase();
  for (const entry of Object.values(zipCodes)) {
    if (entry.city.toLowerCase() === normalizedCity) return { lat: entry.lat, lng: entry.lng };
  }
  return null;
}

export function deduplicateResources(resources: Resource[]): Resource[] {
  const map = new Map<string, Resource>();
  for (const resource of resources) {
    const key = `${resource.organizationName.toLowerCase()}|${resource.address.toLowerCase()}`;
    const existing = map.get(key);
    if (!existing) { map.set(key, { ...resource }); continue; }
    map.set(key, mergeResources(existing, resource));
  }
  return Array.from(map.values());
}

function mergeResources(base: Resource, other: Resource): Resource {
  return {
    id: base.id || other.id,
    organizationName: base.organizationName || other.organizationName,
    address: base.address || other.address,
    lat: base.lat ?? other.lat, lng: base.lng ?? other.lng,
    operatingHours: base.operatingHours || other.operatingHours,
    foodTypes: unionArrays(base.foodTypes, other.foodTypes),
    eligibilityRequirements: unionArrays(base.eligibilityRequirements, other.eligibilityRequirements),
    contactInfo: base.contactInfo || other.contactInfo,
    sourceAttribution: base.sourceAttribution || other.sourceAttribution,
    householdSizeRange: mergeRange(base.householdSizeRange, other.householdSizeRange),
    incomeThreshold: base.incomeThreshold ?? other.incomeThreshold,
    utilityRequirements: unionArrays(base.utilityRequirements, other.utilityRequirements),
    dietaryOptions: unionArrays(base.dietaryOptions, other.dietaryOptions),
  };
}

function unionArrays<T>(a?: T[], b?: T[]): T[] | undefined {
  if (!a && !b) return undefined;
  if (!a) return b ? [...b] : undefined;
  if (!b) return [...a];
  return [...new Set([...a, ...b])];
}

function mergeRange(a?: { min: number; max: number }, b?: { min: number; max: number }) {
  if (!a && !b) return undefined;
  if (!a) return b; if (!b) return a;
  return { min: Math.min(a.min, b.min), max: Math.max(a.max, b.max) };
}

export function _resetCache(): void { cachedResources = null; cachedZipCodes = null; }
