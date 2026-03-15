// src/firebase/firestore.js
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

const QUESTIONS_PER_PAGE = 10;

// ─── QUESTIONS ────────────────────────────────────────────────────────────────

export const createQuestion = async (userId, data) => {
  const questionRef = await addDoc(collection(db, 'questions'), {
    ...data,
    authorId: userId,
    votes: 0,
    upvoters: [],
    downvoters: [],
    answersCount: 0,
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Increment user question count
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { questionsCount: increment(1) });
  return questionRef.id;
};

export const getQuestion = async (questionId) => {
  const questionRef = doc(db, 'questions', questionId);
  const questionSnap = await getDoc(questionRef);
  if (!questionSnap.exists()) throw new Error('Question not found');
  return { id: questionSnap.id, ...questionSnap.data() };
};

export const incrementQuestionViews = async (questionId) => {
  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, { views: increment(1) });
};

export const getQuestions = async (lastDoc = null, tag = null, searchTerm = null) => {
  let q;
  const constraints = [orderBy('createdAt', 'desc'), limit(QUESTIONS_PER_PAGE)];

  if (tag) {
    constraints.unshift(where('tags', 'array-contains', tag));
  }

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  q = query(collection(db, 'questions'), ...constraints);
  const snapshot = await getDocs(q);

  let questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // Client-side search filter (Firestore doesn't support full-text)
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    questions = questions.filter(
      (q) =>
        q.title?.toLowerCase().includes(term) ||
        q.tags?.some((t) => t.toLowerCase().includes(term))
    );
  }

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
  return { questions, lastVisible, hasMore: snapshot.docs.length === QUESTIONS_PER_PAGE };
};

export const getUserQuestions = async (userId) => {
  const q = query(
    collection(db, 'questions'),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateQuestion = async (questionId, userId, data) => {
  const questionRef = doc(db, 'questions', questionId);
  const questionSnap = await getDoc(questionRef);
  if (!questionSnap.exists()) throw new Error('Question not found');
  if (questionSnap.data().authorId !== userId) throw new Error('Unauthorized');

  const updates = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(questionRef, updates);
};

export const deleteQuestion = async (questionId, userId) => {
  const questionRef = doc(db, 'questions', questionId);
  const questionSnap = await getDoc(questionRef);
  if (!questionSnap.exists()) throw new Error('Question not found');
  if (questionSnap.data().authorId !== userId) throw new Error('Unauthorized');

  await deleteDoc(questionRef);
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { questionsCount: increment(-1) });
};

// ─── VOTING ───────────────────────────────────────────────────────────────────

export const voteOnQuestion = async (questionId, userId, voteType) => {
  const questionRef = doc(db, 'questions', questionId);
  const questionSnap = await getDoc(questionRef);
  const data = questionSnap.data();

  const isUpvoted = data.upvoters?.includes(userId);
  const isDownvoted = data.downvoters?.includes(userId);

  let updates = {};

  if (voteType === 'up') {
    if (isUpvoted) {
      // Remove upvote
      updates = { votes: increment(-1), upvoters: arrayRemove(userId) };
    } else if (isDownvoted) {
      // Switch from downvote to upvote
      updates = { votes: increment(2), upvoters: arrayUnion(userId), downvoters: arrayRemove(userId) };
    } else {
      // New upvote
      updates = { votes: increment(1), upvoters: arrayUnion(userId) };
    }
  } else {
    if (isDownvoted) {
      // Remove downvote
      updates = { votes: increment(1), downvoters: arrayRemove(userId) };
    } else if (isUpvoted) {
      // Switch from upvote to downvote
      updates = { votes: increment(-2), downvoters: arrayUnion(userId), upvoters: arrayRemove(userId) };
    } else {
      // New downvote
      updates = { votes: increment(-1), downvoters: arrayUnion(userId) };
    }
  }

  await updateDoc(questionRef, updates);
};

// ─── ANSWERS ──────────────────────────────────────────────────────────────────

export const createAnswer = async (questionId, userId, content) => {
  const answerRef = await addDoc(collection(db, 'questions', questionId, 'answers'), {
    content,
    authorId: userId,
    votes: 0,
    upvoters: [],
    downvoters: [],
    isAccepted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const questionRef = doc(db, 'questions', questionId);
  await updateDoc(questionRef, { answersCount: increment(1) });
  // Increment user answer count
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { answersCount: increment(1) });
  return answerRef.id;
};

export const subscribeToAnswers = (questionId, callback) => {
  const q = query(
    collection(db, 'questions', questionId, 'answers'),
    orderBy('isAccepted', 'desc'),
    orderBy('votes', 'desc'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const answers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(answers);
  });
};

export const voteOnAnswer = async (questionId, answerId, userId, voteType) => {
  const answerRef = doc(db, 'questions', questionId, 'answers', answerId);
  const answerSnap = await getDoc(answerRef);
  const data = answerSnap.data();

  const isUpvoted = data.upvoters?.includes(userId);
  const isDownvoted = data.downvoters?.includes(userId);
  let updates = {};

  if (voteType === 'up') {
    if (isUpvoted) {
      updates = { votes: increment(-1), upvoters: arrayRemove(userId) };
    } else if (isDownvoted) {
      updates = { votes: increment(2), upvoters: arrayUnion(userId), downvoters: arrayRemove(userId) };
    } else {
      updates = { votes: increment(1), upvoters: arrayUnion(userId) };
    }
  } else {
    if (isDownvoted) {
      updates = { votes: increment(1), downvoters: arrayRemove(userId) };
    } else if (isUpvoted) {
      updates = { votes: increment(-2), downvoters: arrayUnion(userId), upvoters: arrayRemove(userId) };
    } else {
      updates = { votes: increment(-1), downvoters: arrayUnion(userId) };
    }
  }

  await updateDoc(answerRef, updates);
};

export const acceptAnswer = async (questionId, answerId, questionAuthorId, userId) => {
  if (questionAuthorId !== userId) throw new Error('Only question author can accept answers');

  const batch = writeBatch(db);

  // Unaccept all other answers first
  const answersRef = collection(db, 'questions', questionId, 'answers');
  const answersSnap = await getDocs(answersRef);
  answersSnap.docs.forEach((doc) => {
    if (doc.id !== answerId) {
      batch.update(doc.ref, { isAccepted: false });
    }
  });

  // Accept the selected answer
  const answerRef = doc(db, 'questions', questionId, 'answers', answerId);
  batch.update(answerRef, { isAccepted: true });

  // Mark question as answered
  const questionRef = doc(db, 'questions', questionId);
  batch.update(questionRef, { isAnswered: true, acceptedAnswerId: answerId });

  await batch.commit();
};

export const getUserAnswers = async (userId) => {
  // Get all questions then filter answers - note: in production use a denormalized collection
  const questionsSnap = await getDocs(collection(db, 'questions'));
  const answers = [];
  for (const questionDoc of questionsSnap.docs) {
    const answersSnap = await getDocs(
      query(
        collection(db, 'questions', questionDoc.id, 'answers'),
        where('authorId', '==', userId)
      )
    );
    answersSnap.docs.forEach((doc) => {
      answers.push({
        id: doc.id,
        questionId: questionDoc.id,
        questionTitle: questionDoc.data().title,
        ...doc.data(),
      });
    });
  }
  return answers;
};

// ─── COMMENTS ─────────────────────────────────────────────────────────────────

export const addComment = async (questionId, answerId, userId, content) => {
  const commentRef = await addDoc(
    collection(db, 'questions', questionId, 'answers', answerId, 'comments'),
    {
      content,
      authorId: userId,
      createdAt: serverTimestamp(),
    }
  );
  return commentRef.id;
};

export const subscribeToComments = (questionId, answerId, callback) => {
  const q = query(
    collection(db, 'questions', questionId, 'answers', answerId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(comments);
  });
};

export const deleteComment = async (questionId, answerId, commentId, userId) => {
  const commentRef = doc(db, 'questions', questionId, 'answers', answerId, 'comments', commentId);
  const commentSnap = await getDoc(commentRef);
  if (commentSnap.data().authorId !== userId) throw new Error('Unauthorized');
  await deleteDoc(commentRef);
};

// ─── USERS ────────────────────────────────────────────────────────────────────

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User not found');
  return { id: userSnap.id, ...userSnap.data() };
};

export const updateUserProfile = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() });
};

export const getAllTags = async () => {
  const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'), limit(100));
  const snapshot = await getDocs(q);
  const tagCount = {};
  snapshot.docs.forEach((doc) => {
    const tags = doc.data().tags || [];
    tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
};
