'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, AlertTriangle, Satellite, Radio, ChevronRight, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './SpatialDashboard.module.css';
import UpcomingLaunches from './UpcomingLaunches';

export default function SpatialDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    agency: 'all',
    mission: 'all',
    priority: 'all',
    search: ''
  });

  useEffect(() => {
    fetch('/api/articles-space')
      .then(res => res.json())
      .then(data => {
        // Verify data is an array before setting state
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.error('[v0] API returned non-array data:', data);
          setArticles([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('[v0] Failed to fetch articles:', err);
        setArticles([]);
        setLoading(false);
      });
  }, []);

  // Safety check: ensure articles is an array before mapping
  const uniqueAgencies = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.agency) : [])];
  const uniqueMissions = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.mission) : [])];
  const uniquePriorities = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.priority) : [])];

  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const matchesAgency = filters.agency === 'all' || article.agency === filters.agency;
    const matchesMission = filters.mission === 'all' || article.mission === filters.mission;
    const matchesPriority = filters.priority === 'all' || article.priority === filters.priority;
    const matchesSearch = filters.search === '' ||
      article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(filters.search.toLowerCase()));
    return matchesAgency && matchesMission && matchesPriority && matchesSearch;
  }) : [];

  const highPriorityCount = filteredArticles.filter(a =>
    a.priority.includes('High') || a.priority.includes('\uD83D\uDD34')
  ).length;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingPulse} />
          <span className={styles.loadingText}>ACQUIRING TELEMETRY...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => router.push('/')}>
          <ArrowLeft size={16} />
          <span>INTEL HQ</span>
        </button>
        <div className={styles.topTitle}>
          <span className={styles.topLabel}>MODULE_02</span>
          <h1 className={styles.topName}>SPATIAL OPS</h1>
        </div>
        <div className={styles.topIndicator}>
          <span className={styles.liveDot} />
          TRACKING
        </div>
      </header>

      <div className={styles.container}>
        {/* Stats row */}
        <div className={styles.statsRow}>
          <div className={`${styles.statCard} ${styles.statCyan}`}>
            <Satellite size={18} strokeWidth={1.5} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>ARTICLES</span>
              <span className={styles.statValue}>{filteredArticles.length}</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statRed}`}>
            <AlertTriangle size={18} strokeWidth={1.5} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>HIGH PRIORITY</span>
              <span className={styles.statValue}>{highPriorityCount}</span>
            </div>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <Radio size={18} strokeWidth={1.5} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>SOURCES</span>
              <span className={styles.statValue}>5</span>
            </div>
          </div>
        </div>

        {/* Mission Control - Launch Tracker */}
        <UpcomingLaunches />

        {/* Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search space intel..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <button
            className={`${styles.filterToggle} ${showFilters ? styles.filterActive : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            <span>FILTERS</span>
          </button>
        </div>

        {showFilters && (
          <div className={styles.filtersPanel}>
            <FilterChips label="Agency" options={uniqueAgencies} active={filters.agency} onChange={(val) => setFilters({ ...filters, agency: val })} />
            <FilterChips label="Mission Type" options={uniqueMissions} active={filters.mission} onChange={(val) => setFilters({ ...filters, mission: val })} />
            <FilterChips label="Priority" options={uniquePriorities} active={filters.priority} onChange={(val) => setFilters({ ...filters, priority: val })} />
          </div>
        )}

        {/* Section label */}
        <div className={styles.sectionLabel}>
          <span className={styles.sectionLine} />
          <span className={styles.sectionText}>SPACE INTEL // {filteredArticles.length} RESULTS</span>
          <span className={styles.sectionLine} />
        </div>

        {/* Articles Grid */}
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article, idx) => (
            <SpaceArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className={styles.noResults}>
            <Rocket size={24} />
            <span>No articles match current filters.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.sysFooter}>
        <span className={styles.sysStatus}>
          <span className={styles.sysDot} />
          SYS: OPERATIONAL
        </span>
      </footer>
    </div>
  );
}

function FilterChips({ label, options, active, onChange }) {
  return (
    <div className={styles.chipSection}>
      <span className={styles.chipLabel}>{label}</span>
      <div className={styles.chipRow}>
        {options.map(option => (
          <button
            key={option}
            className={`${styles.chip} ${active === option ? styles.chipActive : ''}`}
            onClick={() => onChange(option)}
          >
            {option === 'all' ? 'All' : option}
          </button>
        ))}
      </div>
    </div>
  );
}

function SpaceArticleCard({ article, index }) {
  const isHigh = article.priority.includes('High') || article.priority.includes('\uD83D\uDD34');
  const isMedium = article.priority.includes('Medium') || article.priority.includes('\uD83D\uDFE1');
  const priorityClass = isHigh ? styles.prioHigh : isMedium ? styles.prioMedium : styles.prioLow;
  const priorityText = isHigh ? 'HIGH' : isMedium ? 'MED' : 'LOW';

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.articleLink}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <article className={`${styles.articleCard} ${isHigh ? styles.articleHigh : ''}`}>
        <div className={styles.articleTop}>
          <div className={`${styles.prioBadge} ${priorityClass}`}>
            {isHigh && <AlertTriangle size={10} />}
            {priorityText}
          </div>
          <span className={styles.articleAgency}>{article.agency}</span>
        </div>
        <span className={styles.articleDate}>{article.date}</span>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        {article.description && (
          <p className={styles.articleDesc}>{article.description}</p>
        )}
        <div className={styles.articleMeta}>
          <span className={styles.metaMission}>{article.mission}</span>
          <span className={styles.metaTopic}>{article.topic}</span>
        </div>
        <div className={styles.articleAction}>
          <span>READ INTEL</span>
          <ChevronRight size={14} />
        </div>
      </article>
    </a>
  );
}
