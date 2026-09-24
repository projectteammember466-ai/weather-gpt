import React from 'react';

export function IconButton({ icon: Icon, label, onClick, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        padding: '0.5rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-color)',
        border: '1px solid var(--surface-border)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary)',
        transition: 'background var(--transition-fast)'
      }}
      className={`icon-btn ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} />}
    </button>
  );
}
