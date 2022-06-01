// Import the functions you need from the SDKs you need
// const firebase = require("firebase");
// // const {getDatabase} =  require("firebase/database");
// // const { getFirestore, collection, getDocs } = require('firebase/firestore');
// // import { getDatabase } from "firebase/database";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyArMlaVOYWpdg0jMTF-9dWq2Uw4fisffNY",
//   authDomain: "test-1de50.firebaseapp.com",
//   databaseURL: "https://test-1de50-default-rtdb.firebaseio.com",
//   projectId: "test-1de50",
//   storageBucket: "test-1de50.appspot.com",
//   messagingSenderId: "686425594604",
//   appId: "1:686425594604:web:2380d4ef2a42ac86e9e3c9",
//   measurementId: "G-WP71PPYQ4T"
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // const db = getDatabase(app);

// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();
// const database = db.collection("students");
// module.exports = database;


const firebase = require("firebase");
const firebaseConfig = {
  apiKey: "AIzaSyArMlaVOYWpdg0jMTF-9dWq2Uw4fisffNY",
  authDomain: "test-1de50.firebaseapp.com",
  databaseURL: "https://test-1de50-default-rtdb.firebaseio.com/",
  projectId: "test-1de50",
  storageBucket: "test-1de50.appspot.com",
  messagingSenderId: "686425594604",
  appId: "1:686425594604:web:2380d4ef2a42ac86e9e3c9",
  measurementId: "G-WP71PPYQ4T"
};
const db = firebase.initializeApp(firebaseConfig);
const database = firebase.database()
module.exports = database;