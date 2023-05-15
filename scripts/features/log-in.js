import { loginUiInit } from '../ui/index/log-in-ui.js';
import { logInFirebaseAuth } from '../firebase/auth-api.js';

const modal = document.querySelector("#log-in-modal");
const username = modal.querySelector("#log-in-email");
const password = modal.querySelector("#log-in-password");
const submit = modal.querySelector("#log-in-account-button");

observerScroll();
loginUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click', () => logIn());
    username.addEventListener('keyup', (e) => {
        e.key === "Enter" ? logIn() : null;
    });
    password.addEventListener('keyup', (e) => {
        e.key === "Enter" ? logIn() : null;
    });
}

async function logIn() {
    const isLoginSuccess = await logInFirebaseAuth(username.value, password.value);
    if (isLoginSuccess) {
        window.location.href = './home.html';
    }
}