'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gridPattern}></div>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.title}>
            <span className={styles.titleMain}>Intelligence</span>
            <span className={styles.titleSub}>Dashboard</span>
          </div>
          <p className={styles.subtitle}>Choose your intelligence hub</p>
        </header>

        <div className={styles.hubsContainer}>
          <div 
            className={`${styles.hub} ${styles.hubSport}`}
            onClick={() => router.push('/sport-business')}
          >
            <div className={styles.hubIcon}>🏆</div>
            <h2 className={styles.hubTitle}>Sport Business</h2>
            <p className={styles.hubDescription}>
              Global sports industry intelligence, media rights, esports, and market trends
            </p>
            <div className={styles.hubStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>27+</span>
                <span className={styles.statLabel}>Sources</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>5</span>
                <span className={styles.statLabel}>Regions</span>
              </div>
            </div>
            <div className={styles.hubButton}>
              Enter Hub →
            </div>
          </div>

          <div 
            className={`${styles.hub} ${styles.hubSpace}`}
            onClick={() => router.push('/spatial')}
          >
            <div className={styles.hubIcon}>🚀</div>
            <h2 className={styles.hubTitle}>Spatial</h2>
            <p className={styles.hubDescription}>
              Space industry news, upcoming launches, missions, and aerospace innovation
            </p>
            <div className={styles.hubStats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>5+</span>
                <span className={styles.statLabel}>Sources</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>Live</span>
                <span className={styles.statLabel}>Launches</span>
              </div>
            </div>
            <div className={styles.hubButton}>
              Enter Hub →
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>Powered by AI-driven intelligence gathering</p>
        </footer>
      </div>
    </div>
  );
}
