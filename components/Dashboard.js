'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, AlertTriangle, TrendingUp, Globe, Newspaper, ChevronRight, MapPin, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Dashboard.module.css';

const SOURCE_REGIONS = {
  'North America': { count: 8, color: 'var(--accent-orange)' },
  'Europe': { count: 7, color: 'var(--accent-orange)' },
  'Asia-Pacific': { count: 5, color: 'var(--accent-cyan)' },
  'Middle East & Africa': { count: 4, color: 'var(--accent-cyan)' },
  'Latin America': { count: 3, color: 'var(--text-secondary)' },
};

export default function Dashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: 'all',
    sport: 'all',
    topic: 'all',
    priority: 'all',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/api/articles-sport')
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
  const uniqueRegions = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.region) : [])];
  const uniqueSports = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.sport) : [])];
  const uniqueTopics = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.topic) : [])];
  const uniquePriorities = ['all', ...new Set(Array.isArray(articles) ? articles.map(a => a.priority) : [])];

  const filteredArticles = Array.isArray(articles) ? articles.filter(article => {
    const matchesRegion = filters.region === 'all' || article.region === filters.region;
    const matchesSport = filters.sport === 'all' || article.sport === filters.sport;
    const matchesTopic = filters.topic === 'all' || article.topic === filters.topic;
    const matchesPriority = filters.priority === 'all' || article.priority === filters.priority;
    const matchesSearch = filters.search === '' ||
      article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (article.description && article.description.toLowerCase().includes(filters.search.toLowerCase()));
    return matchesRegion && matchesSport && matchesTopic && matchesPriority && matchesSearch;
  }) : [];

  const highPriorityCount = filteredArticles.filter(a =>
    a.priority.includes('High') || a.priority.includes('\uD83D\uDD34')
  ).length;

  const topicCounts = {};
  if (Array.isArray(articles)) {
    articles.forEach(article => {
      if (article.topic) {
        topicCounts[article.topic] = (topicCounts[article.topic] || 0) + 1;
      }
    });
  }
  const trendingTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingPulse} />
          <span className={styles.loadingText}>FETCHING INTEL...</span>
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
          <span className={styles.topLabel}>MODULE_01</span>
          <h1 className={styles.topName}>SPORT BUSINESS</h1>
        </div>
        <div className={styles.topIndicator}>
          <span className={styles.liveDot} />
          LIVE
        </div>
      </header>

      <div className={styles.container}>
        {/* Bento Stats Grid */}
        <div className={styles.bentoStats}>
          {/* Stats cards */}
          <div className={`${styles.statCard} ${styles.statOrange}`}>
            <Newspaper size={18} strokeWidth={1.5} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>ARTICLES</span>
              <span className={styles.statValue}>{filteredArticles.length}</span>
            </div>
            <span className={styles.statSub}>{articles.length} total</span>
          </div>

          <div className={`${styles.statCard} ${styles.statRed}`}>
            <AlertTriangle size={18} strokeWidth={1.5} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>HIGH PRIORITY</span>
              <span className={styles.statValue}>{highPriorityCount}</span>
            </div>
            <span className={styles.statSub}>
              {filteredArticles.length > 0 ? Math.round((highPriorityCount / filteredArticles.length) * 100) : 0}% of feed
            </span>
          </div>

          <div className={`${styles.statCard} ${styles.statCyan}`}>
            <Globe size={18} strokeWidth={1.5} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>SOURCES</span>
              <span className={styles.statValue}>27</span>
            </div>
            <span className={styles.statSub}>5 regions</span>
          </div>

          {/* Source Distribution Module */}
          <div className={styles.sourceModule}>
            <div className={styles.sourceHeader}>
              <BarChart3 size={16} strokeWidth={1.5} />
              <span>SOURCE DISTRIBUTION</span>
            </div>
            <div className={styles.sourceList}>
              {Object.entries(SOURCE_REGIONS).map(([region, data]) => (
                <div key={region} className={styles.sourceRow}>
                  <span className={styles.sourceRegion}>{region}</span>
                  <div className={styles.sourceBarTrack}>
                    <div
                      className={styles.sourceBar}
                      style={{
                        width: `${(data.count / 8) * 100}%`,
                        background: data.color
                      }}
                    />
                  </div>
                  <span className={styles.sourceCount}>{data.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          {trendingTopics.length > 0 && (
            <div className={styles.trendingModule}>
              <div className={styles.trendingHeader}>
                <TrendingUp size={16} strokeWidth={1.5} />
                <span>TRENDING</span>
              </div>
              <div className={styles.trendingList}>
                {trendingTopics.map(([topic, count], idx) => (
                  <button
                    key={topic}
                    className={`${styles.trendingTag} ${idx === 0 ? styles.trendingHot : ''}`}
                    onClick={() => setFilters({ ...filters, topic })}
                  >
                    <span className={styles.trendingName}>{topic}</span>
                    <span className={styles.trendingCount}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className={styles.filtersBar}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search intelligence feed..."
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
            <FilterChips label="Region" options={uniqueRegions} active={filters.region} onChange={(val) => setFilters({ ...filters, region: val })} />
            <FilterChips label="Priority" options={uniquePriorities} active={filters.priority} onChange={(val) => setFilters({ ...filters, priority: val })} />
            <div className={styles.filterDropdowns}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Topic</label>
                <select className={styles.dropdown} value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })}>
                  <option value="all">All Topics</option>
                  {uniqueTopics.filter(t => t !== 'all').map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Sport</label>
                <select className={styles.dropdown} value={filters.sport} onChange={(e) => setFilters({ ...filters, sport: e.target.value })}>
                  <option value="all">All Sports</option>
                  {uniqueSports.filter(s => s !== 'all').map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section label */}
        <div className={styles.sectionLabel}>
          <span className={styles.sectionLine} />
          <span className={styles.sectionText}>INTEL FEED // {filteredArticles.length} RESULTS</span>
          <span className={styles.sectionLine} />
        </div>

        {/* Articles Bento Grid */}
        <div className={styles.articlesGrid}>
          {filteredArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className={styles.noResults}>
            <AlertTriangle size={24} />
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

function ArticleCard({ article, index }) {
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
          <span className={styles.articleDate}>{article.date}</span>
        </div>
        <h3 className={styles.articleTitle}>{article.title}</h3>
        {article.description && (
          <p className={styles.articleDesc}>{article.description}</p>
        )}
        <div className={styles.articleMeta}>
          <span className={styles.metaTag}>{article.topic}</span>
          <span className={styles.metaSport}>{article.sport}</span>
          <span className={styles.metaRegion}>
            <MapPin size={10} />
            {article.region}
          </span>
        </div>
        <div className={styles.articleAction}>
          <span>READ INTEL</span>
          <ChevronRight size={14} />
        </div>
      </article>
    </a>
  );
}
