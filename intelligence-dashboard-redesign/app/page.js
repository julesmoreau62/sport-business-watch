'use client';

import { useRouter } from 'next/navigation';
import { Trophy, Rocket, Radio, Globe, Cpu, ChevronRight, Activity } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Scanline effect */}
      <div className={styles.scanline} aria-hidden="true" />

      <div className={styles.content}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLine}>
            <div className={styles.sysTag}>
              <Cpu size={12} />
              <span>SYS.INIT</span>
            </div>
            <div className={styles.headerDivider} />
            <span className={styles.headerTimestamp}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
          <h1 className={styles.title}>INTEL DASHBOARD</h1>
          <p className={styles.subtitle}>{'// SELECT INTELLIGENCE HUB'}</p>
        </header>

        {/* Bento Grid */}
        <div className={styles.bentoGrid}>
          {/* Sport Business Hub - Large */}
          <div
            className={`${styles.bentoCard} ${styles.cardSport}`}
            onClick={() => router.push('/sport-business')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/sport-business')}
          >
            <div className={styles.cardGlow} />
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <Trophy size={28} strokeWidth={1.5} />
              </div>
              <div className={styles.cardLabel}>MODULE_01</div>
              <h2 className={styles.cardTitle}>Sport Business</h2>
              <p className={styles.cardDesc}>
                Global sports industry intelligence. Media rights, esports, financial markets & strategic trends.
              </p>
              <div className={styles.cardStats}>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>27+</span>
                  <span className={styles.statLabel}>Sources</span>
                </div>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>5</span>
                  <span className={styles.statLabel}>Regions</span>
                </div>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>Live</span>
                  <span className={styles.statLabel}>Feed</span>
                </div>
              </div>
              <div className={styles.cardAction}>
                <span>ENTER HUB</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Spatial Hub - Large */}
          <div
            className={`${styles.bentoCard} ${styles.cardSpace}`}
            onClick={() => router.push('/spatial')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push('/spatial')}
          >
            <div className={styles.cardGlow} />
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <Rocket size={28} strokeWidth={1.5} />
              </div>
              <div className={styles.cardLabel}>MODULE_02</div>
              <h2 className={styles.cardTitle}>Spatial</h2>
              <p className={styles.cardDesc}>
                Space industry tracking. Upcoming launches, missions, aerospace innovation & orbital operations.
              </p>
              <div className={styles.cardStats}>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>5+</span>
                  <span className={styles.statLabel}>Sources</span>
                </div>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>Live</span>
                  <span className={styles.statLabel}>Launches</span>
                </div>
                <div className={styles.statBlock}>
                  <span className={styles.statNum}>24/7</span>
                  <span className={styles.statLabel}>Tracking</span>
                </div>
              </div>
              <div className={styles.cardAction}>
                <span>ENTER HUB</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Mini status cards */}
          <div className={`${styles.bentoMini} ${styles.miniOrange}`}>
            <Radio size={18} strokeWidth={1.5} />
            <div className={styles.miniContent}>
              <span className={styles.miniLabel}>SIGNAL</span>
              <span className={styles.miniValue}>ACTIVE</span>
            </div>
            <div className={styles.miniDot} />
          </div>

          <div className={`${styles.bentoMini} ${styles.miniCyan}`}>
            <Globe size={18} strokeWidth={1.5} />
            <div className={styles.miniContent}>
              <span className={styles.miniLabel}>COVERAGE</span>
              <span className={styles.miniValue}>GLOBAL</span>
            </div>
          </div>

          <div className={`${styles.bentoMini} ${styles.miniNeutral}`}>
            <Activity size={18} strokeWidth={1.5} />
            <div className={styles.miniContent}>
              <span className={styles.miniLabel}>UPTIME</span>
              <span className={styles.miniValue}>99.9%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerLine} />
          <div className={styles.footerContent}>
            <span className={styles.footerStatus}>
              <span className={styles.statusDot} />
              SYS: OPERATIONAL
            </span>
            <span className={styles.footerVersion}>v2.0 // Gotham Protocol</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
