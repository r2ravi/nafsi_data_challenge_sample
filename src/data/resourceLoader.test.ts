import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadResources, geocodeZipCode, geocodeCity, deduplicateResources, _resetCache } from './resourceLoader';
import type { Resource } from '../types/index';

function makeResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'test-001', organizationName: 'Test Org', address: '123 Main St, Washington, DC 20001',
    lat: 38.9, lng: -77.0, operatingHours: 'Mon-Fri 9am-5pm', foodTypes: ['canned goods'],
    eligibilityRequirements: ['open to all'], contactInfo: '(202) 555-0100', sourceAttribution: 'test.org',
    ...overrides,
  };
}

const sampleResources: Resource[] = [makeResource({ id: 'r1', organizationName: 'Org A' }), makeResource({ id: 'r2', organizationName: 'Org B' })];
const sampleZipCodes = {
  '20001': { lat: 38.912, lng: -77.016, city: 'Washington', state: 'DC' },
  '20740': { lat: 38.9897, lng: -76.9378, city: 'College Park', state: 'MD' },
  '22030': { lat: 38.8462, lng: -77.3064, city: 'Fairfax', state: 'VA' },
};

describe('ResourceLoader', () => {
  beforeEach(() => { _resetCache(); vi.restoreAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  describe('loadResources', () => {
    it('fetches and returns resources', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(sampleResources), { status: 200 }));
      const result = await loadResources();
      expect(result).toHaveLength(2);
    });
    it('returns empty array on fetch error', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
      expect(await loadResources()).toEqual([]);
    });
  });

  describe('geocodeZipCode', () => {
    it('returns lat/lng for known zip', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(sampleZipCodes), { status: 200 }));
      expect(await geocodeZipCode('20001')).toEqual({ lat: 38.912, lng: -77.016 });
    });
    it('returns null for unknown zip', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(sampleZipCodes), { status: 200 }));
      expect(await geocodeZipCode('99999')).toBeNull();
    });
  });

  describe('geocodeCity', () => {
    it('returns lat/lng case-insensitive', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(sampleZipCodes), { status: 200 }));
      expect(await geocodeCity('college park')).toEqual({ lat: 38.9897, lng: -76.9378 });
    });
  });

  describe('deduplicateResources', () => {
    it('merges duplicates', () => {
      const resources = [
        makeResource({ id: 'a', organizationName: 'Org A', address: '1 St', foodTypes: ['canned goods'] }),
        makeResource({ id: 'b', organizationName: 'Org A', address: '1 St', foodTypes: ['fresh produce'] }),
      ];
      const result = deduplicateResources(resources);
      expect(result).toHaveLength(1);
      expect(result[0].foodTypes).toContain('canned goods');
      expect(result[0].foodTypes).toContain('fresh produce');
    });
    it('returns empty for empty input', () => { expect(deduplicateResources([])).toEqual([]); });
  });
});
