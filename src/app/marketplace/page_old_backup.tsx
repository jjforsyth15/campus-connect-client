'use client';

/**
 * ============================================================================
 * MARKETPLACE PAGE - CampusConnect
 * ============================================================================
 * 
 * Purpose: Main marketplace interface where CSUN students can buy and sell items
 * 
 * Key Features:
 * - Real-time search functionality across titles and descriptions
 * - Category-based filtering (Textbooks, Electronics, Furniture, etc.)
 * - Price range filtering with adjustable minimum and maximum values
 * - Favorites/wishlist system for saving items of interest
 * - Fully responsive design for mobile, tablet, and desktop
 * - Seller contact system with modal interface
 * - Multiple sorting options (recent, price low-to-high, price high-to-low, popular)
 * 
 * Design System:
 * - Primary Color: #A80532 (CSUN Matador Red) - matches site-wide branding
 * - Background: Consistent with homepage animated gradient
 * - UI Elements: Glassmorphism with white/transparent cards and backdrop blur
 * - Typography: Clear hierarchy with bold headers and readable body text
 * - Hover Effects: Smooth transitions on interactive elements
 * 
 * State Management:
 * - Search and filter states control what items are displayed
 * - User interaction states manage favorites and modal visibility
 * - Authentication state ensures only logged-in users can access
 * 
 * Performance Considerations:
 * - Filtering and sorting done on client-side for instant feedback
 * - Scroll position tracked efficiently for UI animations
 * - Modal rendered conditionally to minimize DOM nodes
 * 
 * Last Updated: February 10, 2026
 * Author: CampusConnect Team
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loadProfile } from '@/lib/load-profile';
import { Profile } from '../profile/page';
import { useAuthorize } from '@/lib/useAuthorize';

/**
 * Type Definitions for Marketplace Data
 * These interfaces match the backend API response structure
 */
interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  condition: string;
  category: string;
  location: string;
  views: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  seller: Seller;
  _count?: {
    favoritedBy: number;
  };
}

/**
 * Main Marketplace Component
 * Renders the complete marketplace interface with all features
 */
const Marketplace = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Search and Filter States
   * These control which items are displayed based on user selections
   */
  const [searchQuery, setSearchQuery] = useState('');              // User's search input - filters by title/description
  const [selectedCategory, setSelectedCategory] = useState('all'); // Current category filter - 'all' shows everything
  const [sortBy, setSortBy] = useState('recent');                  // Sort method: 'recent', 'price-low', 'price-high', or 'popular'
  const [priceRange, setPriceRange] = useState([0, 1000]);         // Price filter range [minimum, maximum] in dollars
  const [showFilters, setShowFilters] = useState(false);           // Controls visibility of mobile filter panel
  
  /**
   * Data and Loading States
   * Manage API data and loading/error states
   */
  const [listings, setListings] = useState<MarketplaceListing[]>([]); // Array of marketplace listings from API
  const [loading, setLoading] = useState(true);                        // Loading state for initial data fetch
  const [error, setError] = useState<string | null>(null);             // Error message if API call fails
  const [refreshTrigger, setRefreshTrigger] = useState(0);             // Trigger to refetch data
  
  /**
   * User Interaction States
   * These track user actions and preferences
   */
  const [favorites, setFavorites] = useState(new Set<string>());   // Set of favorited item IDs for quick lookup
  const [showContactModal, setShowContactModal] = useState(false); // Whether contact seller modal is visible
  const [showAddModal, setShowAddModal] = useState(false);         // Whether add listing modal is visible
  const [selectedItem, setSelectedItem] = useState<MarketplaceListing | null>(null); // Currently selected item
  const [scrollY, setScrollY] = useState(0);                       // Current page scroll position in pixels

  /**
   * Authentication and Routing
   * Handles user authorization and navigation
   */
  const router = useRouter();
  const { auth, user, token, loading: authLoading } = useAuthorize();

  // ============================================================================
  // AUTHENTICATION GUARD
  // ============================================================================
  /**
   * Effect: Redirect unauthorized users to login
   * This ensures only authenticated users can access the marketplace
   * Waits for auth status to load before making decision to prevent flash
   */
  React.useEffect(() => {
    if(authLoading) return; // Wait for auth status to load completely
    
    if (auth && token) {
      // User is authenticated - allow access
      console.log("Stored user: ", user);
    } else {
      // User not authenticated - redirect to homepage/login
      console.log("User not logged in.");
      console.log("auth: " + auth, ". token: " + token);
      router.replace("/");
    }
  }, [auth, token, user, authLoading, router]); 

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  /**
   * Effect: Fetch marketplace listings from API
   * Runs on component mount and when refreshTrigger changes
   * Applies filters and sorting via API query parameters
   */
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters for filtering
        const params = new URLSearchParams();
        
        // Add category filter if not 'all'
        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        // Add price range filters
        if (priceRange[0] > 0) {
          params.append('minPrice', priceRange[0].toString());
        }
        if (priceRange[1] < 1000) {
          params.append('maxPrice', priceRange[1].toString());
        }
        
        // Add search query
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        // Add sorting
        params.append('sortBy', sortBy);
        
        // Only show active listings
        params.append('status', 'active');

        // Make API request
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/marketplace?${params.toString()}`
        );

        setListings(response.data);
      } catch (err: any) {
        console.error('Error fetching listings:', err);
        setError(err.response?.data?.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if authenticated
    if (auth && token) {
      fetchListings();
    }
  }, [auth, token, refreshTrigger, selectedCategory, priceRange, searchQuery, sortBy]);

  /**
   * Effect: Load user's favorites from API
   * Fetches the list of listing IDs that the user has favorited
   */
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!auth || !token) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/marketplace/favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Extract IDs from favorites and add to Set with proper typing
        const favoriteIds = new Set<string>(response.data.map((listing: MarketplaceListing) => listing.id));
        setFavorites(favoriteIds);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchFavorites();
  }, [auth, token, refreshTrigger]);

  // ============================================================================
  // SCROLL LISTENER
  // ============================================================================
  /**
   * Effect: Track scroll position for UI animations
   * Used to add shadows, change header opacity, or trigger other scroll-based effects
   * Cleaned up on component unmount to prevent memory leaks
   */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================================================
  // CATEGORY DATA
  // ============================================================================
  
  /**
   * Category Definitions
   * All categories use CSUN Matador Red (#A80532) for brand consistency
   * This matches the color scheme used throughout the rest of the site
   */
  const categories = [
    { id: 'all', name: 'All Items', color: '#A80532' },
    { id: 'textbooks', name: 'Textbooks', color: '#A80532' },
    { id: 'electronics', name: 'Electronics', color: '#A80532' },
    { id: 'furniture', name: 'Furniture', color: '#A80532' },
    { id: 'clothing', name: 'Clothing', color: '#A80532' },
    { id: 'accessories', name: 'Accessories', color: '#A80532' }
  ];

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Format Timestamp to Relative Time
   * Converts ISO timestamp to human-readable relative time (e.g., "2 hours ago")
   * 
   * @param timestamp - ISO 8601 timestamp string
   * @returns Human-readable relative time string
   */
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  };

  /**
   * Calculate Savings Percentage
   * Computes the discount percentage from original price to current price
   * 
   * @param price - Current listing price
   * @param originalPrice - Original retail price (nullable)
   * @returns Percentage discount as integer, or null if no original price
   */
  const calculateSavings = (price: number, originalPrice: number | null): number | null => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Toggle Favorite Status
   * Adds or removes an item from the user's favorites list via API
   * Updates local state optimistically for better UX
   * 
   * @param id - The unique identifier (string) of the item to toggle
   */
  const toggleFavorite = async (id: string) => {
    // Optimistically update UI
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });

    // Make API call to persist the change
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/marketplace/${id}/favorite`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert optimistic update on error
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(id)) {
          newFavorites.delete(id);
        } else {
          newFavorites.add(id);
        }
        return newFavorites;
      });
    }
  };

  /**
   * Handle Contact Seller Action
   * Opens the contact modal and sets the selected item
   * This allows users to reach out to sellers about items
   * 
   * @param item - The listing item that the user wants to inquire about
   */
  const handleContactSeller = (item: any) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };

  /**
   * Handle Search Form Submission
   * Prevents page reload on form submit
   * Search filtering is reactive and happens automatically via filteredListings
   * 
   * @param e - React form event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Search functionality already works through filteredListings computed value
  };

  // ============================================================================
  // FILTERING AND SORTING LOGIC
  // ============================================================================
  
  /**
   * Computed Value: Filtered Listings
   * Applies all active filters to the listings array
   * 
   * Filtering Logic:
   * 1. Category Filter: Shows only selected category or all if 'all' is selected
   * 2. Search Filter: Case-insensitive match against title and description
   * 3. Price Filter: Includes items within the selected price range
   * 
   * Performance: Runs on every render but is fast due to simple operations
   * Consider useMemo if the listings array becomes very large (1000+ items)
   */
  const filteredListings = listings.filter(item => {
    // Check if item matches the selected category
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    // Check if item title or description contains the search query
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if item price falls within the selected range
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    // Item must match all three criteria to be included
    return matchesCategory && matchesSearch && matchesPrice;
  });

  /**
   * Computed Value: Sorted Listings
   * Takes filtered results and sorts them based on user preference
   * 
   * Sorting Options:
   * - 'recent': Maintains original array order (assumed to be newest first)
   * - 'price-low': Ascending price order (cheapest first)
   * - 'price-high': Descending price order (most expensive first)
   * - 'popular': Descending view count order (most viewed first)
   * 
   * Note: Creates a copy of the array before sorting to avoid mutating original
   */
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': 
        return a.price - b.price;
      case 'price-high': 
        return b.price - a.price;
      case 'popular': 
        return b.views - a.views;
      default: 
        return 0; // Keep original order for 'recent'
    }
  });

  /**
   * Helper Function: Get Category Color
   * Returns the color associated with a given category ID
   * Used for consistent theming across category badges and buttons
   * 
   * @param categoryId - The ID of the category to get color for
   * @returns The hex color code for the category (defaults to CSUN red)
   */
  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#A80532';
  };

  // Prevent rendering until auth is confirmed to avoid flash of content
  if (!auth) return null;

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#A80532', 
      position: 'relative' 
    }}>
      {/* 
        Animated Background Layer
        Matches the site-wide design with gradient overlay and subtle animations
        Uses fixed positioning to stay in place during scroll
        Pointer events disabled so clicks pass through to content below
      */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(168,5,50,0.45) 0%, rgba(168,5,50,0.34) 50%, rgba(168,5,50,0.45) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {/* 
          Radial gradient overlay for depth
          Creates subtle light spots that add visual interest
          Animated with pulse keyframe for gentle breathing effect
        */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
      </div>

      {/* 
        Main Content Container
        Positioned relatively to sit above the background layer
        Higher z-index ensures content is interactive and visible
      */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* 
          Back to Dashboard Button
          Fixed positioning keeps it visible while scrolling
          Glassmorphism effect with hover state for better UX
          Positioned in top-left corner for easy access
        */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            position: "fixed",
            top: "1.5rem",
            left: "1.5rem",
            zIndex: 100,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            cursor: "pointer",
            transition: "all 0.25s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
          onMouseEnter={(e) => {
            // Hover effect: change to CSUN red background with white text
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#A80532";
            el.style.color = "white";
          }}
          onMouseLeave={(e) => {
            // Reset to default white background
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(255, 255, 255, 0.95)";
            el.style.color = "#A80532";
          }}
        >
          {/* Left-pointing arrow SVG icon */}
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* 
          Hero Section
          Contains the page title, subtitle, and search interface
          Uses glassmorphism design to match site theme
          Responsive padding and max-width for optimal viewing
        */}
        <div 
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)', // Subtle white tint
            backdropFilter: 'blur(10px)',              // Glassmorphism blur effect
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)' // Subtle separator
          }}
        >
          {/* Constrained content container for better readability */}
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '2rem 1.5rem', 
            position: 'relative'
          }}>
            {/* Page header with title, description, and action button */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                color: 'white',
                letterSpacing: '-0.5px' // Tighter spacing for modern look
              }}>
                Marketplace
              </h1>
              <p style={{ 
                fontSize: '1rem', 
                marginBottom: '1rem', 
                color: 'rgba(255, 255, 255, 0.85)', // Slightly transparent for hierarchy
                fontWeight: '400'
              }}>
                Buy and sell with fellow Matadors
              </p>
              {/* 
                Sell Item Button
                Primary call-to-action to open the "Add Listing" modal
                Styled with CSUN red branding for visibility
              */}
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: '#A80532',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(168, 5, 50, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  const el = e.target as HTMLElement;
                  el.style.background = '#8B0428';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 6px 16px rgba(168, 5, 50, 0.5)';
                }}
                onMouseLeave={(e) => {
                  const el = e.target as HTMLElement;
                  el.style.background = '#A80532';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 4px 12px rgba(168, 5, 50, 0.4)';
                }}
              >
                {/* Plus icon for adding new item */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Sell an Item
              </button>
            </div>

            {/* 
              Search Bar Form
              Centered with max width for comfortable input area
              Form submission is handled to prevent page reload
            */}
            <form onSubmit={handleSearch} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                position: 'relative',
                background: 'white',                      // Clean white background for input
                borderRadius: '12px',                     // Rounded corners matching site style
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Depth shadow
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {/* Search icon - provides visual cue for search functionality */}
                <div style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                
                {/* 
                  Search Input Field
                  Controlled component tied to searchQuery state
                  Filtering happens reactively as user types
                */}
                <input
                  type="text"
                  placeholder="Search for textbooks, electronics, furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,                    // Takes up remaining space
                    padding: '0.75rem 0.5rem',
                    outline: 'none',            // Remove default outline, relying on container styling
                    color: '#111827',           // Dark text for contrast on white
                    fontSize: '0.95rem',
                    border: 'none',
                    background: 'transparent'
                  }}
                />
                
                {/* 
                  Filter Toggle Button
                  Shows/hides advanced filters (mobile-friendly design pattern)
                  Background color changes based on active state
                */}
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    background: showFilters ? '#A80532' : '#f3f4f6',  // Active state uses CSUN red
                    color: showFilters ? 'white' : '#374151',          // Text color inverts when active
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {/* Filter funnel icon */}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  Filters
                </button>
                
                {/* 
                  Search Submit Button
                  Primary action button with CSUN red branding
                  Hover effect darkens the color for visual feedback
                  Note: Search is reactive, so this mainly triggers form validation
                */}
                <button 
                  type="submit"
                  style={{
                    background: '#A80532',                            // CSUN Matador Red
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '1.125rem',
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 25px rgba(168, 5, 50, 0.4)'   // Depth shadow matching color
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}  // Darker on hover
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}  // Reset to default
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 
          Category Filter Pills
          Sticky horizontal scrollable menu for quick category switching
          Matches site-wide navigation pattern with glassmorphism
          Sticks to top of viewport for easy access while scrolling
        */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 40,                                              // Below back button but above content
          background: 'rgba(255, 255, 255, 0.95)',                // Frosted glass effect
          backdropFilter: 'blur(10px)',                            // Blur content behind
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',              // Subtle shadow for depth
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'           // Subtle bottom border
        }}>
          {/* Horizontally scrollable category list */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',                                          // Prevents text wrapping
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedCategory === cat.id ? cat.color : 'transparent',  // Active: CSUN red, Inactive: transparent
                    color: selectedCategory === cat.id ? 'white' : '#374151',             // Active: white text, Inactive: dark gray
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    // Only show hover effect if category is not currently selected
                    if (selectedCategory !== cat.id) {
                      (e.target as HTMLElement).style.background = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
                    // Reset hover effect if category is not selected
                    if (selectedCategory !== cat.id) {
                      (e.target as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 
          Sort and Results Count Bar
          Displays number of filtered results and sorting dropdown
          Clean white background provides clear separation from header
        */}
        <div style={{ background: 'white', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '1rem 1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',                 // Allows wrapping on small screens
            gap: '1rem'
          }}>
            {/* Results counter with highlighted number */}
            <p style={{ color: '#374151', margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>
              <span style={{ color: '#A80532', fontWeight: '700' }}>{sortedListings.length}</span> items found
            </p>
            
            {/* 
              Sort Dropdown
              Allows users to change the order of displayed items
              Options: recent, price-low, price-high, popular
            */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                cursor: 'pointer',
                background: 'white',
                color: '#374151',
                fontSize: '0.95rem',
                fontWeight: '600'
              }}
            >
              {/* Dropdown options for sorting preferences */}
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* 
          Loading State
          Displays spinner and message while fetching data from API
          Centered both horizontally and vertically in the content area
        */}
        {loading && (
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
            {/* Animated spinner */}
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid rgba(168, 5, 50, 0.1)',
              borderTop: '4px solid #A80532',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: '500' }}>
              Loading marketplace items...
            </p>
          </div>
        )}

        {/* 
          Error State
          Displays error message with retry option if API fetch fails
          User-friendly messaging with icon for visual feedback
        */}
        {error && !loading && (
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
              <svg width="48" height="48" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
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
                onClick={() => setRefreshTrigger(prev => prev + 1)}
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
        )}

        {/* 
          Empty State
          Shows when no listings match the current filters
          Encourages users to adjust filters or add their own listings
        */}
        {!loading && !error && sortedListings.length === 0 && (
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
              <svg width="64" height="64" fill="none" stroke="#A80532" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', opacity: 0.5 }}>
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
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setPriceRange([0, 1000]);
                }}
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
                onClick={() => setShowAddModal(true)}
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
        )}

        {/* 
          Item Cards Grid
          Responsive grid layout that automatically adjusts columns based on screen size
          Uses CSS Grid with auto-fill and minmax for fluid responsive behavior
          Cards maintain minimum width of 280px and grow to fill available space
          Only shown when not loading, no error, and listings exist
        */}
        {!loading && !error && sortedListings.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',  // Responsive columns
              gap: '1.5rem'                                                    // Space between cards
            }}>
              {/* Map through filtered and sorted listings to create card for each item */}
              {sortedListings.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',                               // Keeps child elements within rounded corners
                    transition: 'all 0.3s ease',                      // Smooth animation for hover effects
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'       // Subtle shadow for card depth
                  }}
                  onMouseEnter={(e) => {
                    // Hover effect: lift card and increase shadow for depth
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    // Reset to default position and shadow when hover ends
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                {/* 
                  Image Container
                  Fixed height container ensures consistent card heights
                  Object-fit cover ensures images fill space without distortion
                  Uses first image from images array, or placeholder if empty
                */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=600&h=400&fit=crop'}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'  // Crops image to fit while maintaining aspect ratio
                    }}
                  />

                  {/* 
                    Badge Overlay Container
                    Positioned absolutely in top-left corner over the image
                    Displays item condition
                    Z-index ensures badges appear above image
                  */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '0.75rem', 
                    left: '0.75rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.5rem', 
                    zIndex: 10 
                  }}>
                    {/* 
                      Condition Badge
                      Shows item condition (Like New, Excellent, Good, etc.)
                      Green color indicates good condition
                    */}
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.95)',  // Semi-transparent white background
                      color: '#059669',                          // Green for condition indicator
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      {item.condition}
                    </span>
                  </div>

                  {/* 
                    Favorite/Heart Button
                    Positioned absolutely in top-right corner
                    Toggles favorite status when clicked
                    stopPropagation prevents card click event from firing
                  */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();           // Prevents parent card click
                      toggleFavorite(item.id);       // Toggle favorite status
                    }}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',           // Circular button
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 10
                    }}
                  >
                    {/* 
                      Heart Icon SVG
                      Filled with CSUN red if favorited, outline-only if not
                      Visual feedback for favorite status
                    */}
                    <svg
                      width="18"
                      height="18"
                      fill={favorites.has(item.id) ? '#A80532' : 'none'}
                      stroke={favorites.has(item.id) ? '#A80532' : '#6B7280'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* 
                  Card Content Section
                  Contains all text information about the listing
                  Structured with clear visual hierarchy
                */}
                <div style={{ padding: '1rem' }}>
                  {/* 
                    Item Title
                    Limited to 2 lines with ellipsis for overflow
                    Uses webkit properties for multi-line text truncation
                  */}
                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1.1rem', 
                    marginBottom: '0.5rem', 
                    color: '#111827',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,              // Limits to 2 lines
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'               // Hides overflow text
                  }}>
                    {item.title}
                  </h3>
                  
                  {/* 
                    Price Display
                    Shows current price prominently with optional original price
                    Includes savings calculation if original price exists
                  */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {/* Current Price - Large and bold in CSUN red */}
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#A80532' }}>
                      ${item.price}
                    </span>
                    {/* Original Price and Savings - Only shown if item has original price */}
                    {item.originalPrice && (
                      <>
                        {/* Strikethrough original price */}
                        <span style={{ 
                          fontSize: '0.9rem', 
                          color: '#9CA3AF', 
                          textDecoration: 'line-through'
                        }}>
                          ${item.originalPrice}
                        </span>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#059669',
                          fontWeight: '600',
                          background: '#D1FAE5',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px'
                        }}>
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* 
                    Seller Information Section
                    Displays seller profile picture, name, and location
                    Separated from other content with bottom border for visual hierarchy
                  */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    {/* Seller Avatar - Uses profilePicture or generates avatar from name */}
                    <img
                      src={item.seller.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.seller.firstName}`}
                      alt={`${item.seller.firstName} ${item.seller.lastName}`}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        border: '2px solid #E5E7EB',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Seller Name - Truncates with ellipsis if too long */}
                      <p style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: '600', 
                        color: '#374151', 
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.seller.firstName} {item.seller.lastName}
                      </p>
                      {/* Location Info */}
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6B7280', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem'
                      }}>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* 
                    Contact Seller Button
                    Primary action button with CSUN red theme
                    Opens contact modal when clicked
                  */}
                  <button 
                    onClick={() => handleContactSeller(item)}
                    style={{
                      width: '100%',
                      background: '#A80532',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}
                  >
                    Contact Seller
                  </button>

                  {/* 
                    Time Posted
                    Shows relative time (e.g., "2 hours ago")
                    Calculated from createdAt timestamp using formatTimeAgo helper
                  */}
                  <div style={{ 
                    marginTop: '0.75rem',
                    fontSize: '0.75rem', 
                    color: '#9CA3AF',
                    textAlign: 'center'
                  }}>
                    Posted {formatTimeAgo(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More / Pagination Info */}
          {sortedListings.length > 10 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: '500' }}>
                Showing {sortedListings.length} items
              </p>
            </div>
          )}
        </div>
        )}

        {/* Old Sell Item Button - Removed, replaced with button in hero section */}

        {/* Contact Seller Modal */}
        {showContactModal && selectedItem && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '1rem'
            }}
            onClick={() => setShowContactModal(false)}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                border: '1px solid #E5E7EB'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#111827', 
                    marginBottom: '0.25rem' 
                  }}>
                    Contact Seller
                  </h2>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                    Send a message to {selectedItem.seller.firstName} {selectedItem.seller.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setShowContactModal(false)}
                  style={{
                    background: '#F3F4F6',
                    border: 'none',
                    color: '#6B7280',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#E5E7EB'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#F3F4F6'}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Item Info */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                background: '#F9FAFB',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid #E5E7EB'
              }}>
                <img
                  src={selectedItem.images[0] || 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=600&h=400&fit=crop'}
                  alt={selectedItem.title}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h3 style={{ color: '#111827', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>
                    {selectedItem.title}
                  </h3>
                  <p style={{ color: '#A80532', fontWeight: '700', fontSize: '1.25rem' }}>
                    ${selectedItem.price}
                  </p>
                </div>
              </div>

              {/* Message Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Message sent to seller! (Demo)');
                setShowContactModal(false);
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    color: '#374151', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}>
                    Your Message
                  </label>
                  <textarea
                    placeholder="Hi! I'm interested in this item..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      background: 'white',
                      color: '#111827',
                      fontSize: '0.875rem',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: '#A80532',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}
                  >
                    Send Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    style={{
                      background: '#F3F4F6',
                      color: '#374151',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#E5E7EB'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#F3F4F6'}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* 
        Add Listing Modal
        Form for creating new marketplace listings
        Opens when user clicks "Sell an Item" button
        TODO: Implement full form validation, image upload, and API integration
      */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid #E5E7EB',
              animation: 'modalSlideIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700', 
                  color: '#111827', 
                  marginBottom: '0.25rem' 
                }}>
                  List an Item
                </h2>
                <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                  Fill in the details below to create your listing
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  color: '#6B7280',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#E5E7EB'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#F3F4F6'}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Placeholder Content */}
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              background: 'rgba(168, 5, 50, 0.02)',
              borderRadius: '12px',
              border: '2px dashed rgba(168, 5, 50, 0.2)'
            }}>
              <svg width="64" height="64" fill="none" stroke="#A80532" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', opacity: 0.6 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <h3 style={{ color: '#374151', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>
                Feature Coming Soon!
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                The listing creation form is currently under development. <br />
                Soon you'll be able to add items with photos, descriptions, and more!
              </p>
              <div style={{
                background: 'rgba(168, 5, 50, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1.5rem',
                textAlign: 'left'
              }}>
                <p style={{ 
                  color: '#A80532', 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem' 
                }}>
                  Form will include:
                </p>
                <ul style={{ 
                  color: '#6B7280', 
                  fontSize: '0.875rem', 
                  lineHeight: '1.8', 
                  paddingLeft: '1.5rem',
                  margin: 0
                }}>
                  <li>Title & Description fields</li>
                  <li>Price & Original Price inputs</li>
                  <li>Category selection (Textbooks, Electronics, etc.)</li>
                  <li>Condition dropdown (Like New, Excellent, Good)</li>
                  <li>Location field</li>
                  <li>Image upload (multiple images support)</li>
                  <li>Form validation matching backend requirements</li>
                </ul>
              </div>
            </div>

            {/* Temporary Close Button */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: '#A80532',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;