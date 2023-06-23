import { auth } from "../firebase/firebase.js";
import { updateQuery, getQueryOneField } from "../firebase/firestore-api.js";
import { onAuthStateChanged,
    updateProfile,
    reload,
    sendEmailVerification,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { isIdValid, warning } from "../utils/validation.js";
import { isIdAvailable } from "../utils/data-availability.js";
import { userInit } from "./user.js";
import { displayConfirmDialog } from "../utils/confirm-dialog.js";
import { setupSexDropDownInit } from "../ui/home/setup-sex-drop-down.js";
import { displayProcessDialog, hideProcessDialog } from "../utils/process-dialog.js";
import { toastMessage } from "../utils/toast-message.js";

const profileTitle = document.querySelector("#profile-modal-header");
const displayedName = document.querySelector("#display-name");

const splashScreen = document.querySelector("#splash-screen");
const oneTimeSetupModal = document.querySelector("#one-time-setup-modal");
const adminButton = document.querySelector("#admin-button");

const resendVerification = oneTimeSetupModal.querySelector("#resend-email-verification");

const firstName = oneTimeSetupModal.querySelector("#first-name");
const lastName = oneTimeSetupModal.querySelector("#last-name");
const middleName = oneTimeSetupModal.querySelector("#middle-name");
const sex = oneTimeSetupModal.querySelector("#setup-selected-sex");
const birthDate = oneTimeSetupModal.querySelector("#birth-date");
const id = oneTimeSetupModal.querySelector("#id");
const displayName = oneTimeSetupModal.querySelector("#display-name-setup");

const cancelSetupButton = document.querySelector("#cancel-setup");
const doneSetupButton = document.querySelector("#done-setup");

checkIfFirstLogin();

async function checkIfFirstLogin() {
    try {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const querySnapshot = await getQueryOneField('users', 'email', user.email);
                const currentUser = querySnapshot.docs[0];
                const isNewUser = currentUser.data().isNewUser;
                const isAdmin = currentUser.data().isAdmin;
                if (isAdmin) adminButton.style.display = "flex";
                if (isNewUser) {
                    bindEvents();
                    oneTimeSetupModal.classList.add("active");
                } else {
                    userInit(user, currentUser.data());
                    splashScreen.remove();
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

function bindEvents() {
    setupSexDropDownInit();
    resendVerification.addEventListener('click', () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await reload(user);
                if (user.emailVerified) {
                    toastMessage("Your email is already verified.");
                    return;
                }
                sendEmailVerification(user)
                .then(() => {
                    toastMessage("Email verification sent.");
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        });
    });

    doneSetupButton.addEventListener('click', async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) await verifyEmailAndInputs(user);
        });
    });

    cancelSetupButton.addEventListener('click', async () => signOut(auth));
}

async function verifyEmailAndInputs(user) {
    const querySnapshot = await getQueryOneField("users", "email", user.email);
    const currentUserRef = querySnapshot.docs[0].ref;

    let isVerified = await isEmailVerified(user);
    if (!isVerified) {
        warning("Please check your mail for the verification link.", 'setup');
        return;
    }

    if (await areInputsValid()) {
        const process = async () => { 
            const processMessage = "Setting up your account...";
            displayProcessDialog(processMessage);
            await finalAccountSetup(currentUserRef, user);
        };
        const confirmMessage = "Make sure that all the information you have put in belongs to you. Continue?";
        const toastMessage = "Account set up done!";
        await displayConfirmDialog(process, confirmMessage, toastMessage);
    }
}

async function finalAccountSetup(currentUserRef, user) {
    await setupInformation(currentUserRef, user);
    const querySnapshot = await getQueryOneField('users', 'email', user.email);
    const currentUser = querySnapshot.docs[0];
    oneTimeSetupModal.classList.remove("active");
    userInit(user, currentUser.data());
    profileTitle.textContent = displayName.value.trim();
    displayedName.textContent = displayName.value.trim();
    splashScreen.remove();
}

async function setupInformation(userRef, user) {
    const updatedDoc = {
        isNewUser: false,
        firstName: firstName.value.trim(),
        middleName: middleName.value.trim(),
        lastName: lastName.value.trim(),
        sex: sex.textContent.trim(),
        birthDate: birthDate.value.trim(),
        isAdmin: false,
        id: id.value.trim(),
        penaltyCount: 0
    }
    await updateQuery(userRef, updatedDoc);
    const querySnapshot = await getQueryOneField('enrolledStudents', 'id', id.value);
    const studentRef = querySnapshot.docs[0].ref;
    await updateQuery(studentRef, {isAvailable: false});
    updateProfile(user, {
        displayName: displayName.value
    });
}

async function isEmailVerified(user) {
    let isVerified = null;
    await reload(user)
    .then(() => {
        isVerified = user.emailVerified;
    });
    return isVerified;
}

//input checks
async function areInputsValid() {
    if (!areInputFieldsFilled()) {
        hideProcessDialog();
        return false;
    }
    if (!areInputDataValid()) {
        hideProcessDialog();
         return false;
    }
    displayProcessDialog("Checking info...");
    const areInputAvailable = await areInputsAvailable();
    if (!areInputAvailable) {
        hideProcessDialog();
        return false;
    }
    hideProcessDialog();
    return true;
}

function areInputFieldsFilled() {
    const inputs = [
    firstName.value,
    lastName.value,
    middleName.value,
    sex.textContent.trim(),
    id.value,
    displayName.value,
    ];

    if (inputs.some(field => !field)) {
        warning("There is an empty field.", "setup");
        return false;
    }
    return true;
}

function areInputDataValid() {
    const dateRegex = /^(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-9]|3[01])$/;
    if (!dateRegex.test(birthDate.value.trim())) {
        warning("Invalid birth date format.", "setup");
        return false;
    }

    if (!isIdValid(id.value)) return false;

    return true;
}

async function areInputsAvailable() {
    // const idRes = await isIdAvailable(id.value);
    // if (!idRes.result) {
    //     warning(idRes.error, "setup");
    //     return false;
    // }

    return true;
}