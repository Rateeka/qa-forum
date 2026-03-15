// src/hooks/useQuestions.js
import { useState, useEffect, useCallback } from 'react';
import { getQuestions } from '../firebase/firestore';

const useQuestions = (tag = null, searchTerm = null) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getQuestions(null, tag, searchTerm);
      setQuestions(result.questions);
      setLastDoc(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tag, searchTerm]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const result = await getQuestions(lastDoc, tag, searchTerm);
      setQuestions((prev) => [...prev, ...result.questions]);
      setLastDoc(result.lastVisible);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastDoc, tag, searchTerm]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return { questions, loading, loadingMore, hasMore, loadMore, error, refresh: fetchQuestions };
};

export default useQuestions;
