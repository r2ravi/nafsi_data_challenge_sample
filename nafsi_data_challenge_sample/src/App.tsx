import { useState } from 'react';
import Header from './components/Header';
import IntakeForm from './components/IntakeForm';
import ResultsPanel from './components/ResultsPanel';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import styles from './App.module.css';
import type { IntakeFormData, ScoredResource, HouseholdProfile } from './types/index';

// Hardcoded MD/DC/VA food resources for MVP demo
const DEMO_RESOURCES: ScoredResource[] = [
  {
    resource: {
      id: '1', organizationName: 'Capital Area Food Bank', address: '4900 Puerto Rico Ave NE, Washington, DC 20017',
      lat: 38.9337, lng: -76.9513, operatingHours: 'Mon-Fri 8am-4pm',
      foodTypes: ['Canned Goods', 'Fresh Produce', 'Dairy', 'Bread'],
      eligibilityRequirements: ['Open to all DC/MD/VA residents'], contactInfo: '(202) 644-9800',
      sourceAttribution: 'capitalareafoodbank.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '2', organizationName: 'Maryland Food Bank', address: '2200 Halethorpe Farms Rd, Baltimore, MD 21227',
      lat: 39.2356, lng: -76.6836, operatingHours: 'Mon-Fri 8am-5pm, Sat 8am-12pm',
      foodTypes: ['Non-Perishables', 'Fresh Produce', 'Frozen Meals'],
      eligibilityRequirements: ['Maryland residents', 'No income verification required'], contactInfo: '(410) 737-8282',
      sourceAttribution: 'mdfoodbank.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '3', organizationName: 'Bread for the City - SE Center', address: '1640 Good Hope Rd SE, Washington, DC 20020',
      lat: 38.8615, lng: -76.9946, operatingHours: 'Mon-Fri 9am-5pm',
      foodTypes: ['Fresh Produce', 'Canned Goods', 'Ready-to-Eat Meals'],
      eligibilityRequirements: ['DC residents', 'Below 200% FPL'], contactInfo: '(202) 561-8587',
      sourceAttribution: 'breadforthecity.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '4', organizationName: 'Prince George\'s County Food Equity Council', address: '9201 Basil Ct, Largo, MD 20774',
      lat: 38.8976, lng: -76.8292, operatingHours: 'Tue & Thu 10am-2pm, Sat 9am-12pm',
      foodTypes: ['Fresh Produce', 'Pantry Staples', 'Baby Formula'],
      eligibilityRequirements: ['PG County residents', 'Families with children prioritized'], contactInfo: '(301) 883-6400',
      sourceAttribution: 'pgcfec.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '5', organizationName: 'Arlington Food Assistance Center', address: '2708 S Nelson St, Arlington, VA 22206',
      lat: 38.8410, lng: -77.0909, operatingHours: 'Mon-Fri 9am-4pm, Sat 9am-12pm',
      foodTypes: ['Fresh Produce', 'Meat', 'Dairy', 'Canned Goods'],
      eligibilityRequirements: ['Arlington County residents', 'Income below 200% FPL'], contactInfo: '(703) 845-8486',
      sourceAttribution: 'afac.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '6', organizationName: 'Manna Food Center', address: '9311 Gaither Rd, Gaithersburg, MD 20877',
      lat: 39.1340, lng: -77.2014, operatingHours: 'Mon-Fri 8:30am-4:30pm',
      foodTypes: ['Fresh Produce', 'Pantry Staples', 'Frozen Protein'],
      eligibilityRequirements: ['Montgomery County residents'], contactInfo: '(301) 424-1130',
      sourceAttribution: 'mannafood.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '7', organizationName: 'So Others Might Eat (SOME)', address: '71 O St NW, Washington, DC 20001',
      lat: 38.9108, lng: -77.0147, operatingHours: 'Daily 7am-7pm',
      foodTypes: ['Hot Meals', 'Ready-to-Eat', 'Pantry Bags'],
      eligibilityRequirements: ['Open to all', 'No ID required'], contactInfo: '(202) 797-8806',
      sourceAttribution: 'some.org',
    }, matchScore: 0, distanceMiles: 0,
  },
  {
    resource: {
      id: '8', organizationName: 'Laurel Advocacy & Referral Services', address: '311 Laurel Ave, Laurel, MD 20707',
      lat: 39.0993, lng: -76.8483, operatingHours: 'Mon-Thu 9am-3pm',
      foodTypes: ['Non-Perishables', 'Fresh Produce', 'Hygiene Items'],
      eligibilityRequirements: ['Laurel area residents', 'Proof of address'], contactInfo: '(301) 776-0442',
      sourceAttribution: 'laureladvocacy.org',
    }, matchScore: 0, distanceMiles: 0,
  },
];

// Simple zip code → lat/lng lookup for demo
const ZIP_LOOKUP: Record<string, { lat: number; lng: number }> = {
  '20001': { lat: 38.9108, lng: -77.0178 }, '20002': { lat: 38.9050, lng: -76.9847 },
  '20003': { lat: 38.8818, lng: -76.9905 }, '20017': { lat: 38.9337, lng: -76.9940 },
  '20020': { lat: 38.8615, lng: -76.9750 }, '20742': { lat: 38.9897, lng: -76.9426 },
  '20740': { lat: 38.9807, lng: -76.9369 }, '20774': { lat: 38.8576, lng: -76.7958 },
  '20706': { lat: 38.9657, lng: -76.8572 }, '20707': { lat: 39.0993, lng: -76.8483 },
  '20783': { lat: 38.9818, lng: -76.9672 }, '20910': { lat: 39.0015, lng: -77.0392 },
  '20877': { lat: 39.1340, lng: -77.2014 }, '21227': { lat: 39.2356, lng: -76.6836 },
  '22206': { lat: 38.8410, lng: -77.0909 }, '22201': { lat: 38.8860, lng: -77.0946 },
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreAndRank(profile: HouseholdProfile): ScoredResource[] {
  return DEMO_RESOURCES.map((sr) => {
    const dist = haversine(profile.location.lat, profile.location.lng, sr.resource.lat, sr.resource.lng);
    const proxScore = Math.max(0, 1 - dist / 50);

    let eligScore = 0.75;
    if (profile.income?.isUnemployed) eligScore = 1.0;
    else if (profile.income?.magi != null && profile.income.magi < 30000) eligScore = 0.9;

    let foodScore = 0.75;
    if (profile.utilityAccess === 'none' && sr.resource.foodTypes.some(f => f.includes('Ready') || f.includes('Hot'))) foodScore = 1.0;
    else if (profile.utilityAccess === 'microwave-only' && sr.resource.foodTypes.some(f => f.includes('Canned') || f.includes('Ready'))) foodScore = 0.9;
    else if (profile.utilityAccess === 'oven-stove') foodScore = 0.85;

    const total = 0.4 * proxScore + 0.3 * eligScore + 0.3 * foodScore;
    return { ...sr, matchScore: Math.min(1, total), distanceMiles: dist };
  })
    .sort((a, b) => b.matchScore - a.matchScore || a.distanceMiles - b.distanceMiles)
    .slice(0, 5);
}

export default function App() {
  const [phase, setPhase] = useState<'intake' | 'loading' | 'results' | 'error'>('intake');
  const [results, setResults] = useState<ScoredResource[]>([]);
  const [profile, setProfile] = useState<HouseholdProfile | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(formData: IntakeFormData) {
    setPhase('loading');
    setTimeout(() => {
      try {
        const loc = formData.zipCode ? ZIP_LOOKUP[formData.zipCode] : null;
        if (!loc) {
          // Default to DC center if zip not found
          const fallback = { lat: 38.9072, lng: -77.0369 };
          const p: HouseholdProfile = {
            location: { ...fallback, zipCode: formData.zipCode, city: formData.city },
            householdSize: formData.householdSize,
            income: { magi: formData.isUnemployed ? undefined : formData.magi, isUnemployed: formData.isUnemployed },
            utilityAccess: formData.utilityAccess,
            dietaryRestrictions: formData.dietaryRestrictions,
            mobilityLimitations: formData.mobilityLimitations,
          };
          setProfile(p);
          setResults(scoreAndRank(p));
          setPhase('results');
          return;
        }
        const p: HouseholdProfile = {
          location: { ...loc, zipCode: formData.zipCode, city: formData.city },
          householdSize: formData.householdSize,
          income: { magi: formData.isUnemployed ? undefined : formData.magi, isUnemployed: formData.isUnemployed },
          utilityAccess: formData.utilityAccess,
          dietaryRestrictions: formData.dietaryRestrictions,
          mobilityLimitations: formData.mobilityLimitations,
        };
        setProfile(p);
        setResults(scoreAndRank(p));
        setPhase('results');
      } catch {
        setError('Something went wrong. Please try again.');
        setPhase('error');
      }
    }, 800);
  }

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        {phase === 'intake' && (
          <div className={styles.intakeWrapper}>
            <IntakeForm onSubmit={handleSubmit} />
          </div>
        )}
        {phase === 'loading' && <LoadingIndicator />}
        {phase === 'error' && <ErrorMessage message={error} onRetry={() => setPhase('intake')} />}
        {phase === 'results' && (
          <div className={styles.resultsLayout}>
            <div className={styles.resultsCol}>
              <ResultsPanel results={results} onBack={() => setPhase('intake')} />
            </div>
            {profile && (
              <div className={styles.mapCol}>
                <div style={{ background: '#e8f5e9', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', color: '#2d6a4f' }}>📍 Map view — showing {results.length} locations near {profile.location.zipCode || profile.location.city || 'your area'}</p>
                  <p style={{ fontSize: '0.85rem', color: '#777' }}>Interactive Leaflet map renders in production build</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <footer className={styles.footer}><p>Best Meal Match — Connecting families to food resources in MD/DC/VA</p></footer>
    </div>
  );
}
