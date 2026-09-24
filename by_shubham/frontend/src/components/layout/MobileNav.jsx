import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, MessageSquare, ShieldAlert, History, Settings, Map, 
  MoreHorizontal, GitBranch, X, CalendarRange, Sparkles, ArrowLeftRight 
} from 'lucide-react';

export function MobileNav({ activePage, setActivePage, t = (k) => k }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isMoreActive = ['historical', 'pipeline', 'history', 'settings', 'map'].includes(activePage);

  const tabs = [
    { id: 'home', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'compare', label: t('compare', 'Compare'), icon: ArrowLeftRight },
    { id: 'chat', label: t('chat', 'WeatherGPT AI'), icon: Sparkles },
    { id: 'alerts', label: t('alerts', 'Alerts'), icon: ShieldAlert },
  ];

  const moreItems = [
    { id: 'map', label: t('map', 'Weather Map'), icon: Map },
    { id: 'historical', label: t('historical', 'Historical Weather'), icon: CalendarRange },
    { id: 'pipeline', label: t('howWeatherGPTWorks', 'How WeatherGPT Works'), icon: Sparkles },
    { id: 'history', label: t('history', 'History'), icon: History },
    { id: 'settings', label: t('settings', 'Settings'), icon: Settings },
  ];

  // Close sheet on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowMoreMenu(false);
    };
    if (showMoreMenu) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMoreMenu]);

  return (
    <>
      {/* More Sheet Backdrop */}
      {showMoreMenu && (
        <div 
          onClick={() => setShowMoreMenu(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 49
          }}
          aria-hidden="true"
        />
      )}

      {/* More Sheet Menu for Mobile */}
      {showMoreMenu && (
        <div
          role="dialog"
          aria-label="More Navigation Options"
          style={{
            position: 'fixed',
            bottom: '4.5rem',
            right: '1rem',
            left: '1rem',
            maxWidth: '380px',
            margin: '0 auto',
            background: 'var(--surface-color)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.35)',
            padding: '1rem',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('moreOptions', 'More Options')}
            </span>
            <button
              onClick={() => setShowMoreMenu(false)}
              aria-label="Close menu"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '0.2rem'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setShowMoreMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 750 : 500,
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-primary)',
                  background: isActive ? 'var(--accent-glow)' : 'var(--surface-card)',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--surface-border)',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav 
        className="mobile-bottom-nav"
        aria-label="Mobile Navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--surface-color)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--surface-border)',
          height: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setShowMoreMenu(false);
                setActivePage(tab.id);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: isActive ? 750 : 500,
                padding: '0.35rem 0.5rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* More Tab */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          aria-haspopup="dialog"
          aria-expanded={showMoreMenu}
          aria-label="Open more menu"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            color: isMoreActive || showMoreMenu ? 'var(--accent-blue)' : 'var(--text-muted)',
            fontSize: '0.68rem',
            fontWeight: isMoreActive || showMoreMenu ? 750 : 500,
            padding: '0.35rem 0.5rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer'
          }}
        >
          <MoreHorizontal size={18} />
          <span>More</span>
        </button>

        <style>{`
          @media (min-width: 900px) {
            .mobile-bottom-nav {
              display: none !important;
            }
          }
        `}</style>
      </nav>
    </>
  );
}

