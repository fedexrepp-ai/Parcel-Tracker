import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
    }

});


import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.addEventListener("click", async () => {

    alert("Button clicked");

    try {
        await signInWithEmailAndPassword(
            auth,
            email.value.trim(),
            password.value
        );

        alert("Login successful");

        window.location.href = "admin.html";

    } catch (err) {

        console.error(err);

        alert(err.message);

        error.textContent = err.message;
    }

});
