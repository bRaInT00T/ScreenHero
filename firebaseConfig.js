import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDhIkaUw2Q__tQX3wNaFJxBQAerGtlMuH4',
  authDomain: 'screenhero-16359.firebaseapp.com',
  projectId: 'screenhero-16359',
  storageBucket: 'screenhero-16359.firebasestorage.app',
  messagingSenderId: '414591202447',
  appId: '1:414591202447:ios:ea43a57d0a80d5e278acfa',
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
}

const database = getDatabase(firebaseApp);

export { firebaseApp, database };
