import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { changePassword, deleteUserAccount } from "../firebase/auth-api.js";
import { displayConfirmDialog } from "../utils/confirm-dialog.js";
import { getQueryOneField, deleteQueryFromRef, updateQuery } from "../firebase/firestore-api.js";
import { displayProcessDialog } from "../utils/process-dialog.js";

const settingsButton = document.querySelector("#settings");
const settingsModal = document.querySelector("#account-settings-modal");
const closeSettingsButton = document.querySelector("#close-settings");

const changePasswordButton = settingsModal.querySelector("#change-password-button");
const deleteAccountButton = settingsModal.querySelector("#delete-user-account-button");

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

    deleteAccountButton.addEventListener('click', () => {
        onAuthStateChanged(auth, (user) => {
            const process = async () => {
                displayProcessDialog("Deleting your account...");
                const email = user.email;
                await deleteUserAccount(user);
                
                const querySnapshot = await getQueryOneField('users', 'email', email);
                const userData = querySnapshot.docs[0].data();
                await deleteQueryFromRef(querySnapshot.docs[0].ref);
               
                const idSnapshot = await getQueryOneField('enrolledStudents', 'id', userData.id);
                await updateQuery(idSnapshot.docs[0].ref, {isAvailable: true});
            }
            const confirmMessage = "You are about to delete your account permanently, including all the data associated with it. Continue?";
            displayConfirmDialog(process, confirmMessage, null);
        });
    });
}