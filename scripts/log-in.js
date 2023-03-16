import { isUsernameAndPasswordMatched, warning } from './validation.js';
import { generateToken, saveToken } from './authToken.js';
import { redirect } from './user.js';
import { showSignUp } from './sign-up.js';

const overlay = document.getElementById("overlay");
const modal = document.getElementById("log-in-modal");
const open = document.getElementById("log-in-modal-button");
const close = modal.querySelector("#log-in-close-button");
const form = modal.querySelector("#log-in-form");
const username = form.querySelector("#log-in-username");
const password = form.querySelector("#log-in-password");
const submit = modal.querySelector("#log-in-account-button");
const modalLabel = modal.querySelector("#dont-have-account");

bindEvents();

function bindEvents() {
    open.addEventListener('click', () => showLogIn());
    overlay.addEventListener('click', () => hideLogIn());
    submit.addEventListener('click', async () => logIn());
    close.addEventListener('click', () => hideLogIn());
    username.addEventListener('keyup', () => warning("", "log-in"));
    password.addEventListener('keyup', () => warning ("", "log-in"));
    modalLabel.addEventListener('click', () => {
        hideLogIn();
        showSignUp();
    });
}

export function showLogIn() {
    overlay.classList.add("active");
    modal.classList.add("active");
}

function hideLogIn() {
    overlay.classList.remove("active");
    modal.classList.remove("active");
    form.reset();
    warning("", "log-in");
}

async function logIn() {
    const response = await isUsernameAndPasswordMatched(username.value,
    password.value);
    if (!response.error) {
        const token = generateToken(response.data);
        await saveToken(token);
        localStorage.setItem("session", JSON.stringify(token));
        hideLogIn();
        if (response.data.isAdmin) window.location.href = './admin.html';
        window.location.href = './home.html';
    } else {
        warning(response.error, "log-in");
    }
}