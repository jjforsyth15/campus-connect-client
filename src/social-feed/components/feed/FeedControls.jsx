// =============================================================================
// components/feed/FeedControls.jsx
//
// Tab bar (For You / Following / Trending), sort toggle, and tag scroller.
//
// Props:
//   activeTab    FeedTab      setActiveTab  (tab) => void
//   sortBy       SortMode     setSortBy     (sort) => void
//   filterTag    string       setFilterTag  (tag) => void
//   tags         string[]     — all available tags including 'All'
// =============================================================================

import { Tag } from '../ui/primitives';

const TABS = [
  { key: 'forYou',    label: 'For You'  },
  { key: 'following', label: 'Following' },
  { key: 'trending',  label: 'Trending'  },
];

export function FeedControls({
  activeTab, setActiveTab,
  sortBy, setSortBy,
  filterTag, setFilterTag,
  tags,
}) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--r-lg)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Tab row */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {TABS.map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '7px 16px', borderRadius: 'var(--r-full)',
                border: `1.5px solid ${active ? 'var(--red)' : 'var(--border)'}`,
                background: active ? 'var(--red)' : 'transparent',
                color: active ? '#fff' : 'var(--text2)',
                fontWeight: 700, fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.18s var(--ease)',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = 'var(--red)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {label}
            </button>
          );
        })}

        {/* Sort toggle pushed to right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.80rem', color: 'var(--text3)', fontWeight: 600 }}>Sort:</span>
          {(['top', 'latest']).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              style={{
                padding: '5px 12px', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--border)',
                background: sortBy === s ? 'var(--bg-hover)' : 'transparent',
                color: sortBy === s ? 'var(--text1)' : 'var(--text3)',
                fontWeight: 700, fontSize: '0.80rem',
                cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.14s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal tag scroller */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        paddingBottom: 2,
        scrollbarWidth: 'none',
      }}>
        {tags.map(tag => (
          <Tag
            key={tag}
            label={tag}
            active={filterTag === tag}
            small
            onClick={() => setFilterTag(prev => prev === tag && tag !== 'All' ? 'All' : tag)}
          />
        ))}
      </div>
    </div>
  );
}
