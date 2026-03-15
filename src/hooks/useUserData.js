// src/hooks/useUserData.js
import { useEffect, useState } from 'react';
import { getUserProfile } from '../firebase/firestore';

// Simple in-memory cache to avoid redundant Firestore reads
const cache = {};

const useUserData = (userId) => {
  const [userData, setUserData] = useState(cache[userId] || null);
  const [loading, setLoading] = useState(!cache[userId]);

  useEffect(() => {
    if (!userId) return;
    if (cache[userId]) {
      setUserData(cache[userId]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserProfile(userId)
      .then((data) => {
        cache[userId] = data;
        setUserData(data);
      })
      .catch(() => setUserData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  return { userData, loading };
};

export default useUserData;
