import { auth } from "../../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { signOutFirebaseAuth } from "../../firebase/auth-api.js";

const indexNavbar = document.querySelector("#index-navbar")

const openSignIn = indexNavbar.querySelector("#sign-in-modal-button");

const openSignUp = indexNavbar.querySelector("#sign-up-modal-button");

const homeButton = indexNavbar.querySelector("#home");
const signOutButton = indexNavbar.querySelector("#sign-out-button");

const splashScreen = document.querySelector("#splash-screen");

onAuthStateChanged(auth, async (user) => {
    await user ? showSignedInButtons() : showSignedOutButtons();
    splashScreen.remove();
});

navUiInit();

async function navUiInit() {
    bindEvents();
}

function bindEvents() {
    signOutButton.addEventListener('click', async () => {
        await signOutFirebaseAuth();
        window.location.href = './';
    });
}

function showSignedInButtons() {
    openSignIn.style.display = "none";
    openSignUp.style.display = "none";
    homeButton.style.display = "flex";
    signOutButton.style.display = "flex";
}

function showSignedOutButtons() {
    openSignIn.style.display = "flex";
    openSignUp.style.display = "flex";
    homeButton.style.display = "none";
    signOutButton.style.display = "none";
}