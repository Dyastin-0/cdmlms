const firebaseConfig = {
  apiKey: "AIzaSyD1x6vjIeLZMeVl8xjuuUW7GvLyDiqgIAY",
  authDomain: "cdmlms.firebaseapp.com",
  projectId: "cdmlms",
  storageBucket: "cdmlms.appspot.com",
  messagingSenderId: "53224930778",
  appId: "1:53224930778:web:50923cf5555c8133d054e3",
  measurementId: "G-TRJ8QD2CLG"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const analytics = firebase.analytics();