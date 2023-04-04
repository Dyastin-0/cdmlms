import { isPasswordValid, isEmailValid, warning, toSha256, isIdValid } from './validation.js';
import { isUsernameAvailable, isIdAvailable, isEmailAvailable } from './authentication.js';
import { signupUiInit, hideSignUp } from './ui/index/sign-up-ui.js';
import { saveQuery } from './firestore-api.js';
import { createUser } from './auth-api.js';

const modal = document.getElementById("sign-up-modal");
const submit = modal.querySelector("#sign-up-account-button");
const firstName = modal.querySelector("#first-name");
const lastName = modal.querySelector("#last-name");
const middleName = modal.querySelector("#middle-name");
const sex = modal.querySelector("#sex");
const birthDate = modal.querySelector("#birth-date");
const id = modal.querySelector("#id");
const email = modal.querySelector("#email");
const username = modal.querySelector("#user-name");
const password = modal.querySelector("#password");
const confirmPassword = modal.querySelector("#password-confirm");

signupUiInit();
bindEvents();

let userInfo = {};

function bindEvents() {
    submit.addEventListener('click',() => signUp());
    email.addEventListener('keyup', () => isEmailValid(email.value));
    password.addEventListener('keyup', () => isPasswordValid(password.value));
    username.addEventListener('keyup', () => warning("", "sign-up"));
    firstName.addEventListener('keyup', () => warning("", "sign-up"));
    lastName.addEventListener('keyup', () => warning("", "sign-up"));
    id.addEventListener('keyup', () => isIdValid(id.value));
    middleName.addEventListener('keyup', () => warning("", "sign-up"));
    birthDate.addEventListener('change', () => warning("", "sign-up"));
}

async function areInputsValid() {
    if (!firstName.value || !lastName.value 
        || !middleName.value || !birthDate.value
        || !id.value) {
        warning("There is an empty field.", "sign-up");
        return false;
    }
    if (!isEmailValid(email.value)) return false;
    
    const emailRes = await isEmailAvailable(email.value);
    if (!emailRes.result) {
        warning(emailRes.email + " is already used.", "sign-up");
        return false;
    }

    const idRes = await isIdAvailable(id.value);
    if (!idRes.result) {
        warning(idRes.id + " is already used, contact the MIS if there is any problem.", "sign-up");
        return false;
    }
    if (!isIdValid(id.value)) return false;
    if (password.value !== confirmPassword.value) {
        warning("Password does not match.", "sign-up");
        return false;
    }
    if (!isPasswordValid(password.value)) return false;
    const res = await isUsernameAvailable(username.value);
    if (!res.result) {
        warning(res.username + " is already used.", "sign-up");
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
        id: await toSha256(id.value),
        isAdmin: false,
        username: username.value,
        password: await toSha256(password.value)
    };
}

async function create() {
    await saveQuery('users', crypto.randomUUID(), userInfo);
    await createUser(userInfo.email, userInfo.password);
}

async function signUp() {
    if (await areInputsValid()) {
        await setUserInfo();              
        await create();
        userInfo = {};
        alert("Created! Try and log in.");
        hideSignUp();
    }
}