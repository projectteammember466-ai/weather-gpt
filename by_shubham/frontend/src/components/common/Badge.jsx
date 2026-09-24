import React from 'react';

export function Badge({ children, variant = 'info', className = '', ...props }) {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}
