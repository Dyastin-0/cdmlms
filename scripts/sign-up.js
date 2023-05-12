import { isPasswordValid, isEmailValid, warning} from './validation.js';
import { signupUiInit } from './ui/index/sign-up-ui.js';
import { hideSignUp } from './ui/index/sign-up-ui.js';
import { createUser, logInFirebaseAuth } from './auth-api.js';
import { saveQuery } from './firestore-api.js';
import { toastMessage } from './toast-message.js';
import { displayConfirmDialog } from './confirm-dialog.js';

const modal = document.getElementById("sign-up-modal");
const submit = modal.querySelector("#sign-up-account-button");
const email = modal.querySelector("#email");
const password = modal.querySelector("#password");
const confirmPassword = modal.querySelector("#password-confirm");

signupUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click',() => signUp());
    email.addEventListener('keyup', () => isEmailValid(email.value));
    password.addEventListener('keyup', () => isPasswordValid(password.value));
}

async function areInputsValid() {
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
        const toastText = "Account created!";
        if (await createUser(email.value, password.value)) {
            await initialAccoutSetUp();
            toastMessage(toastText);
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
    displayConfirmDialog(redirect, "Redirect to setup page?", null);
}

function redirect() {
    window.location.href = './home.html';
}