// src/firebase/storage.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a profile picture and return the download URL
 */
export const uploadProfilePicture = async (userId, file) => {
  if (!file) throw new Error('No file provided');
  if (!file.type.startsWith('image/')) throw new Error('File must be an image');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be less than 5MB');

  const storageRef = ref(storage, `profile-pictures/${userId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};

/**
 * Delete a file by its full storage URL
 */
export const deleteFile = async (fileUrl) => {
  const fileRef = ref(storage, fileUrl);
  await deleteObject(fileRef);
};
