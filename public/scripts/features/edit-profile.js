import { auth } from "../firebase/firebase.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { updateQuery } from "../firebase/firestore-api.js";
import { onAuthStateChanged,
    reload
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { getQueryOneField } from '../firebase/firestore-api.js';
import { displayConfirmDialog } from '../utils/confirm-dialog.js';
import { toastMessage } from '../utils/toast-message.js';
import { displayProfile } from './user-profile.js';
import { displayProcessDialog } from "../utils/process-dialog.js";

const openEditProfile = document.querySelector("#edit-profile-button");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector("#edit-profile-form");

const closeEditProfile = editProfileModal.querySelector("#close-edit-profile");
const editedFirstName = editProfileModal.querySelector("#edit-first-name");
const editedLastName = editProfileModal.querySelector("#edit-last-name");
const editedMiddleName = editProfileModal.querySelector("#edit-middle-name");
const editedSex = editProfileModal.querySelector("#selected-sex");
const editedBirthDate = editProfileModal.querySelector("#edit-birth-date");
const editedDisplayName = editProfileModal.querySelector("#edit-display-name");

const editDoneButton = editProfileModal.querySelector("#done-edit");

const overlay = document.querySelector("#second-overlay");

bindEvents();

function bindEvents() {
    overlay.addEventListener('click', hideEditModal);

    openEditProfile.addEventListener('click', () => {
        displayEditModal();
        overlay.classList.add("active");
    });

    closeEditProfile.addEventListener('click', () => {
        const process = async () => {
            hideEditModal();
        };
        const confirmMessage = "The changes you made will be lost. Continue?";
        displayConfirmDialog(process, confirmMessage, null);
    });

    editDoneButton.addEventListener('click', async () => {
        if (!areInputsValid()) return;

        const changes = {
            firstName: editedFirstName.value,
            lastName: editedLastName.value,
            middleName: editedMiddleName.value,
            sex: editedSex.textContent.trim(),
            birthDate: editedBirthDate.value
        }

        const process = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    displayProcessDialog("Saving changes...");
                    await processChanges(user, changes);
                    hideEditModal();
                }
            });
        }
        const confirmMessage = "Save the changes you made?";
        const toastText = "Profile info updated!";
        displayConfirmDialog(process, confirmMessage, toastText);
    });
}

async function processChanges(user, changes) {
    const querySnapshot = await getQueryOneField('users', 'email', user.email);
    const userDataRef = querySnapshot.docs[0].ref;
    await saveChanges(user, userDataRef, changes, editedDisplayName.value)
    .then(async () => {
        await reload(user);
        const querySnapshot = await getQueryOneField('users', 'email', user.email);
        const userData = querySnapshot.docs[0].data();
        displayProfile(user, userData);
    })
    .catch((error) => {
        console.error(error);
    });
}

async function saveChanges(user, userDataRef, changes, editedDisplayName) {
    await updateQuery(userDataRef, changes)
    if (editedDisplayName !== user.displayName) await updateProfile(user, { displayName: editedDisplayName });
}

async function getInfo() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const querySnapshot = await getQueryOneField('users', 'email', user.email);
            const currentUserData = querySnapshot.docs[0].data();
            editedFirstName.value = currentUserData.firstName;
            editedLastName.value = currentUserData.lastName;
            editedMiddleName.value = currentUserData.middleName;
            editedSex.textContent = currentUserData.sex;
            editedBirthDate.value = currentUserData.birthDate;
            editedDisplayName.value = user.displayName;
        }
    });
}

function areInputsValid() {
    if (!areInputFieldsFilled()) return false;
    if (!areInputDataValid()) return false;

    return true;
}

function areInputFieldsFilled() {
    const inputs = [
    editedFirstName.value,
    editedLastName.value,
    editedMiddleName.value,
    editedSex.textContent.trim(),
    editedDisplayName.value,
    ];

    if (inputs.some(field => !field)) {
        warning("There is an empty field.", "edit");
        return false;
    }
    return true;
}

function areInputDataValid() {
    if (!editedBirthDate.value) {
        warning("Provide your birth date.", "edit");
        return false;
    }

    return true;
}

function displayEditModal() {
    getInfo();
    editProfileModal.classList.add("active");
}

function hideEditModal() {
    editProfileForm.reset();
    overlay.classList.remove("active");
    editProfileModal.classList.remove("active");
}