'use client';

import React from 'react';

/**
 * LoadingState Component
 * 
 * Displays centered loading spinner with message
 * Shown while fetching marketplace listings from API
 */

const LoadingState: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '4rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem'
    }}>
      {/* Animated spinner using CSS animation from globals.css */}
      <div 
        className="animate-spin"
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(168, 5, 50, 0.1)',
          borderTop: '4px solid #A80532',
          borderRadius: '50%'
        }} 
      />
      <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: '500' }}>
        Loading marketplace items...
      </p>
    </div>
  );
};

/**
 * ErrorState Component
 * 
 * Displays error message with retry button
 * Shown when API request fails
 * 
 * Props:
 * - error: Error message string
 * - onRetry: Callback function to retry the failed request
 */

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '4rem 1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(220, 38, 38, 0.05)',
        border: '2px solid rgba(220, 38, 38, 0.2)',
        borderRadius: '12px',
        padding: '2rem',
        display: 'inline-block'
      }}>
        {/* Error icon */}
        <svg 
          width="48" 
          height="48" 
          fill="none" 
          stroke="#DC2626" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ margin: '0 auto 1rem' }}
        >
          <circle cx="24" cy="24" r="20"/>
          <line x1="24" y1="16" x2="24" y2="24"/>
          <line x1="24" y1="28" x2="24.01" y2="28"/>
        </svg>
        <h3 style={{ color: '#DC2626', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '700' }}>
          Failed to Load Listings
        </h3>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          {error}
        </p>
        {/* Retry button */}
        <button
          onClick={onRetry}
          style={{
            background: '#A80532',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

/**
 * EmptyState Component
 * 
 * Displays message when no listings match current filters
 * Provides options to clear filters or add first listing
 * 
 * Props:
 * - onClearFilters: Callback to reset all filters
 * - onAddListing: Callback to open add listing modal
 */

interface EmptyStateProps {
  onClearFilters: () => void;
  onAddListing: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, onAddListing }) => {
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '4rem 1.5rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(168, 5, 50, 0.02)',
        border: '2px dashed rgba(168, 5, 50, 0.2)',
        borderRadius: '12px',
        padding: '3rem 2rem',
        display: 'inline-block'
      }}>
        {/* Empty box icon */}
        <svg 
          width="64" 
          height="64" 
          fill="none" 
          stroke="#A80532" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ margin: '0 auto 1rem', opacity: 0.5 }}
        >
          <rect x="3" y="8" width="58" height="48" rx="2" ry="2"/>
          <line x1="32" y1="8" x2="32" y2="56"/>
          <line x1="3" y1="32" x2="61" y2="32"/>
        </svg>
        <h3 style={{ color: '#374151', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
          No Items Found
        </h3>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '1rem' }}>
          Try adjusting your filters or be the first to list an item!
        </p>
        <button
          onClick={onClearFilters}
          style={{
            background: 'white',
            color: '#A80532',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: '2px solid #A80532',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            marginRight: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            const el = e.target as HTMLElement;
            el.style.background = '#A80532';
            el.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            const el = e.target as HTMLElement;
            el.style.background = 'white';
            el.style.color = '#A80532';
          }}
        >
          Clear Filters
        </button>
        <button
          onClick={onAddListing}
          style={{
            background: '#A80532',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}
        >
          List Your First Item
        </button>
      </div>
    </div>
  );
};

export { LoadingState, ErrorState, EmptyState };