// src/components/question/QuestionList.jsx
import { useEffect, useRef, useCallback } from 'react';
import QuestionCard from './QuestionCard';
import { QuestionCardSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import { MessageSquarePlus, Loader2 } from 'lucide-react';

const QuestionList = ({ questions, loading, loadingMore, hasMore, onLoadMore, searchTerm, tag }) => {
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loadingMore, loading, onLoadMore]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <QuestionCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <EmptyState
        icon={MessageSquarePlus}
        title={searchTerm ? `No results for "${searchTerm}"` : tag ? `No questions tagged "${tag}"` : 'No questions yet'}
        description={
          searchTerm
            ? 'Try different keywords or browse all questions.'
            : 'Be the first to ask a question in this community!'
        }
        actionLabel="Ask a Question"
        actionTo="/ask"
      />
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <div key={question.id} className="animate-slide-up">
          <QuestionCard question={question} />
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="text-brand-400 animate-spin" />
        </div>
      )}

      {!hasMore && questions.length > 0 && (
        <p className="text-center text-xs text-gray-600 py-4">
          You've reached the end · {questions.length} question{questions.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default QuestionList;
