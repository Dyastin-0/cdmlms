import { getQueryOneField } from "../firebase/firestore-api.js";
import { isIdValid, warning } from "../utils/validation.js";
import { isDisplayNameAvailable, isIdAvailable } from "../utils/data-availability.js";
import { userInit } from "./user.js";
import { logOut } from "./user.js";
import { displayConfirmDialog } from "../utils/confirm-dialog.js";
import { setupSexDropDownInit } from "../ui/home/setup-sex-drop-down.js";

const splashScreen = document.querySelector("#splash-screen");
const oneTimeSetupModal = document.querySelector("#one-time-setup-modal");

const firstName = oneTimeSetupModal.querySelector("#first-name");
const lastName = oneTimeSetupModal.querySelector("#last-name");
const middleName = oneTimeSetupModal.querySelector("#middle-name");
const sex = oneTimeSetupModal.querySelector("#setup-selected-sex");
const birthDate = oneTimeSetupModal.querySelector("#birth-date");
const id = oneTimeSetupModal.querySelector("#id");
const displayName = oneTimeSetupModal.querySelector("#display-name");

const cancelSetupButton = document.querySelector("#cancel-setup");
const doneSetupButton = document.querySelector("#done-setup");

bindEvents();
setupSexDropDownInit();
checkIfFirstLogin();

async function checkIfFirstLogin() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const querySnapshot = await getQueryOneField('users', 'email', user.email);
            const currentUser = querySnapshot.docs[0];
            const isNewUser = currentUser.data().newUser;
            if (isNewUser) {
                oneTimeSetupModal.classList.add("active");
            } else {
                await userInit(user, currentUser.data());
                splashScreen.remove();
            }
        }
    });
}

function bindEvents() {
    doneSetupButton.addEventListener('click', async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) await verifyEmailAndInputs(user);
        });
    });

    cancelSetupButton.addEventListener('click', async () => await logOut());
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
        const process = async () => { finalAccountSetup(currentUserRef, user) };
        const confirmMessage = "Make sure that all the information you have put in belongs to you. Continue?";
        const toastMessage = "Account setup done! Browse the library mah g.";
        await displayConfirmDialog(process, confirmMessage, toastMessage);
    }
}

async function finalAccountSetup(currentUserRef, user) {
    await setupInformation(currentUserRef, user);
    const querySnapshot = await getQueryOneField('users', 'email', user.email);
    const currentUser = querySnapshot.docs[0];
    oneTimeSetupModal.classList.remove("active");
    await userInit(user, currentUser.data());
    splashScreen.remove();
}

async function setupInformation(userRef, user) {
    await userRef.update({
        newUser: false,
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        sex: sex.textContent.trim(),
        birthDate: birthDate.value,
        id: id.value
    });

    await user.updateProfile({
        displayName: displayName.value
    });
}

async function isEmailVerified(user) {
    let isVerified = null;
    await user.reload()
    .then(async () => {
        isVerified = user.emailVerified;
    });
    return isVerified;
}

//input checks
async function areInputsValid() {
    if (!areInputFieldsFilled()) return false;
    if (!areInputDataValid()) return false;

    const areInputAvailable = await areInputsAvailable();
    if (!areInputAvailable) return false;
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
    if (!birthDate.value) {
        warning("Provide your birth date.", "setup");
        return false;
    }

    return isIdValid(id.value);
}

async function areInputsAvailable() {
    const idRes = await isIdAvailable(id.value);
    if (!idRes.result) {
        warning(idRes.id + " is already used, contact the MIS if there is any problem.", "setup");
        return false;
    }

    const res = await isDisplayNameAvailable(displayName.value);
    if (!res.result) {
        warning(res.displayName + " is already used.", "setup");
        return false;
    }

    return true;
}