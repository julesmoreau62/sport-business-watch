'use client';

import { useState, useEffect } from 'react';
import styles from './SpatialDashboard.module.css';
import UpcomingLaunches from './UpcomingLaunches';

export default function SpatialDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch articles:', err);
        setLoading(false);
      });
  }, []);

  const uniqueAgencies = ['all', ...new Set(articles.map(a => a.agency))];
  const uniqueMissions = ['all', ...new Set(articles.map(a => a.mission))];
  const uniquePriorities = ['all', ...new Set(articles.map(a => a.priority))];

  const filteredArticles = articles.filter(article => {
    const matchesAgency = filters.agency === 'all' || article.agency === filters.agency;
    const matchesMission = filters.mission === 'all' || article.mission === filters.mission;
    const matchesPriority = filters.priority === 'all' || article.priority === filters.priority;
    const matchesSearch = filters.search === '' || 
      article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      article.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesAgency && matchesMission && matchesPriority && matchesSearch;
  });

  const highPriorityCount = filteredArticles.filter(a => 
    a.priority.includes('High') || a.priority.includes('🔴')
  ).length;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading articles...</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.gradientBg} />
      
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>🚀</div>
              <h1>Spatial Watch</h1>
            </div>
            <div className={styles.headerStats}>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Articles</div>
                <div className={styles.statValue}>{filteredArticles.length}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>High Priority</div>
                <div className={styles.statValue}>{highPriorityCount}</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statLabel}>Sources</div>
                <div className={styles.statValue}>5</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <UpcomingLaunches />

        <div className={styles.filters}>
          <FilterSection
            label="Agency"
            options={uniqueAgencies}
            active={filters.agency}
            onChange={(val) => setFilters({...filters, agency: val})}
          />
          
          <FilterSection
            label="Mission Type"
            options={uniqueMissions}
            active={filters.mission}
            onChange={(val) => setFilters({...filters, mission: val})}
          />
          
          <FilterSection
            label="Priority"
            options={uniquePriorities}
            active={filters.priority}
            onChange={(val) => setFilters({...filters, priority: val})}
          />
          
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.articlesGrid}>
          {filteredArticles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className={styles.noResults}>
            No articles found matching your filters.
          </div>
        )}
      </div>
    </>
  );
}

function FilterSection({ label, options, active, onChange }) {
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterLabel}>{label}</div>
      <div className={styles.filterGroup}>
        {options.map(option => (
          <button
            key={option}
            className={`${styles.filterBtn} ${active === option ? styles.active : ''}`}
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
  const getPriorityClass = (priority) => {
    if (priority.includes('High') || priority.includes('🔴')) return styles.priorityHigh;
    if (priority.includes('Medium') || priority.includes('🟡')) return styles.priorityMedium;
    return styles.priorityLow;
  };

  return (
    <a 
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.articleCardLink}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.articleCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTags}>
            <span className={`${styles.tag} ${getPriorityClass(article.priority)}`}>
              {article.priority.replace('🔴 ', '').replace('🟡 ', '').replace('🟢 ', '')}
            </span>
            <span className={`${styles.tag} ${styles.mission}`}>{article.mission}</span>
          </div>
          <div className={styles.cardAgency}>{article.agency}</div>
        </div>
        
        <div className={styles.cardDate}>{article.date}</div>
        
        <h3 className={styles.cardTitle}>
          {article.title}
        </h3>
        
        <p className={styles.cardDescription}>{article.description}</p>
        
        <div className={styles.cardMeta}>
          <span className={styles.cardTopic}>{article.topic}</span>
        </div>
      </div>
    </a>
  );
}
