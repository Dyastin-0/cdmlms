import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { changePassword } from "../firebase/auth-api.js";
import { displayConfirmDialog } from "../utils/confirm-dialog.js";

const settingsButton = document.querySelector("#settings");
const settingsModal = document.querySelector("#account-settings-modal");
const closeSettingsButton = document.querySelector("#close-settings");

const changePasswordButton = settingsModal.querySelector("#change-password-button");

const overlay = document.querySelector("#overlay");

export function settingsInit() {
    bindEvents();
}

function bindEvents() {
    settingsButton.addEventListener('click', () => {
        settingsModal.classList.add("active");
        overlay.classList.add("active");
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsModal.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay.addEventListener('click', () => {
        settingsModal.classList.remove("active");
        overlay.classList.remove("active");
    });

    changePasswordButton.addEventListener('click', () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const process = async () => {
                    changePassword(user.email);
                };
                const confirmMessage = "Send a password reset link?";
                displayConfirmDialog(process, confirmMessage, null);
            }
        });
    });
}