'use client';

import { useState, useEffect } from 'react';
import { Crosshair, ExternalLink, MapPin, Building2, RocketIcon, Clock, CheckCircle, XCircle, AlertCircle, Satellite } from 'lucide-react';
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

  const isConstellation = (launch) => {
    const name = launch.name.toLowerCase();
    const keywords = ['starlink', 'oneweb', 'group', 'batch', 'rideshare', 'transporter', 'dedicated', 'smallsat'];
    return keywords.some(kw => name.includes(kw));
  };

  const priorityLaunches = launches.filter(l => !isConstellation(l)).slice(0, 4);
  const constellationLaunches = launches.filter(isConstellation).slice(0, 3);

  if (loading) {
    return (
      <div className={styles.missionControl}>
        <div className={styles.mcHeader}>
          <Crosshair size={16} strokeWidth={1.5} />
          <span>MISSION CONTROL</span>
          <span className={styles.mcSub}>// LOADING TELEMETRY...</span>
        </div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingFill} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.missionControl}>
      {/* MC Header */}
      <div className={styles.mcHeader}>
        <Crosshair size={16} strokeWidth={1.5} />
        <span className={styles.mcTitle}>MISSION CONTROL</span>
        <span className={styles.mcSub}>// LAUNCH TRACKER</span>
        <div className={styles.mcBadges}>
          <span className={styles.mcBadge}>
            {priorityLaunches.length} MAJOR
          </span>
          {constellationLaunches.length > 0 && (
            <span className={styles.mcBadgeSecondary}>
              {constellationLaunches.length} CONSTELLATION
            </span>
          )}
        </div>
      </div>

      {/* Primary launch - featured with countdown */}
      {priorityLaunches.length > 0 && (
        <FeaturedLaunch launch={priorityLaunches[0]} />
      )}

      {/* Other launches grid */}
      {priorityLaunches.length > 1 && (
        <div className={styles.launchGrid}>
          {priorityLaunches.slice(1).map(launch => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </div>
      )}

      {/* Constellation section */}
      {constellationLaunches.length > 0 && (
        <div className={styles.constellationSection}>
          <div className={styles.constellationHeader}>
            <Satellite size={14} strokeWidth={1.5} />
            <span>CONSTELLATION DEPLOYMENTS</span>
          </div>
          <div className={styles.constellationList}>
            {constellationLaunches.map(launch => (
              <ConstellationRow key={launch.id} launch={launch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedLaunch({ launch }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(launch.date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsPast(true);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [launch.date]);

  const getStatusIcon = () => {
    const s = (launch.status || '').toLowerCase();
    if (s.includes('go')) return <CheckCircle size={12} />;
    if (s.includes('tbd') || s.includes('tbc')) return <AlertCircle size={12} />;
    if (s.includes('failure') || s.includes('scrub')) return <XCircle size={12} />;
    return <Clock size={12} />;
  };

  const getStatusClass = () => {
    const s = (launch.status || '').toLowerCase();
    if (s.includes('go')) return styles.statusGo;
    if (s.includes('tbd') || s.includes('tbc')) return styles.statusTbd;
    return styles.statusDefault;
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={styles.featured}>
      {launch.image && (
        <div className={styles.featuredImage}>
          <img src={launch.image} alt={launch.name} crossOrigin="anonymous" />
          <div className={styles.featuredOverlay} />
        </div>
      )}
      <div className={styles.featuredContent}>
        {/* Countdown */}
        <div className={styles.countdownSection}>
          <span className={styles.countdownLabel}>
            {isPast ? 'LAUNCH WINDOW PASSED' : 'T-MINUS'}
          </span>
          {!isPast && (
            <div className={styles.countdownDigits}>
              <div className={styles.digit}>
                <span className={styles.digitValue}>{pad(countdown.days)}</span>
                <span className={styles.digitLabel}>DAYS</span>
              </div>
              <span className={styles.digitSep}>:</span>
              <div className={styles.digit}>
                <span className={styles.digitValue}>{pad(countdown.hours)}</span>
                <span className={styles.digitLabel}>HRS</span>
              </div>
              <span className={styles.digitSep}>:</span>
              <div className={styles.digit}>
                <span className={styles.digitValue}>{pad(countdown.minutes)}</span>
                <span className={styles.digitLabel}>MIN</span>
              </div>
              <span className={styles.digitSep}>:</span>
              <div className={styles.digit}>
                <span className={`${styles.digitValue} ${styles.digitSeconds}`}>{pad(countdown.seconds)}</span>
                <span className={styles.digitLabel}>SEC</span>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className={`${styles.statusTag} ${getStatusClass()}`}>
          {getStatusIcon()}
          <span>{launch.status || 'PENDING'}</span>
        </div>

        <h3 className={styles.featuredName}>{launch.name}</h3>

        <div className={styles.featuredMeta}>
          <div className={styles.metaRow}>
            <RocketIcon size={12} />
            <span className={styles.metaKey}>VEHICLE</span>
            <span className={styles.metaVal}>{launch.rocket}</span>
          </div>
          <div className={styles.metaRow}>
            <Building2 size={12} />
            <span className={styles.metaKey}>PROVIDER</span>
            <span className={styles.metaVal}>{launch.agency}</span>
          </div>
          <div className={styles.metaRow}>
            <MapPin size={12} />
            <span className={styles.metaKey}>SITE</span>
            <span className={styles.metaVal}>{launch.location}</span>
          </div>
        </div>

        {launch.livestream && (
          <a
            href={launch.livestream}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.watchBtn}
          >
            <ExternalLink size={14} />
            WATCH LIVE
          </a>
        )}
      </div>
    </div>
  );
}

function LaunchCard({ launch }) {
  const launchDate = new Date(launch.date);
  const now = new Date();
  const daysUntil = Math.ceil((launchDate - now) / (1000 * 60 * 60 * 24));

  const formatDate = () => {
    return launchDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }) + ' UTC';
  };

  return (
    <div className={styles.launchCard}>
      <div className={styles.lcTop}>
        <span className={styles.lcCountdown}>
          {daysUntil > 0 ? `T-${daysUntil}d` : daysUntil === 0 ? 'TODAY' : 'PASSED'}
        </span>
        <span className={styles.lcDate}>{formatDate()}</span>
      </div>
      <h4 className={styles.lcName}>{launch.name}</h4>
      <div className={styles.lcMeta}>
        <span>{launch.rocket}</span>
        <span className={styles.lcDot} />
        <span>{launch.agency}</span>
      </div>
      <div className={styles.lcLocation}>
        <MapPin size={10} />
        <span>{launch.location}</span>
      </div>
      {launch.livestream && (
        <a
          href={launch.livestream}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.lcWatch}
        >
          <ExternalLink size={12} />
          STREAM
        </a>
      )}
    </div>
  );
}

function ConstellationRow({ launch }) {
  const launchDate = new Date(launch.date);
  const now = new Date();
  const daysUntil = Math.ceil((launchDate - now) / (1000 * 60 * 60 * 24));

  return (
    <div className={styles.constRow}>
      <span className={styles.constCountdown}>
        {daysUntil > 0 ? `T-${daysUntil}d` : 'NOW'}
      </span>
      <span className={styles.constName}>{launch.name}</span>
      <span className={styles.constInfo}>{launch.rocket}</span>
      <span className={styles.constInfo}>{launch.agency}</span>
      {launch.livestream && (
        <a href={launch.livestream} target="_blank" rel="noopener noreferrer" className={styles.constLink}>
          <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}
