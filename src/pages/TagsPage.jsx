// src/pages/TagsPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Search } from 'lucide-react';
import { getAllTags } from '../firebase/firestore';

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllTags()
      .then(setTags)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tags.filter((t) =>
    t.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-100 mb-1">Tags</h1>
        <p className="text-sm text-gray-500">Browse all tags used in questions</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tags…"
          className="input-field pl-9"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No tags found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map(({ tag, count }) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="card-hover p-4 group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Tag size={14} className="text-brand-400" />
                <span className="text-sm font-semibold text-gray-200 group-hover:text-brand-300 transition-colors">
                  {tag}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {count} question{count !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsPage;
