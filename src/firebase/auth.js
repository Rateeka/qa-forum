// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './config';

/**
 * Create user document in Firestore after registration/login
 */
const createUserDocument = async (user, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { displayName, email, photoURL } = user;
    await setDoc(userRef, {
      uid: user.uid,
      displayName: displayName || additionalData.displayName || 'Anonymous',
      email: email || '',
      photoURL: photoURL || null,
      bio: '',
      reputation: 0,
      questionsCount: 0,
      answersCount: 0,
      totalUpvotes: 0,
      createdAt: serverTimestamp(),
      ...additionalData,
    });
  }
  return userRef;
};

/**
 * Register with email and password
 */
export const registerWithEmail = async (email, password, displayName) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await createUserDocument(user, { displayName });
  return user;
};

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

/**
 * Sign in with Google
 */
export const loginWithGoogle = async () => {
  const { user } = await signInWithPopup(auth, googleProvider);
  await createUserDocument(user);
  return user;
};

/**
 * Sign out
 */
export const logout = async () => {
  await signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export { createUserDocument };
