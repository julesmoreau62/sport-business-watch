'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
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

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const threshold = 50; // Seuil pour considérer qu'on est en haut

      if (currentScroll <= threshold) {
        // Tout en haut de page = visible
        setHeaderVisible(true);
      } else {
        // Dès qu'on scroll = invisible
        setHeaderVisible(false);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

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
    a.priority.includes('High') || a.priority.includes('🔴')
  ).length;

  // Calculate trending topics (top 5)
  const topicCounts = {};
  articles.forEach(article => {
    if (article.topic) {
      topicCounts[article.topic] = (topicCounts[article.topic] || 0) + 1;
    }
  });
  const trendingTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const regionEmojis = {
    'North America': '🌎',
    'Europe': '🇪🇺',
    'Asia-Pacific': '🌏',
    'Middle East & Africa': '🌍',
    'Latin America': '🌎',
    'Global': '🌐'
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
      
      <header className={`${styles.header} ${!headerVisible ? styles.headerHidden : ''}`}>
        <div className={styles.container}>
          {/* Logo Section */}
          <div className={styles.headerTop}>
            <div className={styles.logoSection}>
              <div className={styles.logoText}>Sport Business</div>
              <div className={styles.logoSubtitle}>Intelligence Hub</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Articles</div>
              <div className={`${styles.statValue} ${styles.accent}`}>{filteredArticles.length}</div>
              <div className={styles.statChange}>↗ {articles.length} total</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>High Priority</div>
              <div className={`${styles.statValue} ${styles.red}`}>{highPriorityCount}</div>
              <div className={styles.statChange}>
                {highPriorityCount > 0 ? '↗' : '↘'} {Math.round((highPriorityCount / filteredArticles.length) * 100)}% of total
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Sources</div>
              <div className={`${styles.statValue} ${styles.blue}`}>35</div>
              <div className={styles.statChange}>↗ Active</div>
            </div>
          </div>

          {/* Trending Section */}
          {trendingTopics.length > 0 && (
            <div className={styles.trendingSection}>
              <div className={styles.trendingHeader}>
                <div className={styles.trendingTitle}>🔥 Trending This Week</div>
                <div className={styles.trendingPeriod}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className={styles.trendingTags}>
                {trendingTopics.map(([topic, count], idx) => (
                  <div 
                    key={topic} 
                    className={`${styles.trendingTag} ${idx === 0 ? styles.hot : ''}`}
                    onClick={() => setFilters({...filters, topic})}
                  >
                    <span>{topic}</span>
                    <span className={styles.count}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className={styles.headerSpacer}></div>

      <div className={styles.container}>
        {/* Filters */}
        <div className={styles.filters}>
          {/* Region chips */}
          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Region</div>
            <div className={styles.chipsScroll}>
              {uniqueRegions.map(region => (
                <button
                  key={region}
                  className={`${styles.chip} ${filters.region === region ? styles.active : ''}`}
                  onClick={() => setFilters({...filters, region})}
                >
                  {region === 'all' ? 'All' : `${regionEmojis[region] || ''} ${region}`}
                </button>
              ))}
            </div>
          </div>

          {/* Topic & Sport dropdowns */}
          <div className={styles.filterRow}>
            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>Topic</div>
              <select
                className={styles.dropdown}
                value={filters.topic}
                onChange={(e) => setFilters({...filters, topic: e.target.value})}
              >
                <option value="all">All Topics</option>
                {uniqueTopics.filter(t => t !== 'all').map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterSection}>
              <div className={styles.filterLabel}>Sport</div>
              <select
                className={styles.dropdown}
                value={filters.sport}
                onChange={(e) => setFilters({...filters, sport: e.target.value})}
              >
                <option value="all">All Sports</option>
                {uniqueSports.filter(s => s !== 'all').map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority chips */}
          <div className={styles.filterSection}>
            <div className={styles.filterLabel}>Priority</div>
            <div className={styles.chipsScroll}>
              {uniquePriorities.map(priority => (
                <button
                  key={priority}
                  className={`${styles.chip} ${filters.priority === priority ? styles.active : ''}`}
                  onClick={() => setFilters({...filters, priority})}
                >
                  {priority === 'all' ? 'All' : priority}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
        </div>

        <div className={styles.sectionTitle}>Latest Articles</div>

        {/* Articles Grid */}
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

function ArticleCard({ article, index }) {
  const getPriorityClass = (priority) => {
    if (priority.includes('High') || priority.includes('🔴')) return 'priorityHigh';
    if (priority.includes('Medium') || priority.includes('🟡')) return 'priorityMedium';
    return 'priorityLow';
  };

  const regionEmoji = {
    'North America': '🌎',
    'Europe': '🇪🇺',
    'Asia-Pacific': '🌏',
    'Middle East & Africa': '🌍',
    'Latin America': '🌎',
    'Global': '🌐'
  }[article.region] || '🌐';

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
            <span className={`${styles.tag} ${styles.sportTag}`}>{article.sport}</span>
          </div>
          <div className={`${styles.priorityBadge} ${styles[getPriorityClass(article.priority)]}`}>
            {article.priority.replace('🔴 ', '').replace('🟡 ', '').replace('🟢 ', '')}
          </div>
        </div>
        
        <div className={styles.cardDate}>📅 {article.date}</div>
        
        <h3 className={styles.cardTitle}>{article.title}</h3>
        
        <p className={styles.cardDescription}>{article.description}</p>
        
        <div className={styles.cardFooter}>
          <span className={styles.cardTopic}>{article.topic}</span>
          <div className={styles.cardRegion}>
            {regionEmoji} <span>{article.region}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
