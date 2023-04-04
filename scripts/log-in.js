import { toSha256, warning } from './validation.js';
import { isUsernameAndPasswordMatched } from './authentication.js';
import { generateToken, saveToken } from './auth-token.js';
import { loginUiInit, hideLogIn } from './ui/index/log-in-ui.js';
import { redirect } from './user.js';
import { logInFirebaseAuth } from './auth-api.js';

const modal = document.getElementById("log-in-modal");
const username = modal.querySelector("#log-in-username");
const password = modal.querySelector("#log-in-password");
const submit = modal.querySelector("#log-in-account-button");

redirect();
observerScroll();

loginUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click', async () => logIn());
    username.addEventListener('keyup', () => warning("", "log-in"));
    password.addEventListener('keyup', () => warning("", "log-in"));
}

async function logIn() {
    const response = await isUsernameAndPasswordMatched(username.value,
    password.value);
    if (!response.error) {
        handleSuccess(response);
    } else {
        handleError(response.error);
    }
}

async function handleSuccess(response) {
    const token = generateToken(response.data);
    await saveToken(token);
    localStorage.setItem("session", JSON.stringify(token));
    hideLogIn();
    if (response.data.isAdmin) window.location.href = './admin.html';
    window.location.href = './home.html';
}

function handleError(error) {
    warning(error, "log-in");
}