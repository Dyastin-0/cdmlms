import { isEmailValidSignIn, warning } from "../utils/validation.js";
import { toastMessage } from '../utils/toast-message.js';
import { getQueryOneField } from '../firebase/firestore-api.js';
import { initialAccountSetUp } from "../features/account-setup.js";
import { displayProcessDialog, hideProcessDialog } from "../utils/process-dialog.js";

export async function createUser(email, password) {
    let isSuccess = false;
    await auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
        isSuccess = true;
    })
    .catch(() => {
        warning('Email is already used.', 'sign-up');
    });
    return isSuccess;
}

export async function signInFirebaseAuth(email, password) {
    let isSuccess = false;
    await auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        isSuccess = true;
    })
    .catch(() => {
        warning('Invalid credentials.', 'sign-in');
    });
    return isSuccess;
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
            displayProcessDialog("Setting up your account...");
            await initialAccountSetUp(result.user.email);
            hideProcessDialog();
        }
        displayProcessDialog("Signing in...");
        window.location.href = './home.html';
    })
    .catch((error) => {
        console.error(error);
        toastMessage("Something went wrong, try again.");
    });
}

export function signOutFirebaseAuth() {
    auth.signOut();
}

export function recoverAccount(email) {
    const isValid = isEmailValidSignIn(email);
    if (!isValid) {
        warning('Enter your valid email.', 'sign-in');
        return;
    }
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      toastMessage("Password reset link sent.");
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
    });
}