import { isUsernameAvailable, isPasswordValid, isEmailValid, warning, toSha256 } from './validation.js';
import { showLogIn } from './log-in.js';

const open = document.getElementById("sign-up-modal-button");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("sign-up-modal");
const modalLabel = modal.querySelector("#have-account");
const close = modal.querySelector("#sign-up-close-button");
const form = modal.querySelector("#sign-up-form");
const submit = modal.querySelector("#sign-up-account-button");
const firstName = modal.querySelector("#first-name");
const lastName = modal.querySelector("#last-name");
const middleName = modal.querySelector("#middle-name");
const sex = modal.querySelector("#sex");
const birthDate = modal.querySelector("#birth-date");
const email = modal.querySelector("#email");
const username = modal.querySelector("#user-name");
const password = modal.querySelector("#password");

bindEvents();

let userInfo = {};

function bindEvents() {
    submit.addEventListener('click',() => signUp());
    email.addEventListener('keyup', () => isEmailValid(email.value));
    password.addEventListener('keyup', () => isPasswordValid(password.value));
    username.addEventListener('keyup', () => warning("", "red", "sign-up"));
    firstName.addEventListener('keyup', () => warning("", "red", "sign-up"));
    lastName.addEventListener('keyup', () => warning("", "red", "sign-up"));
    middleName.addEventListener('keyup', () => warning("", "red", "sign-up"));
    birthDate.addEventListener('change', () => warning("", "red", "sign-up"));
    overlay.addEventListener('click', () => hideSignUp());
    close.addEventListener('click', () => hideSignUp());
    open.addEventListener('click', () => showSignUp());
    modalLabel.addEventListener('click', () => {
        hideSignUp();
        showLogIn();
    });
}

export function showSignUp() {
    modal.classList.add("active");
    overlay.classList.add("active");
}

function hideSignUp() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
    form.reset();
    warning("", "red", "sign-up");
}

async function isInputValid() {
    if(!firstName.value || !lastName.value 
        || !middleName.value || !birthDate.value) {
        warning("There is an empty field.", "red", "sign-up");
        return false;
    }
    if (!isEmailValid(email.value)) return false;
    if (!isPasswordValid(password.value)) return false;
    const res = await isUsernameAvailable(username.value);
    if (!res.result) {
        warning(res.username + " is already used.", "red", "sign-up");
        return false;
    }
    return true;
}

async function setUserInfo() {
    userInfo = {
        firstName: firstName.value,
        lastName: lastName.value,
        middleName: middleName.value,
        sex: sex.value,
        birthDate: birthDate.value,
        email: email.value,
        id: await toSha256(username.value),
        isAdmin: false,
        username: username.value,
        password: await toSha256(password.value)
    };
}

async function create() {
    db.collection('users')
    .doc(crypto.randomUUID())
    .set(userInfo)
    .catch((error) => {
        alert(error)
    });
}

async function signUp(userInfo) {
    if (await isInputValid()) {
        await setUserInfo();              
        await create(userInfo);
        userInfo = {};
        alert("Created! Try and log in.");
        hide();
    }
}