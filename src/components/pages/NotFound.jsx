import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mb-8">
          <ApperIcon name="FileQuestion" size={64} className="text-slate-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-600">The page you're looking for doesn't exist.</p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
        >
          <ApperIcon name="Home" size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;