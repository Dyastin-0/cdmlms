import { signInUiInit, hideSignIn } from '../ui/index/sign-in-ui.js';
import { signInFirebaseAuth } from '../firebase/auth-api.js';
import { toastMessage } from '../utils/toast-message.js';
import { getQueryOneField, saveQuery } from '../firebase/firestore-api.js';

const modal = document.querySelector("#sign-in-modal");
const username = modal.querySelector("#sign-in-email");
const password = modal.querySelector("#sign-in-password");
const submit = modal.querySelector("#sign-in-account-button");

const signInGoogle = modal.querySelector("#sign-in-google");

observerScroll();
signInUiInit();
bindEvents();

function bindEvents() {
    submit.addEventListener('click', (e) => {
        e.preventDefault();
        signIn();
    });
    username.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    password.addEventListener('keyup', (e) => {
        e.key === "Enter" ? signIn() : null;
    });
    signInGoogle.addEventListener('click', () => {
        signInWithGoogle();
    });
}

async function signIn() {
    const isSigninSuccess = await signInFirebaseAuth(username.value, password.value);
    if (isSigninSuccess) {

        // window.location.href = './home.html';
    }
}

export async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    auth.signInWithPopup(provider)
    .then(async (result) => {
        const querySnapshot = await getQueryOneField('users', 'email', result.user.email);
        let isSetUpDone;
        querySnapshot.docs[0] ? isSetUpDone = true : isSetUpDone = false;
        if (!isSetUpDone) {
            await initialGoogleAuthSetUp(result.user.email);
        }
        window.location.href = './home.html';
    })
    .catch((error) => {
        console.error(error)
        toastMessage("Something when wrong, try again.");
    });
    hideSignIn();
}

async function initialGoogleAuthSetUp(email) {
    await saveQuery('users', crypto.randomUUID(), {email: email, newUser: true});
}