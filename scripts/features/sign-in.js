import { signInUiInit } from '../ui/index/sign-in-ui.js';
import { signInFirebaseAuth } from '../firebase/auth-api.js';
import { signInWithGoogle } from '../firebase/auth-api.js';

const modal = document.querySelector("#sign-in-modal");
const username = modal.querySelector("#sign-in-email");
const password = modal.querySelector("#sign-in-password");
const submit = modal.querySelector("#sign-in-account-button");

const signInGoogle = modal.querySelector("#sign-in-google");

observerScroll();
signInUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        signIn();
    });
    username.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    password.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    signInGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        signInWithGoogle();
    });
}

async function signIn() {
    const isSigninSuccess = await signInFirebaseAuth(username.value, password.value);
    if (isSigninSuccess) window.location.href = './home.html';
}