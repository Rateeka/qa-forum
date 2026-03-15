// src/components/common/EmptyState.jsx
import { Link } from 'react-router-dom';
import { MessageSquarePlus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = MessageSquarePlus,
  title = 'Nothing here yet',
  description = 'Be the first to contribute.',
  actionLabel,
  actionTo,
}) => (
  <div className="card p-12 text-center animate-fade-in">
    <div className="w-14 h-14 bg-surface-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Icon size={24} className="text-gray-500" />
    </div>
    <h3 className="text-base font-semibold text-gray-300 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">{description}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn-primary inline-flex">
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
