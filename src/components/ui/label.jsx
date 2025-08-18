import React from 'react';

export const Label = ({ className = '', children, ...props }) => {
  return (
    <label className={`block text-sm font-medium text-foreground ${className}`} {...props}>
      {children}
    </label>
  );
};