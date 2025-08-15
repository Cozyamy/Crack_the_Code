export const Badge = ({ children, variant = 'default', className = '' }) => {
  const base = 'inline-block text-xs px-2 py-1 rounded font-semibold';
  const variants = {
    default: 'bg-blue-600 text-white',
    outline: 'border border-gray-400 text-gray-700 dark:border-gray-600 dark:text-gray-300',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};