// components/ui/card.js

export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 p-4">
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-2 sm:p-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{children}</h3>
);

export const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
);