import { warning } from '/scripts/validation.js';
import { showSignUp } from './sign-up-ui.js';

const overlay = document.getElementById("overlay");

const openLogIn = document.getElementById("log-in-modal-button");
const logInModal = document.getElementById("log-in-modal");
const closeLogIn = logInModal.querySelector("#log-in-close-button");
const logInForm = logInModal.querySelector("#log-in-form");
const dontHaveAccountLabel = logInModal.querySelector("#dont-have-account");

export function loginUiInit() {
    overlay.addEventListener('click', () => hideLogIn());
    openLogIn.addEventListener('click', () => showLogIn());
    closeLogIn.addEventListener('click', () => hideLogIn());
    dontHaveAccountLabel.addEventListener('click', () => {
        hideLogIn();
        showSignUp();
    });
}

export function showLogIn() {
    overlay.classList.add("active");
    logInModal.classList.add("active");
}

export function hideLogIn() {
    overlay.classList.remove("active");
    logInModal.classList.remove("active");
    logInForm.reset();
    warning("", "log-in");
}

