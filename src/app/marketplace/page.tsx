'use client';

/**
 * ============================================================================
 * MARKETPLACE PAGE - CampusConnect
 * ============================================================================
 * 
 * Purpose: Main marketplace interface where CSUN students can buy and sell items
 * 
 * Features:
 * - 🔍 Real-time search functionality
 * - 📂 Category-based filtering (Textbooks, Electronics, Furniture, etc.)
 * - 💰 Price range filtering
 * - ⭐ Favorites/wishlist system
 * - 📱 Fully responsive design
 * - 💬 Seller contact system
 * - 🎨 CSUN-branded color scheme (#D22030 - Matador Red)
 * 
 * Color Scheme:
 * - Primary: #D22030 (CSUN Red)
 * - Secondary: Gray scale for neutrality
 * - Accents: Green for savings, Yellow for ratings
 * 
 * Last Updated: December 12, 2025
 * Author: CampusConnect Team
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadProfile } from '@/lib/load-profile';
import { Profile } from '../profile/page';
import { useAuthorize } from '@/lib/useAuthorize';


const Marketplace = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');              // User's search input
  const [selectedCategory, setSelectedCategory] = useState('all'); // Selected category filter
  const [sortBy, setSortBy] = useState('recent');                  // Sort option (recent, price, popular)
  const [priceRange, setPriceRange] = useState([0, 1000]);         // Price range filter [min, max]
  const [showFilters, setShowFilters] = useState(false);           // Mobile filter panel visibility
  
  // User interaction states
  const [favorites, setFavorites] = useState(new Set());           // User's favorited items
  const [showContactModal, setShowContactModal] = useState(false); // Contact seller modal visibility
  const [selectedItem, setSelectedItem] = useState(null);          // Currently selected item for contact
  const [scrollY, setScrollY] = useState(0);                       // Page scroll position for animations

  // Authorization and routing
  const router = useRouter();
  const { auth, user, token, loading } = useAuthorize();

  // ============================================================================
  // AUTHENTICATION GUARD
  // ============================================================================
  // Redirects unauthorized users to login page
  React.useEffect(() => {
    if(loading) return; // Wait for auth status to load
    
    if (auth && token) {
      console.log("Stored user: ", user);
    } else {
      // User not authenticated - redirect to login
      console.log("User not logged in.");
      console.log("auth: " + auth, ". token: " + token);
      router.replace("/");
    }
  }, [auth, token, user, loading, router]); 

  // ============================================================================
  // SCROLL LISTENER
  // ============================================================================
  // Tracks scroll position for header shadow and animations
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ============================================================================
  // CATEGORY AND LISTING DATA
  // ============================================================================
  
  // Category filters - using site color scheme
  const categories = [
    { id: 'all', name: 'All Items', color: '#A80532' },
    { id: 'textbooks', name: 'Textbooks', color: '#A80532' },
    { id: 'electronics', name: 'Electronics', color: '#A80532' },
    { id: 'furniture', name: 'Furniture', color: '#A80532' },
    { id: 'clothing', name: 'Clothing', color: '#A80532' },
    { id: 'accessories', name: 'Accessories', color: '#A80532' }
  ];

  const listings = [
    {
      id: 1,
      title: 'Calculus 11th Edition',
      price: 55,
      originalPrice: 120,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
      seller: 'Sarah M.',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 4.9,
      reviews: 127,
      condition: 'Like New',
      location: 'Northridge Campus',
      posted: '2 hours ago',
      category: 'textbooks',
      trending: true,
      views: 234,
      description: 'Excellent condition, minimal highlighting. Comes with access code.'
    },
    {
      id: 2,
      title: 'Sony WH-1000XM4 Headphones',
      price: 180,
      originalPrice: 349,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
      seller: 'John D.',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      rating: 4.7,
      reviews: 89,
      condition: 'Excellent',
      location: 'Sierra Hall',
      posted: '5 hours ago',
      category: 'electronics',
      views: 189
    },
    {
      id: 3,
      title: 'iPad Pro 11" 2021 - 256GB',
      price: 450,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop',
      seller: 'Emily R.',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 5.0,
      reviews: 203,
      condition: 'Like New',
      location: 'University Student Union',
      posted: '1 day ago',
      category: 'electronics',
      trending: true,
      views: 512
    },
    {
      id: 4,
      title: 'Mini Refrigerator - Perfect for Dorms',
      price: 75,
      originalPrice: 150,
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop',
      seller: 'Mike T.',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      rating: 4.8,
      reviews: 56,
      condition: 'Good',
      location: 'University Park Apartments',
      posted: '3 days ago',
      category: 'furniture',
      views: 145
    },
    {
      id: 5,
      title: 'Official CSUN Hoodie - Size M',
      price: 25,
      originalPrice: 45,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop',
      seller: 'Alex K.',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      rating: 4.6,
      reviews: 34,
      condition: 'Like New',
      location: 'Matador Bookstore',
      posted: '1 week ago',
      category: 'clothing',
      views: 98
    },
    {
      id: 6,
      title: 'Modern LED Desk Lamp with USB Port',
      price: 20,
      originalPrice: 40,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=400&fit=crop',
      seller: 'Lisa W.',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      rating: 4.9,
      reviews: 78,
      condition: 'Excellent',
      location: 'Oviatt Library Area',
      posted: '4 days ago',
      category: 'furniture',
      views: 167
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleContactSeller = (item: any) => {
    setSelectedItem(item);
    setShowContactModal(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Search functionality already works through filteredListings
  };

  // ============================================================================
  // FILTERING AND SORTING LOGIC
  // ============================================================================
  
  /**
   * Filter listings based on:
   * 1. Selected category (or 'all' for no filter)
   * 2. Search query (matches title or description)
   * 3. Price range (min and max)
   */
  const filteredListings = listings.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  /**
   * Sort filtered listings based on selected sort option:
   * - 'recent': Default order (newest first)
   * - 'price-low': Lowest price first
   * - 'price-high': Highest price first
   * - 'popular': Most views first
   */
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'popular': return b.views - a.views;
      default: return 0; // Keep original order for 'recent'
    }
  });

  /**
   * Get the color for a category (for badges, buttons, etc.)
   * All categories now use CSUN red (#D22030) for consistency
   */
  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#D22030';
  };

  if (!auth) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#A80532', position: 'relative' }}>
      {/* Animated Background - matching site theme */}
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
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite'
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Back Button */}
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
            const el = e.currentTarget as HTMLElement;
            el.style.background = "#A80532";
            el.style.color = "white";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(255, 255, 255, 0.95)";
            el.style.color = "#A80532";
          }}
        >
          {/* Arrow Icon */}
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

        {/* Hero Section */}
        <div 
          style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '2rem 1.5rem', 
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                marginBottom: '0.5rem',
                color: 'white',
                letterSpacing: '-0.5px'
              }}>
                Marketplace
              </h1>
              <p style={{ 
                fontSize: '1rem', 
                marginBottom: '0', 
                color: 'rgba(255, 255, 255, 0.85)',
                fontWeight: '400'
              }}>
                Buy and sell with fellow Matadors
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                position: 'relative',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for textbooks, electronics, furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 0.5rem',
                    outline: 'none',
                    color: '#111827',
                    fontSize: '0.95rem',
                    border: 'none',
                    background: 'transparent'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    background: showFilters ? '#A80532' : '#f3f4f6',
                    color: showFilters ? 'white' : '#374151',
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
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                  Filters
                </button>
                <button 
                  type="submit"
                  style={{
                    background: '#A80532',
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
                    boxShadow: '0 10px 25px rgba(210, 32, 48, 0.4)'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#8B0428'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#A80532'}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 40, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)' 
        }}>
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
                    whiteSpace: 'nowrap',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: selectedCategory === cat.id ? cat.color : 'transparent',
                    color: selectedCategory === cat.id ? 'white' : '#374151',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== cat.id) {
                      (e.target as HTMLElement).style.background = '#f3f4f6';
                    }
                  }}
                  onMouseLeave={(e) => {
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

        {/* Sort & Filter Bar */}
        <div style={{ background: 'white', borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '1rem 1.5rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ color: '#374151', margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>
              <span style={{ color: '#A80532', fontWeight: '700' }}>{sortedListings.length}</span> items found
            </p>
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
                fontWeight: '500',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <option value="recent" style={{ background: '#1e1e2e' }}>Most Recent</option>
              <option value="price-low" style={{ background: '#1e1e2e' }}>Price: Low to High</option>
              <option value="price-high" style={{ background: '#1e1e2e' }}>Price: High to Low</option>
              <option value="popular" style={{ background: '#1e1e2e' }}>Most Popular</option>
            </select>
          </div>
        </div>

        {/* Item Cards Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {sortedListings.map((item, index) => (
              <div
                key={item.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-4px)';
                  el.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }}
              >
                {/* Image Container */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 }}>
                    {item.trending && (
                      <span style={{
                        background: '#A80532',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>
                        HOT
                      </span>
                    )}
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#059669',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      {item.condition}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      zIndex: 10
                    }}
                  >
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

                {/* Content */}
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ 
                    fontWeight: '600', 
                    fontSize: '1.1rem', 
                    marginBottom: '0.5rem', 
                    color: '#111827',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.title}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#A80532' }}>
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <>
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

                  {/* Seller Info */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #E5E7EB'
                  }}>
                    <img
                      src={item.sellerAvatar}
                      alt={item.seller}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        border: '2px solid #E5E7EB',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: '600', 
                        color: '#374151', 
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.seller}
                      </p>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#6B7280', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg width="12" height="12" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1.5">
                            <polygon points="6 1 7.545 4.13 11 4.635 8.5 7.07 9.09 10.5 6 8.885 2.91 10.5 3.5 7.07 1 4.635 4.455 4.13 6 1"/>
                          </svg>
                          {item.rating}
                        </span>
                        <span>•</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
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

                  {/* Time Posted */}
                  <div style={{ 
                    marginTop: '0.75rem',
                    fontSize: '0.75rem', 
                    color: '#9CA3AF',
                    textAlign: 'center'
                  }}>
                    Posted {item.posted}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {sortedListings.length > 5 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                onClick={() => alert('Pagination feature coming soon!')}
                style={{
                  background: 'white',
                  color: '#A80532',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#F9FAFB'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}
              >
                Load More
              </button>
            </div>
          )}

          {/* No Results */}
          {sortedListings.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '12px',
              margin: '2rem auto',
              maxWidth: '500px'
            }}>
              <svg width="64" height="64" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>No items found</h3>
              <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>

        {/* Sell Item Button */}
        <button 
          onClick={() => alert('Sell Item feature coming soon! Stay tuned.')}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: '#A80532',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '50px',
            boxShadow: '0 4px 12px rgba(168, 5, 50, 0.3)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'all 0.2s',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = 'scale(1.05)';
            (e.target as HTMLElement).style.boxShadow = '0 6px 16px rgba(168, 5, 50, 0.4)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = 'scale(1)';
            (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(168, 5, 50, 0.3)';
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Sell Item
        </button>

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
                    Send a message to {selectedItem.seller}
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
                  src={selectedItem.image}
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
    </div>
  );
};

export default Marketplace;