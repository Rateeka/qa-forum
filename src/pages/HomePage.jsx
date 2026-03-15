// src/pages/HomePage.jsx
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { PlusCircle, Flame, Clock, Star, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useQuestions from '../hooks/useQuestions';
import QuestionList from '../components/question/QuestionList';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest', icon: Clock },
  { id: 'hot', label: 'Hot', icon: Flame },
  { id: 'top', label: 'Top', icon: Star },
];

const HomePage = () => {
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tag: tagParam } = useParams();

  const searchTerm = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const activeTag = tagParam || searchParams.get('tag') || '';

  const { questions, loading, loadingMore, hasMore, loadMore, error } = useQuestions(
    activeTag || null,
    searchTerm || null
  );

  const clearSearch = () => setSearchParams({});

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-100">
            {activeTag ? (
              <>Questions tagged <span className="text-brand-400">#{activeTag}</span></>
            ) : searchTerm ? (
              <>Results for <span className="text-brand-400">"{searchTerm}"</span></>
            ) : (
              'All Questions'
            )}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">
              {questions.length} question{questions.length !== 1 ? 's' : ''}
              {!hasMore ? '' : '+'}
            </p>
          )}
        </div>
        {currentUser && (
          <Link to="/ask" className="btn-primary flex-shrink-0">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Ask Question</span>
          </Link>
        )}
      </div>

      {/* Active filters */}
      {(activeTag || searchTerm) && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeTag && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-900/30 border border-brand-800/50 text-brand-300 text-xs rounded-lg">
              Tag: {activeTag}
              <button onClick={clearSearch} className="hover:text-brand-100 transition-colors">
                <X size={12} />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-800 border border-surface-700 text-gray-300 text-xs rounded-lg">
              Search: {searchTerm}
              <button onClick={clearSearch} className="hover:text-gray-100 transition-colors">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Sort tabs */}
      {!searchTerm && !activeTag && (
        <div className="flex gap-1 border-b border-surface-800 pb-0">
          {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSearchParams(id === 'newest' ? {} : { sort: id })}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all border-b-2 -mb-px ${
                sort === id
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card p-4 border-red-800/40 bg-red-950/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Question list */}
      <QuestionList
        questions={questions}
        loading={loading}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        searchTerm={searchTerm}
        tag={activeTag}
      />
    </div>
  );
};

export default HomePage;
