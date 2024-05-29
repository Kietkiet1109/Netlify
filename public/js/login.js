import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBfYnMEFewHDlRoUrzzwkRRzKJV4a0ShcQ",
    authDomain: "fresh-stock-21eb2.firebaseapp.com",
    projectId: "fresh-stock-21eb2",
    storageBucket: "fresh-stock-21eb2.appspot.com",
    messagingSenderId: "232096998515",
    appId: "1:232096998515:web:a38d36806b663a60573606"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the Google Login button
    document.getElementById('login-google').addEventListener('click', () => {
        signInWithPopup(auth, googleProvider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            const email = user.email;
            const pass = "freshstock"; // Default Password for Google login

            // Send the user data to your server
            fetch('/loggingin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    email: email,
                    password: pass 
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/home"; // Redirect to homepage if success
                } else {
                    alert("User not found"); // Show the alert if fail
                }
            })
        }).catch((error) => {
            console.error(error);
        })
    });

    // Add event listener to the Facebook Login button
    document.getElementById('login-facebook').addEventListener('click', () => {
        signInWithPopup(auth, facebookProvider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            const email = user.email;
            const pass = "freshstock"; // Default Password for Facebook login

            // Send the user data to your server
            fetch('/loggingin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                    body: JSON.stringify({
                    email: email,
                    password: pass 
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/home"; // Redirect to homepage if success
                } else {
                    alert("User not found"); // Show the alert if fail
                }
            })
        }).catch((error) => {
            console.error(error);
        });
    })
});