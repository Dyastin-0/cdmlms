import { auth } from './firebase.js';
import { signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider,
    updateEmail,
    deleteUser
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { isEmailValidSignIn, warning } from "../utils/validation.js";
import { toastMessage } from '../utils/toast-message.js';
import { getQueryOneField } from '../firebase/firestore-api.js';
import { initialAccountSetUp } from "../features/account-setup.js";
import { displayProcessDialog, hideProcessDialog } from "../utils/process-dialog.js";

export async function createUser(email, password) {
    let isSuccess = false;
    await createUserWithEmailAndPassword(auth, email, password)
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
    await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        isSuccess = true;
    })
    .catch(() => {
        warning('Invalid credentials.', 'sign-in');
    });
    return isSuccess;
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    signInWithPopup(auth, provider)
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

export function recoverAccount(email) {
    const isValid = isEmailValidSignIn(email);
    if (!isValid) {
        warning('Enter your valid email.', 'sign-in');
        return;
    }
    sendPasswordResetEmail(auth, email)
    .then(() => {
      toastMessage("Password reset link sent.");
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
    });
}

export function changePassword(email) {    
    sendPasswordResetEmail(auth, email)
    .then(() => {
      toastMessage("Password reset link sent.");
    })
    .catch((error) => {
      console.error('Error sending password reset email:', error);
    });
}

export async function updateUserEmail(user, email) {
    await updateEmail(user, email)
    .then(() => {
        toastMessage("Email updated!")
    })
    .catch((error) => {
        console.error(error);
    });
}

export async function deleteUserAccount(user, process) {
    await deleteUser(user)
    .then(() => {
        process();
    })
    .catch((error) => {
        isResolved = false;
        console.error(error);
    });
}