import { UtensilsCrossed, Home } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <UtensilsCrossed size={32} aria-hidden="true" />
        <h1 className={styles.title}>Best Meal Match</h1>
        <Home size={28} aria-hidden="true" />
      </div>
      <p className={styles.tagline}>🍎 Find food near you</p>
    </header>
  );
}
