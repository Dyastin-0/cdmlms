import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { signInFirebaseAuth } from '../firebase/auth-api.js';
import { signInWithGoogle } from '../firebase/auth-api.js';
import { displayProcessDialog, hideProcessDialog } from '../utils/process-dialog.js';
import { isEmailValidSignIn, warning } from '../utils/validation.js';

const modal = document.querySelector("#sign-in-modal");
const email = modal.querySelector("#sign-in-email");
const password = modal.querySelector("#sign-in-password");
const submit = modal.querySelector("#sign-in-account-button");

const signInGoogle = modal.querySelector("#sign-in-google");

let signingIn = false;
onAuthStateChanged(auth, (user) => {
    if (user && !signingIn) {
        window.location.href = './home.html';
    }
});

bindEvents();

function bindEvents() {
    submit.addEventListener('click', async (e) => {
        e.preventDefault();
        warning("", "sign-in");
        const processMessage = "Signing in...";
        displayProcessDialog(processMessage);
        await signIn();
        hideProcessDialog();
    });
    email.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    password.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    signInGoogle.addEventListener('click', async (e) => {
        e.preventDefault();
        warning("", "sign-in");
        signingIn = true;
        await signInWithGoogle();
    });
}

async function signIn() {
    if (areInputsFilled()) {
        warning("", "sign-in");
        signingIn = true;
        const isSuccess = await signInFirebaseAuth(email.value, password.value);
        if (isSuccess) window.location.href = './home.html';
    }
}

function areInputsFilled() {
    if (!password.value || !email.value) {
        warning("There is an empty field.", "sign-in");
        return false;
    }

    if (!isEmailValidSignIn(email.value)) {
        warning("Invalid email format.", "sign-in");
        return false;
    }

    return true;
}