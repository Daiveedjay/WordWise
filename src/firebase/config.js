import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth, GithubAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5OB0YqooPC9iwf3mBh70p8soB1QWlqgw",
  authDomain: "wordwise-25ad3.firebaseapp.com",
  projectId: "wordwise-25ad3",
  storageBucket: "wordwise-25ad3.appspot.com",
  messagingSenderId: "155295006536",
  appId: "1:155295006536:web:7c0577e784ee903c7e7d7d",
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, db, googleProvider, githubProvider };
