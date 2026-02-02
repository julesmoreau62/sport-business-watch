'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: 'all',
    sport: 'all',
    topic: 'all',
    priority: 'all',
    search: ''
  });

  // Fetch articles from API
  useEffect(() => {
    fetch('/api/articles')
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

  // Extract unique values for dynamic filters
  const uniqueRegions = ['all', ...new Set(articles.map(a => a.region))];
  const uniqueSports = ['all', ...new Set(articles.map(a => a.sport))];
  const uniqueTopics = ['all', ...new Set(articles.map(a => a.topic))];
  const uniquePriorities = ['all', ...new Set(articles.map(a => a.priority))];

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesRegion = filters.region === 'all' || article.region === filters.region;
    const matchesSport = filters.sport === 'all' || article.sport === filters.sport;
    const matchesTopic = filters.topic === 'all' || article.topic === filters.topic;
    const matchesPriority = filters.priority === 'all' || article.priority === filters.priority;
    const matchesSearch = filters.search === '' || 
      article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      article.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRegion && matchesSport && matchesTopic && matchesPriority && matchesSearch;
  });

  // Count high priority articles
  const highPriorityCount = filteredArticles.filter(a => 
    a.priority.includes('High') || a.priority.includes('ðŸ”´')
  ).length;

  const regionEmojis = {
    'North America': 'ðŸŒŽ',
    'Europe': 'ðŸ‡ªðŸ‡º',
    'Asia-Pacific': 'ðŸŒ',
    'Middle East & Africa': 'ðŸŒ',
    'Latin America': 'ðŸŒŽ',
    'Global': 'ðŸŒ'
  };

  const topicEmojis = {
    'Finance': 'ðŸ’°',
    'Media Rights': 'ðŸ“º',
    'Technology': 'ðŸ’»',
    'Sponsorship': 'ðŸ¤',
    'Infrastructure': 'ðŸŒ',
    'Marketing': 'ðŸ“Š',
    'Esports': 'ðŸŽ®'
  };

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
              <div className={styles.logo}>ðŸ†</div>
              <h1>Sport Business Watch</h1>
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
                <div className={styles.statValue}>35</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.filters}>
          <FilterSection
            label="Region"
            options={uniqueRegions}
            active={filters.region}
            onChange={(val) => setFilters({...filters, region: val})}
            emojis={regionEmojis}
          />
          
          <FilterDropdown
            label="Sport"
            options={uniqueSports}
            active={filters.sport}
            onChange={(val) => setFilters({...filters, sport: val})}
          />
          
          <FilterDropdown
            label="Topic"
            options={uniqueTopics}
            active={filters.topic}
            onChange={(val) => setFilters({...filters, topic: val})}
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

function FilterSection({ label, options, active, onChange, emojis = {} }) {
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
            {emojis[option] ? `${emojis[option]} ` : ''}
            {option === 'all' ? 'All' : option}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterDropdown({ label, options, active, onChange }) {
  const placeholders = {
    'Sport': 'All Sports',
    'Topic': 'All Topics'
  };
  
  return (
    <div className={styles.filterSection}>
      <div className={styles.filterLabel}>{label}</div>
      <select
        className={styles.filterDropdown}
        value={active}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option === 'all' ? (placeholders[label] || 'All') : option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ArticleCard({ article, index }) {
  const [showSummary, setShowSummary] = useState(false);

  const getPriorityClass = (priority) => {
    if (priority.includes('High') || priority.includes('ðŸ”´')) return styles.priorityHigh;
    if (priority.includes('Medium') || priority.includes('ðŸŸ¡')) return styles.priorityMedium;
    return styles.priorityLow;
  };

  const regionEmoji = {
    'North America': 'ðŸŒŽ',
    'Europe': 'ðŸ‡ªðŸ‡º',
    'Asia-Pacific': 'ðŸŒ',
    'Middle East & Africa': 'ðŸŒ',
    'Latin America': 'ðŸŒŽ',
    'Global': 'ðŸŒ'
  }[article.region] || 'ðŸŒ';

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
              {article.priority.replace('ðŸ”´ ', '').replace('ðŸŸ¡ ', '').replace('ðŸŸ¢ ', '')}
            </span>
            <span className={`${styles.tag} ${styles.sport}`}>{article.sport}</span>
          </div>
          <div className={styles.cardRegion}>{regionEmoji}</div>
        </div>
        
        <div className={styles.cardDate}>{article.date}</div>
        
        <h3 className={styles.cardTitle}>
          {article.title}
        </h3>
        
        <p className={styles.cardDescription}>{article.description}</p>
        
        <div className={styles.cardMeta}>
          <span className={styles.cardTopic}>{article.topic}</span>
          <span>{article.region}</span>
        </div>
      </div>
    </a>
  );
}
