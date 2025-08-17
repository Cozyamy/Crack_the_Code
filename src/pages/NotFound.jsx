import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="mb-2 text-lg text-gray-900 dark:text-gray-300">Page not found</p>
      <Link to="/" className="text-blue-600 underline">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;