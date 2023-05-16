import { signInFirebaseAuth } from "../firebase/auth-api.js";
import { saveQuery } from "../firebase/firestore-api.js";

export async function initialAccoutSetUpAndEmailVerification(email, password) {
    await signInFirebaseAuth(email, password);
    await initialAccountSetUp(email);
    auth.onAuthStateChanged(user => {
        user.sendEmailVerification()
        .catch(error => {
            console.error(error);
        });
        window.location.href = './home.html';
    });
}

export async function initialAccountSetUp(email) {
    await saveQuery('users', crypto.randomUUID(), {email: email, newUser: true});
}