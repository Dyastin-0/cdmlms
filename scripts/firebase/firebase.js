import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1x6vjIeLZMeVl8xjuuUW7GvLyDiqgIAY",
  authDomain: "cdmlms.firebaseapp.com",
  projectId: "cdmlms",
  storageBucket: "cdmlms.appspot.com",
  messagingSenderId: "53224930778",
  appId: "1:53224930778:web:50923cf5555c8133d054e3",
  measurementId: "G-TRJ8QD2CLG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export {
  auth,
  db,
  storage,
  analytics
}