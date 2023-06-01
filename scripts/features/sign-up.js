import { isPasswordValid, isEmailValid, warning } from '../utils/validation.js';
import { createUser } from '../firebase/auth-api.js';
import { signInWithGoogle } from '../firebase/auth-api.js';
import { initialAccoutSetUpAndEmailVerification } from './account-setup.js';
import { displayProcessDialog, hideProcessDialog } from '../utils/process-dialog.js';

const modal = document.querySelector("#sign-up-modal");
const signUpGoogle = document.querySelector("#sign-up-google");
const submit = modal.querySelector("#sign-up-account-button");
const email = modal.querySelector("#email");
const password = modal.querySelector("#password");
const confirmPassword = modal.querySelector("#password-confirm");

let signingUp = false;

auth.onAuthStateChanged((user) => {
    if (user && !signingUp) {
        console.log(signingUp);
    }
});

bindEvents();

function bindEvents() {
    submit.addEventListener('click',(e) => {
        e.preventDefault();
        signUp();
    });
    signUpGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        signingUp = true;
        signInWithGoogle();
    });
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
            const processMessage = "Creating your account...";
            displayProcessDialog(processMessage);
            signingUp = true;
            await initialAccoutSetUpAndEmailVerification(email.value, password.value);
            hideProcessDialog();
            window.location.href = './home.html';
        }
    }
}