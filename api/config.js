/* Set this to the backend origin only, without /v1. Replace with the Render URL after deployment. */
window.CW_API_CONFIG = Object.freeze({
  baseUrl: 'http://localhost:10000',
  requestTimeoutMs: 12000
});

/* Public Firebase Web App configuration belongs here. It is not a service-account secret.
   Copy values from Firebase Console > Project settings > Your apps > Web app.
   Keep the private Firebase Admin service-account JSON only in Render secrets. */
window.CW_FIREBASE_CONFIG = Object.freeze({
  apiKey: 'REPLACE_WITH_FIREBASE_WEB_API_KEY',
  authDomain: 'REPLACE_WITH_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_WITH_FIREBASE_PROJECT_ID',
  appId: 'REPLACE_WITH_FIREBASE_WEB_APP_ID',
  messagingSenderId: 'REPLACE_WITH_SENDER_ID'
});

window.CryptoWiseWaitForAuth = function(){
  if(window.CryptoWiseAuth) return Promise.resolve(window.CryptoWiseAuth);
  if(window.CryptoWiseAuthReady) return window.CryptoWiseAuthReady;
  return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Firebase authentication module did not load. Check your connection.')),15000);window.addEventListener('cryptowise-auth-ready',()=>{clearTimeout(timer);resolve(window.CryptoWiseAuth)}, {once:true})});
};
