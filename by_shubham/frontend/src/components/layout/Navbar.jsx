import React, { useState, useRef, useEffect } from 'react';
import { 
  CloudSun, Sparkles, LayoutDashboard, MessageSquare, History, ShieldAlert, 
  Settings as SettingsIcon, Sun, Moon, Monitor, MapPin, Map, GitBranch, Globe,
  ChevronDown, CalendarRange, ArrowLeftRight, Menu, PanelLeft, PanelLeftOpen, PanelLeftClose
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../data/translations';

export function Navbar({ 
  activePage, 
  setActivePage, 
  theme, 
  setTheme, 
  tempUnit, 
  setTempUnit, 
  city, 
  onRequestLocation, 
  userMode, 
  lang = 'en', 
  setLang,
  sidebarOpen = false,
  onToggleSidebar,
  t = (k) => k
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  // Desktop visible items: Dashboard | Compare | WeatherGPT AI | Map | Alerts | Historical
  const primaryNavItems = [
    { id: 'home', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'compare', label: t('compare', 'Compare'), icon: ArrowLeftRight },
    { id: 'chat', label: t('chat', 'WeatherGPT AI'), icon: Sparkles },
    { id: 'map', label: t('map', 'Map'), icon: Map },
    { id: 'alerts', label: t('alerts', 'Alerts'), icon: ShieldAlert },
    { id: 'historical', label: t('historical', 'Historical Weather'), icon: CalendarRange }
  ];

  // Secondary items moved into More ▾ dropdown: How WeatherGPT Works | History | Settings
  const moreNavItems = [
    { id: 'pipeline', label: t('howWeatherGPTWorks', 'How WeatherGPT Works'), icon: Sparkles },
    { id: 'history', label: t('history', 'History'), icon: History },
    { id: 'settings', label: t('settings', 'Settings'), icon: SettingsIcon }
  ];

  const isMoreActive = moreNavItems.some(item => item.id === activePage);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMoreOpen(false);
      }
    };

    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const cycleLanguage = () => {
    if (lang === 'en') setLang('hi');
    else if (lang === 'hi') setLang('hinglish');
    else setLang('en');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={16} className="text-amber-400" />;
    if (theme === 'dark') return <Moon size={16} className="text-indigo-400" />;
    return <Monitor size={16} className="text-sky-400" />;
  };

  return (
    <header className="mobile-header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'var(--surface-color)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--surface-border)',
      height: '4.25rem',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Sidebar Open/Close Toggle Button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="navbar-sidebar-toggle-btn"
              style={{
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
              title={sidebarOpen ? t('closeSidebar', 'Close Sidebar') : t('openSidebar', 'Open Sidebar')}
              aria-label={sidebarOpen ? t('closeSidebar', 'Close Sidebar') : t('openSidebar', 'Open Sidebar')}
            >
              <Menu size={20} />
            </button>
          )}

          {/* Brand */}
          <div 
            onClick={() => setActivePage('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActivePage('home')}
            aria-label="WeatherGPT Home"
          >
          <div style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))',
            color: '#fff',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CloudSun size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 850, letterSpacing: '-0.02em' }}>WeatherGPT</span>
              <span className="badge badge-info" style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                <Sparkles size={10} /> AI
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {t('atmosphericIntelligence', 'Conversational Weather Intelligence')}
            </span>
          </div>
        </div>
      </div>

        {/* Desktop Nav Links (strictly limited to Dashboard, Map, AI Chat, Alerts, More ▾) */}
        <nav style={{ display: 'none' }} className="desktop-nav" aria-label="Main Navigation">
          <ul style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', listStyle: 'none', margin: 0, padding: 0 }}>
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActivePage(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 750 : 500,
                      color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                      border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                      transition: 'all var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

            {/* More ▾ Dropdown */}
            <li ref={moreRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                aria-label="More Navigation Options"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: isMoreActive ? 750 : 500,
                  color: isMoreActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  background: isMoreActive ? 'var(--accent-glow)' : 'transparent',
                  border: isMoreActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
              >
                <span>{t('more', 'More')}</span>
                <ChevronDown 
                  size={14} 
                  style={{ 
                    transform: moreOpen ? 'rotate(180deg)' : 'none', 
                    transition: 'transform 0.15s ease' 
                  }} 
                />
              </button>

              {/* Dropdown Card */}
              {moreOpen && (
                <div
                  role="menu"
                  aria-label="Additional Navigation"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    width: '180px',
                    background: 'var(--surface-color)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 12px 30px -6px rgba(0, 0, 0, 0.25)',
                    padding: '0.4rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  {moreNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        role="menuitem"
                        onClick={() => {
                          setActivePage(item.id);
                          setMoreOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.55rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 750 : 500,
                          color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)',
                          background: isActive ? 'var(--accent-glow)' : 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          width: '100%',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'var(--surface-card)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Icon size={16} style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Top Right Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Active Context Mode Tag */}
          {userMode && userMode !== 'general' && (
            <span 
              onClick={() => setActivePage('settings')}
              className="badge badge-advisory" 
              style={{ display: 'none', cursor: 'pointer', fontSize: '0.68rem' }}
              title={t('clickToModifyMode', 'Current Context Mode - Click to change in Settings')}
              id="nav-user-mode"
            >
              {t('mode', 'Mode')}: {userMode}
            </span>
          )}

          {/* Current City Indicator Badge */}
          <div 
            title={`Current location: ${city || 'Location'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              fontWeight: 600
            }}
          >
            <MapPin size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>{city ? city.charAt(0).toUpperCase() + city.slice(1) : 'Location'}</span>
          </div>

          {/* Quick Language Toggle (A12) */}
          {setLang && (
            <button
              onClick={cycleLanguage}
              title={`Active Language: ${lang.toUpperCase()} - Click to switch`}
              aria-label={`Switch language. Current: ${lang.toUpperCase()}`}
              style={{
                padding: '0.4rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <Globe size={13} />
              <span>{lang.toUpperCase()}</span>
            </button>
          )}

          {/* °C / °F Toggle */}
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            title="Toggle Temperature Unit"
            aria-label={`Toggle temperature unit. Currently °${tempUnit}`}
            style={{
              padding: '0.4rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--accent-blue)',
              cursor: 'pointer'
            }}
          >
            °{tempUnit}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            title={`Theme: ${theme.toUpperCase()}`}
            aria-label={`Switch color theme. Current theme: ${theme}`}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-card)',
              border: '1px solid var(--surface-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {getThemeIcon()}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: block !important;
          }
          #nav-user-mode {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
