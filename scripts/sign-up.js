import { isPasswordValid, isEmailValid, warning} from './validation.js';
import { signupUiInit, hideSignUp } from './ui/index/sign-up-ui.js';
import { createUser, logInFirebaseAuth } from './auth-api.js';
import { saveQuery } from './firestore-api.js';

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
        if (await createUser(email.value, password.value)) {
            alert("Account created! You will receive an email verification shortly, and will be redirected to set-up page.");
            await logInFirebaseAuth(email.value, password.value);
            await saveQuery('users', crypto.randomUUID(), {email: email.value, newUser: true});
            auth.onAuthStateChanged(user => {
                user.sendEmailVerification()
                .catch(error => {
                    console.error(error);
                });
            });
            window.location.href = './home.html';
            hideSignUp();
        }     
    }
}