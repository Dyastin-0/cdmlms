import { signOutFirebaseAuth } from "../../firebase/auth-api.js";
import { userDropDownInit } from "../home/user-drop-down-ui.js";
import { userProfileInit } from "../../features/user-profile.js";
import { displayProfile } from "../../features/user-profile.js";
import { getQueryOneField } from "../../firebase/firestore-api.js";

const indexNavbar = document.querySelector("#index-navbar")
const indexButton = indexNavbar.querySelector("#index-button");
const openLogIn = indexNavbar.querySelector("#log-in-modal-button");
const openSignUp = indexNavbar.querySelector("#sign-up-modal-button");
const homeButton = indexNavbar.querySelector("#home");
const logOutButton = indexNavbar.querySelector("#log-out");

const userDropDown = document.querySelector("#user-drop-down");
const userDropDownButton = document.querySelector("#user-drop-down-button");

const splashScreen = document.querySelector("#splash-screen");

auth.onAuthStateChanged(async (user) => {
    if (user) {
        showLoggedInButtons();
        userProfileInit();
        let currentUserData;
        if (user.emailVerified) {
            const querySnapshot = await getQueryOneField('users', 'email', user.email);
            currentUserData = querySnapshot.docs[0].data();
        }
        displayProfile(user, currentUserData);
    } else {
        showLoggedOutButtons();
    }
    splashScreen.remove();
});

navUiInit();

async function navUiInit() {
    userDropDownInit();
    bindEvents();
}

function bindEvents() {
    indexButton.addEventListener('click', () => {
        window.location.href = './';
    });

    homeButton.addEventListener('click', () => window.location.href = "./home.html");

    logOutButton.addEventListener('click', async () => {
        await signOutFirebaseAuth();
        window.location.href = './';
    });
}

function showLoggedInButtons() {
    openLogIn.style.display = "none";
    openSignUp.style.display = "none";
    homeButton.style.display = "flex";
    userDropDown.style.display = "flex";
    userDropDownButton.style.display = "flex";
}

function showLoggedOutButtons() {
    openLogIn.style.display = "flex";
    openSignUp.style.display = "flex";
    homeButton.style.display = "none";
    userDropDown.style.display = "none";
    userDropDownButton.style.display = "none";
}