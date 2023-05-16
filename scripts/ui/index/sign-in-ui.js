import { warning } from '/scripts/utils/validation.js';
import { showSignUp } from './sign-up-ui.js';

const overlay = document.getElementById("overlay");

const openSignIn = document.getElementById("sign-in-modal-button");
const signInModal = document.getElementById("sign-in-modal");
const closeSignIn = signInModal.querySelector("#sign-in-close-button");
const signInForm = signInModal.querySelector("#sign-in-form");
const dontHaveAccountLabel = signInModal.querySelector("#dont-have-account");

export function signInUiInit() {
    overlay.addEventListener('click', () => hideSignIn());
    openSignIn.addEventListener('click', () => showSignIn());
    closeSignIn.addEventListener('click', () => hideSignIn());
    dontHaveAccountLabel.addEventListener('click', () => {
        hideSignIn();
        showSignUp();
    });
}

export function showSignIn() {
    overlay.classList.add("active");
    signInModal.classList.add("active");
}

export function hideSignIn() {
    overlay.classList.remove("active");
    signInModal.classList.remove("active");
    signInForm.reset();
    warning("", "sign-in");
}

