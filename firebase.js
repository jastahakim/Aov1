// @ts-nocheck

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


const firebaseConfig = {

  apiKey: "AIzaSyAtuScaNa-rkPek6vy2OWK4wle4vChrQ9c",

  authDomain: "ao-community.firebaseapp.com",

  projectId: "ao-community",

  storageBucket: "ao-community.firebasestorage.app",

  messagingSenderId: "476112953223",

  appId: "1:476112953223:web:4b2f777b0594b6bae4bd22"

};


/* ==============================
   INITIALIZE AO FIREBASE
================================ */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


console.log(
  "AO Firebase initialized"
);


export {
  app,
  db,
  auth
};