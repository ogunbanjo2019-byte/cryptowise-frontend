'use strict';

/* Set this to the backend origin only, without /v1. Pointing to your live Render backend URL. */
window.CW_API_CONFIG = Object.freeze({
  baseUrl: 'https://cryptowise-backend.onrender.com',
  requestTimeoutMs: 12000
});

window.CW_FIREBASE_CONFIG = Object.freeze({
  apiKey: "AIzaSyAP7macADIcsHR9VbaN03l6eXurgG37JGM",
  authDomain: "cryptobase-4206e.firebaseapp.com",
  projectId: "cryptobase-4206e",
  storageBucket: "cryptobase-4206e.firebasestorage.app",
  messagingSenderId: "259567640543",
  appId: "1:259567640543:web:c80dd21b8febc7999e6e6a",
  measurementId: "G-P7M3V6V5RD"
});

window.CryptoWiseWaitForAuth = function() {
  if (window.CryptoWiseAuth) return Promise.resolve(window.CryptoWiseAuth);
  if (window.CryptoWiseAuthReady) return window.CryptoWiseAuthReady;
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Firebase authentication module did not load. Check your connection.')), 15000);
    window.addEventListener('cryptowise-auth-ready', () => {
      clearTimeout(timer);
      resolve(window.CryptoWiseAuth);
    }, { once: true });
  });
};