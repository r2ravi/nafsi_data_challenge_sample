import { useState } from 'react';
import { MapPin, Users, DollarSign, Flame, Salad, Bus } from 'lucide-react';
import type { IntakeFormData, UtilityAccess } from '../types/index';
import styles from './IntakeForm.module.css';

interface IntakeFormProps {
  onSubmit: (data: IntakeFormData) => void;
  isLoading?: boolean;
}

export default function IntakeForm({ onSubmit, isLoading }: IntakeFormProps) {
  const [location, setLocation] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [magi, setMagi] = useState('');
  const [isUnemployed, setIsUnemployed] = useState(false);
  const [utilityAccess, setUtilityAccess] = useState<UtilityAccess>('oven-stove');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [mobilityLimitations, setMobilityLimitations] = useState<string[]>([]);
  const [error, setError] = useState('');

  const dietaryOptions = ['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'];
  const mobilityOptions = ['No car', 'Public transit only', 'Wheelchair accessible'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!location.trim()) {
      setError('Please enter a zip code or city');
      return;
    }

    const isZip = /^\d{5}$/.test(location.trim());
    const formData: IntakeFormData = {
      zipCode: isZip ? location.trim() : undefined,
      city: isZip ? undefined : location.trim(),
      householdSize: householdSize ? parseInt(householdSize, 10) : undefined,
      magi: !isUnemployed && magi ? parseFloat(magi) : undefined,
      isUnemployed,
      utilityAccess,
      dietaryRestrictions: dietaryRestrictions.length > 0 ? dietaryRestrictions : undefined,
      mobilityLimitations: mobilityLimitations.length > 0 ? mobilityLimitations : undefined,
    };

    onSubmit(formData);
  }

  function toggleDietary(option: string) {
    setDietaryRestrictions((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    );
  }

  function toggleMobility(option: string) {
    setMobilityLimitations((prev) =>
      prev.includes(option) ? prev.filter((m) => m !== option) : [...prev, option]
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label="Find food assistance">
      {/* Location — required */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="location">
          <MapPin size={20} aria-hidden="true" />
          <span>Zip Code or City *</span>
        </label>
        <input
          id="location"
          className={styles.input}
          type="text"
          placeholder="e.g. 20742 or College Park"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-required="true"
        />
        {error && <p className={styles.error} role="alert">{error}</p>}
      </div>

      {/* Household Size */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="householdSize">
          <Users size={20} aria-hidden="true" />
          <span>Household Size</span>
        </label>
        <input
          id="householdSize"
          className={styles.input}
          type="number"
          min="1"
          max="20"
          placeholder="e.g. 4"
          value={householdSize}
          onChange={(e) => setHouseholdSize(e.target.value)}
        />
      </div>

      {/* Income / Unemployed */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="magi">
          <DollarSign size={20} aria-hidden="true" />
          <span>Annual Income (MAGI)</span>
        </label>
        <input
          id="magi"
          className={styles.input}
          type="number"
          min="0"
          placeholder="e.g. 25000"
          value={magi}
          onChange={(e) => setMagi(e.target.value)}
          disabled={isUnemployed}
        />
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isUnemployed}
            onChange={(e) => setIsUnemployed(e.target.checked)}
          />
          <span>Unemployed</span>
        </label>
      </div>

      {/* Utility Access */}
      <div className={styles.fieldGroup}>
        <span className={styles.label}>
          <Flame size={20} aria-hidden="true" />
          <span>Kitchen Access</span>
        </span>
        <div className={styles.radioGroup} role="radiogroup" aria-label="Kitchen access level">
          {([
            { value: 'oven-stove', label: '🍳 Oven/Stove', emoji: true },
            { value: 'microwave-only', label: '📦 Microwave Only', emoji: true },
            { value: 'none', label: '❌ No Kitchen', emoji: true },
          ] as const).map((opt) => (
            <label key={opt.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="utilityAccess"
                value={opt.value}
                checked={utilityAccess === opt.value}
                onChange={() => setUtilityAccess(opt.value)}
              />
              <span className={styles.radioText}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className={styles.fieldGroup}>
        <span className={styles.label}>
          <Salad size={20} aria-hidden="true" />
          <span>Dietary Needs</span>
        </span>
        <div className={styles.chipGroup}>
          {dietaryOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${styles.chip} ${dietaryRestrictions.includes(opt) ? styles.chipActive : ''}`}
              onClick={() => toggleDietary(opt)}
              aria-pressed={dietaryRestrictions.includes(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Mobility */}
      <div className={styles.fieldGroup}>
        <span className={styles.label}>
          <Bus size={20} aria-hidden="true" />
          <span>Transportation</span>
        </span>
        <div className={styles.chipGroup}>
          {mobilityOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${styles.chip} ${mobilityLimitations.includes(opt) ? styles.chipActive : ''}`}
              onClick={() => toggleMobility(opt)}
              aria-pressed={mobilityLimitations.includes(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isLoading}>
        {isLoading ? '🔍 Searching...' : '🔍 Find My Best Matches'}
      </button>
    </form>
  );
}
