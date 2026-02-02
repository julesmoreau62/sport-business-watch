import { useState, useEffect } from 'react';
import styles from './UpcomingLaunches.module.css';

export default function UpcomingLaunches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/launches')
      .then(res => res.json())
      .then(data => {
        setLaunches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch launches:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading upcoming launches...</div>;
  }

  return (
    <div className={styles.launchesSection}>
      <h2 className={styles.sectionTitle}>🚀 Upcoming Launches</h2>
      <div className={styles.launchesGrid}>
        {launches.slice(0, 5).map(launch => (
          <LaunchCard key={launch.id} launch={launch} />
        ))}
      </div>
    </div>
  );
}

function LaunchCard({ launch }) {
  const launchDate = new Date(launch.date);
  const now = new Date();
  const daysUntil = Math.ceil((launchDate - now) / (1000 * 60 * 60 * 24));
  
  const formatDate = () => {
    const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    };
    return launchDate.toLocaleDateString('en-US', options) + ' UTC';
  };

  return (
    <div className={styles.launchCard}>
      {launch.image && (
        <div className={styles.launchImage}>
          <img src={launch.image} alt={launch.name} />
        </div>
      )}
      
      <div className={styles.launchContent}>
        <div className={styles.countdown}>
          {daysUntil > 0 ? (
            <span className={styles.daysCount}>T-{daysUntil} days</span>
          ) : daysUntil === 0 ? (
            <span className={styles.today}>🔴 TODAY</span>
          ) : (
            <span className={styles.past}>Passed</span>
          )}
        </div>

        <h3 className={styles.launchName}>{launch.name}</h3>
        
        <div className={styles.launchMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Rocket</span>
            <span className={styles.metaValue}>{launch.rocket}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Agency</span>
            <span className={styles.metaValue}>{launch.agency}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Location</span>
            <span className={styles.metaValue}>{launch.location}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Date</span>
            <span className={styles.metaValue}>{formatDate()}</span>
          </div>
        </div>

        {launch.livestream && (
          <a 
            href={launch.livestream} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.watchButton}
          >
            📺 Watch Live
          </a>
        )}
      </div>
    </div>
  );
}
