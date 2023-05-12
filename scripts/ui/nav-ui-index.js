import { signOutFirebaseAuth } from "../auth-api.js";
import { userDropDownInit } from "./home/user-drop-down-ui.js";
import { userProfileInit } from "../user-profile.js";
import { displayProfile } from "../user-profile.js";
import { getQueryOneField } from "../firestore-api.js";

const indexButton = document.getElementById("index-button");

const openLogIn = document.getElementById("log-in-modal-button");
const openSignUp = document.getElementById("sign-up-modal-button");
const homeButton = document.getElementById("home");
const logOutButton = document.querySelector("#log-out");

const userDropDown = document.querySelector("#user-drop-down");
const userDropDownButton = document.querySelector("#user-drop-down-button");

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