'use strict';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  sendEmailVerification, 
  setPersistence, 
  browserSessionPersistence, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const cfg = window.CW_FIREBASE_CONFIG || {};
const configured = Boolean(
  cfg.apiKey && 
  cfg.authDomain && 
  cfg.projectId && 
  cfg.appId && 
  !String(cfg.apiKey).startsWith('REPLACE_') && 
  !String(cfg.projectId).startsWith('REPLACE_')
);

let auth = null;

if (configured) {
  const app = initializeApp(cfg);
  auth = getAuth(app);
  window.CryptoWiseAPI?.setTokenProvider(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Please sign in first.');
    return user.getIdToken();
  });
}

function needConfig() {
  if (!configured || !auth) {
    throw new Error('Firebase Web App configuration is missing. Set api/config.js from your Firebase Project settings first.');
  }
}

const authApi = {
  configured,
  isSignedIn: () => Boolean(auth?.currentUser),
  currentUser: () => auth?.currentUser || null,
  getIdToken: async () => {
    needConfig();
    if (!auth.currentUser) throw new Error('Please sign in first.');
    return auth.currentUser.getIdToken();
  },
  signUp: async ({ email, password, displayName }) => {
    needConfig();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    await signOut(auth);
    return cred.user;
  },
  signIn: async (email, password) => {
    needConfig();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email before using the account. Check your inbox for the verification link.');
    }
    return cred.user;
  },
  adminSignIn: async (email, password) => {
    needConfig();
    await setPersistence(auth, browserSessionPersistence);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const result = await cred.user.getIdTokenResult(true);
    const c = result.claims;
    if (c.admin !== true || !['owner', 'admin', 'finance', 'compliance', 'support'].includes(c.role)) {
      await signOut(auth);
      throw new Error('This account has no authorized staff role. Ask the system owner to grant the correct role.');
    }
    return cred.user;
  },
  signOut: async () => {
    needConfig();
    return signOut(auth);
  },
  onAuthStateChanged: callback => {
    needConfig();
    return onAuthStateChanged(auth, callback);
  },
  waitForUser: () => {
    needConfig();
    return new Promise(resolve => {
      let unsub;
      unsub = onAuthStateChanged(auth, user => {
        unsub();
        resolve(user);
      });
    });
  }
};

window.CryptoWiseAuth = Object.freeze(authApi);
window.CryptoWiseAuthReady = Promise.resolve(authApi);
window.dispatchEvent(new Event('cryptowise-auth-ready'));

if (configured) {
  window.CryptoWiseAPI?.setTokenProvider(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Please sign in first.');
    return user.getIdToken();
  });
}
