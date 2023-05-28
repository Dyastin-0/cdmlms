import { hideSignIn } from '../ui/index/sign-in-ui.js';
import { signInFirebaseAuth } from '../firebase/auth-api.js';
import { signInWithGoogle } from '../firebase/auth-api.js';
import { displayProcessDialog, hideProcessDialog } from '../utils/process-dialog.js';
import { warning } from '../utils/validation.js';
import { scrollObserver } from '../observer.js';

const modal = document.querySelector("#sign-in-modal");
const username = modal.querySelector("#sign-in-email");
const password = modal.querySelector("#sign-in-password");
const submit = modal.querySelector("#sign-in-account-button");

const signInGoogle = modal.querySelector("#sign-in-google");

scrollObserver();
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
    username.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    password.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    signInGoogle.addEventListener('click', async (e) => {
        e.preventDefault();
        warning("", "sign-in");
        await signInWithGoogle();
    });
}

async function signIn() {
    warning("", "sign-in");
    const isSigninSuccess = await signInFirebaseAuth(username.value, password.value);
    if (isSigninSuccess) {
        hideSignIn();
        window.location.href = './home.html';
    }
}