import { warning } from './validation.js';
import { loginUiInit } from './ui/index/log-in-ui.js';
import { logInFirebaseAuth } from './auth-api.js';

const modal = document.getElementById("log-in-modal");
const username = modal.querySelector("#log-in-email");
const password = modal.querySelector("#log-in-password");
const submit = modal.querySelector("#log-in-account-button");

observerScroll();

loginUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click', async () => logIn());
    username.addEventListener('keyup', () => warning("", "log-in"));
    password.addEventListener('keyup', () => warning("", "log-in"));
}

async function logIn() {
    const isLoginSuccess = await logInFirebaseAuth(username.value, password.value);
    if (isLoginSuccess) {
        window.location.href = './home.html';
    }
}