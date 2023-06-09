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
import { adminFilterInit } from '../../ui/admin/search-filter-admin.js';
import { bindAdminSearchEvents } from './search-admin.js';
import { sexDropDownInit } from "../../ui/home/sex-drop-down.js";
import { editAvailabilityDropDownInit } from "../../ui/admin/edit-availability-drop-down.js";
import { filterSearchInit } from '../../ui/home/search-filter-drop-down.js';
import { editBookInit } from "./edit-book.js";
import { deleteFilterSearchInit } from "../../ui/admin/search-filter-delete-drop-down.js";
import { delebookInit } from "./delete-book.js";
import { displayMostRecentTransactions } from '../admin/records.js';
import { editRoleDropDownInit } from "../../ui/admin/edit-role-drop-down.js";
import { displayRecentUsers } from "./users.js";

const splashScreen = document.querySelector("#splash-screen");
const signOut = document.querySelector("#sign-out");

userDropDownInit();
adminFilterInit();
sexDropDownInit();
deleteFilterSearchInit();
editRoleDropDownInit();
filterSearchInit();
editAvailabilityDropDownInit();
adminNavUiInit();
availabilityDropDownInit();

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
    displayProfile(user, currentUser);
    bindAdminSearchEvents();
    editBookInit();
    displayRequests();
    delebookInit();
    displayRecentUsers();
    displayMostRecentTransactions();
    displayReturnRequests();
    displayStatistics();
    bindAddBookEvents();
    signOut.addEventListener('click', () => {
        signOutFirebaseAuth();
    });
}