// src/components/common/UserMeta.jsx
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar';

const UserMeta = ({ userId, displayName, photoURL, timestamp, prefix = 'asked' }) => {
  const timeAgo = timestamp?.toDate
    ? formatDistanceToNow(timestamp.toDate(), { addSuffix: true })
    : 'recently';

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <span>{prefix}</span>
      <span>{timeAgo}</span>
      <span>by</span>
      <Link
        to={`/profile/${userId}`}
        className="flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <Avatar src={photoURL} name={displayName} size="xs" />
        <span className="font-medium">{displayName || 'Anonymous'}</span>
      </Link>
    </div>
  );
};

export default UserMeta;
