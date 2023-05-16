import { warning } from '/scripts/utils/validation.js';
import { showSignIn } from './sign-in-ui.js';

const overlay = document.getElementById("overlay");

const openSignUp = document.getElementById("sign-up-modal-button");
const signUpModal = document.getElementById("sign-up-modal");
const closeSignUp = signUpModal.querySelector("#sign-up-close-button");
const signUpForm = signUpModal.querySelector("#sign-up-form");
const haveAccountLabel = signUpModal.querySelector("#have-account");

export function signupUiInit() {
    overlay.addEventListener('click', () => hideSignUp());
    openSignUp.addEventListener('click', () => showSignUp());
    closeSignUp.addEventListener('click', () => hideSignUp());
    haveAccountLabel.addEventListener('click', () => {
        hideSignUp();
        showSignIn();
    });
}

export function showSignUp() {
    signUpModal.classList.add("active");
    overlay.classList.add("active");
}

export function hideSignUp() {
    signUpModal.classList.remove("active");
    overlay.classList.remove("active");
    signUpForm.reset();
    warning("", "sign-up");
}