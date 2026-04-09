import { MapPin, Clock, UtensilsCrossed, Users, Phone } from 'lucide-react';
import type { ScoredResource } from '../types/index';
import styles from './ResultCard.module.css';

interface ResultCardProps {
  result: ScoredResource;
  rank: number;
}

function getMatchColor(score: number): string {
  if (score >= 0.7) return '#2d6a4f';
  if (score >= 0.4) return '#e09f3e';
  return '#d35400';
}

function getMatchLabel(score: number): string {
  if (score >= 0.7) return '✅ Great Match';
  if (score >= 0.4) return '🟡 Good Match';
  return '🟠 Partial Match';
}

export default function ResultCard({ result, rank }: ResultCardProps) {
  const { resource, matchScore, distanceMiles } = result;

  return (
    <div className={styles.card} aria-label={`Match ${rank}: ${resource.organizationName}`}>
      <div className={styles.rankBadge} style={{ background: getMatchColor(matchScore) }}>
        #{rank}
      </div>
      <div className={styles.content}>
        <h3 className={styles.orgName}>{resource.organizationName}</h3>
        <div className={styles.matchBadge} style={{ color: getMatchColor(matchScore) }}>
          {getMatchLabel(matchScore)} ({Math.round(matchScore * 100)}%)
        </div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <MapPin size={16} aria-hidden="true" />
            <span>{resource.address}</span>
            <span className={styles.distance}>{distanceMiles.toFixed(1)} mi</span>
          </div>
          <div className={styles.detail}>
            <Clock size={16} aria-hidden="true" />
            <span>{resource.operatingHours || 'Hours not listed'}</span>
          </div>
          {resource.foodTypes.length > 0 && (
            <div className={styles.detail}>
              <UtensilsCrossed size={16} aria-hidden="true" />
              <div className={styles.tags}>
                {resource.foodTypes.map((ft) => (
                  <span key={ft} className={styles.tag}>{ft}</span>
                ))}
              </div>
            </div>
          )}
          {resource.eligibilityRequirements.length > 0 && (
            <div className={styles.detail}>
              <Users size={16} aria-hidden="true" />
              <span>{resource.eligibilityRequirements.join(', ')}</span>
            </div>
          )}
          {resource.contactInfo && (
            <div className={styles.detail}>
              <Phone size={16} aria-hidden="true" />
              <span>{resource.contactInfo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
