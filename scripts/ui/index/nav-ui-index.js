import { signOutFirebaseAuth } from "../../firebase/auth-api.js";

const indexNavbar = document.querySelector("#index-navbar")
const indexButton = indexNavbar.querySelector("#index-button");
const openLogIn = indexNavbar.querySelector("#log-in-modal-button");
const openSignUp = indexNavbar.querySelector("#sign-up-modal-button");
const homeButton = indexNavbar.querySelector("#home");
const logOutButton = indexNavbar.querySelector("#log-out-button");

const splashScreen = document.querySelector("#splash-screen");

auth.onAuthStateChanged(async (user) => {
    user ? showLoggedInButtons() : showLoggedOutButtons();
    splashScreen.remove();
});

navUiInit();

async function navUiInit() {
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
    logOutButton.style.display = "flex";
}

function showLoggedOutButtons() {
    openLogIn.style.display = "flex";
    openSignUp.style.display = "flex";
    homeButton.style.display = "none";
    logOutButton.style.display = "none";
}