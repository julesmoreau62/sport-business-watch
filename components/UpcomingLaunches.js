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

  // Fonction pour détecter si c'est un déploiement de constellation
  const isConstellation = (launch) => {
    const name = launch.name.toLowerCase();
    const constellationKeywords = [
      'starlink', 'oneweb', 'group', 'batch', 'rideshare', 
      'transporter', 'dedicated', 'smallsat'
    ];
    return constellationKeywords.some(keyword => name.includes(keyword));
  };

  // Fonction pour détecter si c'est un lancement prioritaire
  const isPriority = (launch) => {
    const name = launch.name.toLowerCase();
    const mission = (launch.mission || '').toLowerCase();
    
    const priorityKeywords = [
      'maiden', 'test flight', 'flight 1', 'first flight',
      'artemis', 'orion', 'sls', 'gateway', 'lunar',
      'mars', 'europa', 'titan', 'psyche',
      'crew', 'crewed', 'astronaut', 'iss',
      'demo', 'prototype', 'experimental'
    ];
    
    return priorityKeywords.some(keyword => 
      name.includes(keyword) || mission.includes(keyword)
    );
  };

  // Séparer les lancements
  const priorityLaunches = launches.filter(launch => !isConstellation(launch));
  const constellationLaunches = launches.filter(isConstellation);

  // Afficher les 6 premiers lancements prioritaires
  const displayedPriority = priorityLaunches.slice(0, 6);
  const displayedConstellations = constellationLaunches.slice(0, 3);

  if (loading) {
    return <div className={styles.loading}>Loading upcoming launches...</div>;
  }

  return (
    <div className={styles.launchesSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>🚀 Upcoming Launches</h2>
        <div className={styles.launchCount}>
          <span className={styles.priorityCount}>{displayedPriority.length} Major</span>
          {displayedConstellations.length > 0 && (
            <span className={styles.constellationCount}>
              {displayedConstellations.length} Constellation
            </span>
          )}
        </div>
      </div>
      
      {/* Lancements prioritaires */}
      <div className={styles.launchesGrid}>
        {displayedPriority.map(launch => (
          <LaunchCard key={launch.id} launch={launch} isPriority={isPriority(launch)} />
        ))}
      </div>

      {/* Section constellations (petite) */}
      {displayedConstellations.length > 0 && (
        <div className={styles.constellationSection}>
          <h3 className={styles.constellationTitle}>
            📡 Constellation Deployments
          </h3>
          <div className={styles.constellationGrid}>
            {displayedConstellations.map(launch => (
              <ConstellationCard key={launch.id} launch={launch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LaunchCard({ launch, isPriority }) {
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
    <div className={`${styles.launchCard} ${isPriority ? styles.priorityCard : ''}`}>
      {isPriority && <div className={styles.priorityBadge}>⭐ Priority Mission</div>}
      
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

function ConstellationCard({ launch }) {
  const launchDate = new Date(launch.date);
  const now = new Date();
  const daysUntil = Math.ceil((launchDate - now) / (1000 * 60 * 60 * 24));
  
  const formatDate = () => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return launchDate.toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles.constellationCard}>
      <div className={styles.constellationHeader}>
        <div className={styles.constellationCountdown}>
          {daysUntil > 0 ? (
            <span>T-{daysUntil}d</span>
          ) : (
            <span className={styles.today}>TODAY</span>
          )}
        </div>
        <span className={styles.constellationDate}>{formatDate()}</span>
      </div>
      <h4 className={styles.constellationName}>{launch.name}</h4>
      <div className={styles.constellationInfo}>
        <span>{launch.rocket}</span>
        <span>•</span>
        <span>{launch.agency}</span>
      </div>
      {launch.livestream && (
        <a 
          href={launch.livestream} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.constellationLink}
        >
          Watch →
        </a>
      )}
    </div>
  );
}
