import React from 'react';
import { 
  CloudSun, Sparkles, LayoutDashboard, Map, MessageSquare, ShieldAlert, 
  CalendarRange, GitBranch, History, Settings as SettingsIcon, 
  Sun, Moon, Monitor, MapPin, Globe, ArrowLeftRight, PanelLeftClose
} from 'lucide-react';

export function Sidebar({
  activePage,
  setActivePage,
  theme,
  setTheme,
  tempUnit,
  setTempUnit,
  city,
  userMode,
  lang = 'en',
  setLang,
  isOpen = true,
  onClose,
  t = (k, f) => f || k
}) {
  // Primary Navigation: Dashboard, Compare Weather, WeatherGPT AI, Map, Alerts, Historical Weather
  const primaryNavItems = [
    { id: 'home', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'compare', label: t('compare', 'Compare Weather'), icon: ArrowLeftRight },
    { id: 'chat', label: t('chat', 'WeatherGPT AI'), icon: Sparkles, isAI: true },
    { id: 'map', label: t('map', 'Weather Map'), icon: Map },
    { id: 'alerts', label: t('alerts', 'Alerts'), icon: ShieldAlert },
    { id: 'historical', label: t('historical', 'Historical Weather'), icon: CalendarRange }
  ];

  // Secondary Navigation: How WeatherGPT Works, History, Settings
  const secondaryNavItems = [
    { id: 'pipeline', label: t('howWeatherGPTWorks', 'How WeatherGPT Works'), icon: Sparkles },
    { id: 'history', label: t('history', 'History'), icon: History },
    { id: 'settings', label: t('settings', 'Settings'), icon: SettingsIcon }
  ];

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
    if (theme === 'light') return <Sun size={15} className="text-amber-400" />;
    if (theme === 'dark') return <Moon size={15} className="text-indigo-400" />;
    return <Monitor size={15} className="text-sky-400" />;
  };

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (onClose && window.innerWidth < 900) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile/Overlay Backdrop */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={`app-sidebar ${isOpen ? 'expanded' : 'collapsed'}`} 
        aria-label="Desktop Vertical Navigation"
      >
        {/* Brand Header & Sidebar Close Button */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.5rem 0.25rem 1.25rem 0.25rem',
            borderBottom: '1px solid var(--surface-border)'
          }}
        >
          <div
            onClick={() => handleNavClick('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              flex: 1,
              minWidth: 0
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavClick('home')}
            aria-label="WeatherGPT Home"
          >
            <div style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-indigo))',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)',
              flexShrink: 0
            }}>
              <CloudSun size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 850, letterSpacing: '-0.02em' }}>WeatherGPT</span>
                <span className="badge badge-info" style={{ padding: '0.12rem 0.35rem', fontSize: '0.62rem' }}>
                  <Sparkles size={9} /> AI
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t('atmosphericIntelligence', 'Atmospheric Intelligence')}
              </span>
            </div>
          </div>

          {/* Close Sidebar Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="sidebar-close-btn"
              style={{
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all var(--transition-fast)'
              }}
              title={t('closeSidebar', 'Close Sidebar')}
              aria-label={t('closeSidebar', 'Close Sidebar')}
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

      {/* Navigation Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem', flex: 1, overflowY: 'auto' }}>
        {/* Primary Navigation */}
        <div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 750,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            paddingLeft: '0.5rem',
            display: 'block',
            marginBottom: '0.4rem'
          }}>
            {t('overviewTelemetry', 'Overview & Telemetry')}
          </span>
          <nav aria-label="Primary Navigation">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const isAI = item.isAI;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        position: 'relative',
                        border: isAI 
                          ? (isActive ? '1px solid var(--accent-blue)' : '1px solid rgba(56, 189, 248, 0.35)') 
                          : undefined,
                        background: isAI && !isActive 
                          ? 'rgba(56, 189, 248, 0.04)' 
                          : undefined,
                        boxShadow: isAI ? '0 0 10px rgba(56, 189, 248, 0.12)' : undefined
                      }}
                    >
                      <Icon 
                        size={17} 
                        style={{ 
                          color: isAI ? 'var(--accent-blue)' : (isActive ? 'var(--accent-blue)' : 'var(--text-muted)'), 
                          flexShrink: 0 
                        }} 
                      />
                      <span style={{ fontWeight: isAI ? 700 : undefined }}>{item.label}</span>
                      {isAI && (
                        <span 
                          className="badge badge-info" 
                          style={{ 
                            marginLeft: 'auto', 
                            fontSize: '0.58rem', 
                            padding: '0.08rem 0.3rem',
                            borderRadius: '4px'
                          }}
                        >
                          AI
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 750,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            paddingLeft: '0.5rem',
            display: 'block',
            marginBottom: '0.4rem'
          }}>
            {t('exploreTools', 'Explore & Tools')}
          </span>
          <nav aria-label="Secondary Navigation">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={17} style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)', flexShrink: 0 }} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Utility Controls */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid var(--surface-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Active Context Mode Tag */}
        {userMode && userMode !== 'general' && (
          <div 
            onClick={() => setActivePage('settings')}
            className="badge badge-advisory" 
            style={{ cursor: 'pointer', fontSize: '0.7rem', width: 'fit-content', padding: '0.2rem 0.5rem' }}
            title={t('clickToModifyMode', 'Current Context Mode - Click to modify in Settings')}
          >
            {t('mode', 'Mode')}: {userMode}
          </div>
        )}

        {/* Selected City Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-color)',
          border: '1px solid var(--surface-border)',
          fontSize: '0.82rem',
          color: 'var(--text-primary)'
        }}>
          <MapPin size={15} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <span style={{ fontWeight: 650, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {city ? city.charAt(0).toUpperCase() + city.slice(1) : t('location', 'Location')}
          </span>
        </div>

        {/* Compact Utility Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
          {/* Quick Language Toggle */}
          {setLang && (
            <button
              onClick={cycleLanguage}
              title={`Switch language. Current: ${lang.toUpperCase()}`}
              aria-label={`Switch language. Current: ${lang.toUpperCase()}`}
              style={{
                flex: 1,
                padding: '0.4rem 0.3rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              <Globe size={13} />
              <span>{lang.toUpperCase()}</span>
            </button>
          )}

          {/* °C / °F Unit Toggle */}
          <button
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            title="Toggle temperature unit"
            aria-label={`Toggle temperature unit. Currently °${tempUnit}`}
            style={{
              flex: 1,
              padding: '0.4rem 0.3rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-color)',
              border: '1px solid var(--surface-border)',
              fontSize: '0.78rem',
              fontWeight: 750,
              color: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            °{tempUnit}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={cycleTheme}
            title={`Switch color theme. Current: ${theme}`}
            aria-label={`Switch color theme. Current theme: ${theme}`}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-color)',
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
    </aside>
    </>
  );
}
