import { isUsernameAndPasswordMatched, toSha256, warning } from './validation.js';

const overlay = document.getElementById("overlay");
const modal = document.getElementById("log-in-modal");
const open = document.getElementById("log-in-modal-button");
const close = modal.querySelector("#log-in-close-button");
const form = modal.querySelector("#log-in-form");
const username = form.querySelector("#log-in-username");
const password = form.querySelector("#log-in-password");
const submit = modal.querySelector("#log-in-account-button");

bindEvents(); 

function bindEvents() {
    open.addEventListener('click', () => show());
    overlay.addEventListener('click', () => hide());
    submit.addEventListener('click', async () => logIn());
    close.addEventListener('click', () => hide());
    username.addEventListener('keyup', () => warning("", "red", "log-in"));
    password.addEventListener('keyup', () => warning ("", "red", "log-in"));
}
function show() {
    overlay.classList.add("active");
    modal.classList.add("active");
}
function hide() {
    overlay.classList.remove("active");
    modal.classList.remove("active");
    form.reset();
    warning("", "red", "log-in");
}
async function logIn() {
    const response = await isUsernameAndPasswordMatched(username.value,
    password.value);
    if (!response.error) {
        localStorage.setItem(toSha256("data"), response.data.username);
        window.location.href = './home.html';
        hide();
    } else {
        warning(response.error, "red", "log-in");
    }
}