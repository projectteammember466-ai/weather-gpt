import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: '1.25rem' }} {...props}>
      {children}
    </div>
  );
}
