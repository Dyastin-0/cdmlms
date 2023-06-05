import { auth } from "../../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { getQueryOneField } from '../../firebase/firestore-api.js';
import { bindAddBookEvents } from './add-book.js';
import { availabilityDropDownInit } from "../../ui/admin/availability-drop-down.js";
import { userDropDownInit  } from '../../ui/home/user-drop-down-ui.js'
import { adminNavUiInit } from '../../ui/admin/nav-ui.js';
import { displayProfile } from '../user-profile.js'; 
import { signOutFirebaseAuth } from '../../firebase/auth-api.js';
import { displayStatistics } from './statistics.js';
import { displayRequests, displayReturnRequests } from './requests.js';

const splashScreen = document.querySelector("#splash-screen");
const signOut = document.querySelector("#sign-out");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const querySnapshot = await getQueryOneField('users', 'email', user.email);
        const currentUser = querySnapshot.docs[0];
        const isAdmin = currentUser.data().isAdmin;
        if (isAdmin) {
            await bindEvents(user, currentUser.data());
            splashScreen.remove();
        } else {
            window.location.href = "./16.html";
        }
    } else {
        window.location.href = "./sign-in.html";
    }
});

async function bindEvents(user, currentUser) {
    displayProfile(user, currentUser)
    userDropDownInit();
    displayRequests();
    displayReturnRequests();
    availabilityDropDownInit();
    displayStatistics();
    bindAddBookEvents();
    adminNavUiInit();
    signOut.addEventListener('click', () => {
        signOutFirebaseAuth();
    });
}