import { getQueryOneField } from '../firebase/firestore-api.js';
import { displayConfirmDialog } from '../utils/confirm-dialog.js';
import { toastMessage } from '../utils/toast-message.js';
import { displayProfile } from './user-profile.js';

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
        hideEditModal();
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
            await auth.onAuthStateChanged(async (user) => {
                if (user) {
                    await processChanges(user, changes);
                }
            });
        }
        const confirmMessage = "Save the changes you made?";
        const toastText = "Profile info updated!";
        displayConfirmDialog(process, confirmMessage, toastText);
    });
}

async function processChanges(user, changes) {
    toastMessage("Updating your profile info...");
    const querySnapshot = await getQueryOneField('users', 'email', user.email);
    const userDataRef = querySnapshot.docs[0].ref;
    await saveChanges(user, userDataRef, changes, editedDisplayName.value)
    .then(async () => {
        await user.reload();
        const querySnapshot = await getQueryOneField('users', 'email', user.email);
        const userData = querySnapshot.docs[0].data();
        await displayProfile(user, userData);
    })
    .finally(() => {
        hideEditModal();
    });
}

async function saveChanges(user, userDataRef, changes, editedDisplayName) {
    await userDataRef.update(changes);
    if (editedDisplayName !== user.displayName) await user.updateProfile({ displayName: editedDisplayName });
}

async function getInfo() {
    auth.onAuthStateChanged(async (user) => {
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
    editProfileModal.classList.remove("active");
}