import { warning } from "./validation.js";

const overlay = document.getElementById("overlay");

const openLogIn = document.getElementById("log-in-modal-button");
const logInModal = document.getElementById("log-in-modal");
const closeLogIn = logInModal.querySelector("#log-in-close-button");
const logInForm = logInModal.querySelector("#log-in-form");
const dontHaveAccountLabel = logInModal.querySelector("#dont-have-account");

const openSignUp = document.getElementById("sign-up-modal-button");
const signUpModal = document.getElementById("sign-up-modal");
const closeSignUp = signUpModal.querySelector("#sign-up-close-button");
const signUpForm = signUpModal.querySelector("#sign-up-form");
const haveAccountLabel = signUpModal.querySelector("#have-account");

export function loginUiInit() {
    overlay.addEventListener('click', () => hideLogIn());
    openLogIn.addEventListener('click', () => showLogIn());
    closeLogIn.addEventListener('click', () => hideLogIn());
    dontHaveAccountLabel.addEventListener('click', () => {
        hideLogIn();
        showSignUp();
    });
}

export function signupUiInit() {
    overlay.addEventListener('click', () => hideSignUp());
    openSignUp.addEventListener('click', () => showSignUp());
    closeSignUp.addEventListener('click', () => hideSignUp());
    haveAccountLabel.addEventListener('click', () => {
        hideSignUp();
        showLogIn();
    });


}

function showLogIn() {
    overlay.classList.add("active");
    logInModal.classList.add("active");
}

export function hideLogIn() {
    overlay.classList.remove("active");
    logInModal.classList.remove("active");
    logInForm.reset();
    warning("", "log-in");
}

function showSignUp() {
    signUpModal.classList.add("active");
    overlay.classList.add("active");
}

export function hideSignUp() {
    signUpModal.classList.remove("active");
    overlay.classList.remove("active");
    signUpForm.reset();
    warning("", "sign-up");
}
