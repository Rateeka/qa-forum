// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { Hexagon, Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center mb-6">
      <Hexagon size={28} className="text-gray-600" />
    </div>
    <h1 className="font-display font-bold text-4xl text-gray-200 mb-2">404</h1>
    <p className="text-lg text-gray-400 mb-1">Page not found</p>
    <p className="text-sm text-gray-600 mb-6 max-w-xs">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary">
      <Home size={16} />
      Back to Home
    </Link>
  </div>
);

export default NotFoundPage;
