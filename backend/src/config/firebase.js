import admin from 'firebase-admin';
import config from './env.js';

let firebaseApp = null;
let firestoreDb = null;
let isInitialized = false;

function initFirebase() {
  if (isInitialized && firestoreDb) {
    return { app: firebaseApp, db: firestoreDb, initialized: true };
  }

  const { projectId, clientEmail, privateKey } = config.firebase;

  if (projectId && clientEmail && privateKey) {
    try {
      if (!admin.apps.length) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey
          })
        });
      } else {
        firebaseApp = admin.app();
      }
      firestoreDb = admin.firestore();
      isInitialized = true;
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (err) {
      console.warn('Firebase Admin SDK initialization warning:', err.message);
      isInitialized = false;
      firestoreDb = null;
    }
  } else {
    // Graceful unconfigured mode for local dev / tests when credentials are not present
    isInitialized = false;
    firestoreDb = null;
  }

  return { app: firebaseApp, db: firestoreDb, initialized: isInitialized };
}

// Perform initialization attempt
initFirebase();

export function getFirestoreDb() {
  return firestoreDb;
}

export function isFirebaseConfigured() {
  return isInitialized;
}

export default {
  getDb: getFirestoreDb,
  isConfigured: isFirebaseConfigured,
  admin
};
