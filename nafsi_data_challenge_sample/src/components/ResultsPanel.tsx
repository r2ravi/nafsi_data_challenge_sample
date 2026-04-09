import { SearchX } from 'lucide-react';
import type { ScoredResource } from '../types/index';
import ResultCard from './ResultCard';
import styles from './ResultsPanel.module.css';

interface ResultsPanelProps {
  results: ScoredResource[];
  onBack: () => void;
}

export default function ResultsPanel({ results, onBack }: ResultsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>🎯 Your Top Matches</h2>
        <button className={styles.backBtn} onClick={onBack} aria-label="Search again">
          ← New Search
        </button>
      </div>

      {results.length === 0 ? (
        <div className={styles.empty}>
          <SearchX size={48} aria-hidden="true" />
          <p>No matches found.</p>
          <p className={styles.suggestion}>
            Try a different zip code or adjust your optional filters.
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {results.map((result, i) => (
            <ResultCard key={result.resource.id} result={result} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
