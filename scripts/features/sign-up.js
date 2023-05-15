import { isPasswordValid, isEmailValid, warning } from '../utils/validation.js';
import { signupUiInit } from '../ui/index/sign-up-ui.js';
import { hideSignUp } from '../ui/index/sign-up-ui.js';
import { createUser, logInFirebaseAuth } from '../firebase/auth-api.js';
import { saveQuery } from '../firebase/firestore-api.js';
import { toastMessage } from '../utils/toast-message.js';
import { displayConfirmDialog } from '../utils/confirm-dialog.js';

const modal = document.querySelector("#sign-up-modal");
const submit = modal.querySelector("#sign-up-account-button");
const email = modal.querySelector("#email");
const password = modal.querySelector("#password");
const confirmPassword = modal.querySelector("#password-confirm");

signupUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click',() => signUp());
    email.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signUp() : null;
    });
    password.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signUp() : null;
    });
    confirmPassword.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signUp() : null; 
    });
}

async function areInputsValid() {
    if (!email.value || !password.value || !confirmPassword.value) {
        warning("There is an empty field.", "sign-up");
        return false;
    }
    if (!isEmailValid(email.value)) return false;
    if (password.value !== confirmPassword.value) {
        warning("Password does not match.", "sign-up");
        return false;
    }
    if (!isPasswordValid(password.value)) return false;
    return true;
}

async function signUp() {
    if (await areInputsValid()) {      
        if (await createUser(email.value, password.value)) {
            await initialAccoutSetUp();
        }
    }
}

async function initialAccoutSetUp() {
    await logInFirebaseAuth(email.value, password.value);
    await saveQuery('users', crypto.randomUUID(), {email: email.value, newUser: true});
    auth.onAuthStateChanged(user => {
        user.sendEmailVerification()
        .catch(error => {
            console.error(error);
        });
    });
    hideSignUp();
    displayConfirmDialog(redirect, "Account created! Redirect to setup page?", null, null);
}

async function redirect() {
    window.location.href = './home.html';
}