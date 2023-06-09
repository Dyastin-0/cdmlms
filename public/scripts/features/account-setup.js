import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { signInFirebaseAuth } from "../firebase/auth-api.js";
import { saveQuery } from "../firebase/firestore-api.js";
import { currentDateTime } from "../utils/date.js";

export async function initialAccoutSetUpAndEmailVerification(email, password) {
    await signInFirebaseAuth(email, password);
    await initialAccountSetUp(email);
    onAuthStateChanged(auth, (user) => {
        sendEmailVerification(user)
        .catch(error => {
            console.error(error);
        });
    });
}

export async function initialAccountSetUp(email) {
    await saveQuery('users', crypto.randomUUID(), {
        email: email,
        isNewUser: true,
        timeCreated: currentDateTime()
    });
}