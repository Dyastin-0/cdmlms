const firebaseConfig = {
  apiKey: "AIzaSyB3GKLWSftrpcfQjahN0TGlyLnIMHG9ZUA",
  authDomain: "librarymanagementsystem-f950a.firebaseapp.com",
  databaseURL: "https://librarymanagementsystem-f950a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "librarymanagementsystem-f950a",
  storageBucket: "librarymanagementsystem-f950a.appspot.com",
  messagingSenderId: "71574320410",
  appId: "1:71574320410:web:069d5c5a3c0c3ef0bea8a3",
  measurementId: "G-S7H8LTEH2P"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();