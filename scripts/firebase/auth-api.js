import { warning } from "../utils/validation.js";

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

export async function logInFirebaseAuth(email, password) {
    let isSuccess = false;
    await auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        isSuccess = true;
    })
    .catch(() => {
        warning('Invalid credentials.', 'log-in');
    });
    return isSuccess;
}

export async function signOutFirebaseAuth() {
    await auth.signOut();
}