import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-7mrJIeLMm1NImmpYDpANhr3mAta9I3s",
  authDomain: "finwell-29b71.firebaseapp.com",
  projectId: "finwell-29b71",
  storageBucket: "finwell-29b71.appspot.com",
  messagingSenderId: "305565472799",
  appId: "1:305565472799:web:df2a07747125baa7cb1d2a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Signup
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Signup successful! You can now login.");
      document.getElementById("login-tab").click();
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "index.html"; // or wherever you want to go
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
