// src/components/layout/Sidebar.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, TrendingUp, Info } from 'lucide-react';
import { getAllTags } from '../../firebase/firestore';

const Sidebar = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTags()
      .then((data) => setTags(data.slice(0, 15)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4 sticky top-24">
      {/* Popular Tags */}
      <div className="card p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
          <Tag size={14} className="text-brand-400" />
          Popular Tags
        </h3>
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-6 rounded-md" style={{ width: `${60 + i * 5}%` }} />
            ))}
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(({ tag, count }) => (
              <Link key={tag} to={`/tags/${tag}`} className="tag-chip">
                {tag}
                <span className="ml-1 opacity-60">×{count}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">No tags yet</p>
        )}
        <Link
          to="/tags"
          className="mt-3 text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          View all tags →
        </Link>
      </div>

      {/* Stats */}
      <div className="card p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
          <TrendingUp size={14} className="text-brand-400" />
          Community Stats
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Questions', value: '—' },
            { label: 'Answers', value: '—' },
            { label: 'Members', value: '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="text-gray-300 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help */}
      <div className="card p-4 border-brand-800/30 bg-brand-950/20">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-300 mb-1">New here?</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ask a question to get help from the community. Be specific and include relevant details.
            </p>
            <Link to="/ask" className="mt-2 text-xs text-brand-400 hover:text-brand-300 transition-colors block">
              Ask your first question →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
