import React from 'react';
import classNames from 'classnames';

export const Button = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const baseStyles =
    'rounded font-medium focus:outline-none transition-colors duration-200';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    outline:
      'border border-gray-400 text-gray-800 hover:bg-gray-100 ' +
      'dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={classNames(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};