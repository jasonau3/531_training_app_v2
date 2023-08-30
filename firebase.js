import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAy5My7QPjuqXi_iOS35fu90k3dUy1Sw5w',
    authDomain: 'training-app-396015.firebaseapp.com',
    databaseURL: 'https://training-app-396015-default-rtdb.firebaseio.com',
    projectId: 'training-app-396015',
    storageBucket: 'training-app-396015.appspot.com',
    messagingSenderId: '939886983653',
    appId: '1:939886983653:web:ab4775c87e05251a34d70c',
    measurementId: 'G-JFL5ZX3X61',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

// IOS: 939886983653-ooq53ookacop54vgjmbo4unpvmct79s7.apps.googleusercontent.com
