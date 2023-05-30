import { getQueryOneField } from "../firebase/firestore-api.js";
import { isIdValid, warning } from "../utils/validation.js";
import { isDisplayNameAvailable, isIdAvailable } from "../utils/data-availability.js";
import { userInit } from "./user.js";
import { signOutFirebaseAuth } from "../firebase/auth-api.js";
import { displayConfirmDialog } from "../utils/confirm-dialog.js";
import { setupSexDropDownInit } from "../ui/home/setup-sex-drop-down.js";
import { displayProcessDialog, hideProcessDialog } from "../utils/process-dialog.js";
import { yearDropDownInit } from "../ui/home/year-drop-down.js";
import { courseDropDownInit } from "../ui/home/course-drop-down.js";
import { toastMessage } from "../utils/toast-message.js";

const main = document.querySelector("#main");

const splashScreen = document.querySelector("#splash-screen");
const oneTimeSetupModal = document.querySelector("#one-time-setup-modal");
const adminButton = document.querySelector("#admin-button");

const resendVerification = oneTimeSetupModal.querySelector("#resend-email-verification");

const firstName = oneTimeSetupModal.querySelector("#first-name");
const lastName = oneTimeSetupModal.querySelector("#last-name");
const middleName = oneTimeSetupModal.querySelector("#middle-name");
const sex = oneTimeSetupModal.querySelector("#setup-selected-sex");
const birthDate = oneTimeSetupModal.querySelector("#birth-date");
const course = oneTimeSetupModal.querySelector("#setup-selected-course");
const year = oneTimeSetupModal.querySelector("#setup-selected-year");
const id = oneTimeSetupModal.querySelector("#id");
const displayName = oneTimeSetupModal.querySelector("#display-name");

const cancelSetupButton = document.querySelector("#cancel-setup");
const doneSetupButton = document.querySelector("#done-setup");

checkIfFirstLogin();

async function checkIfFirstLogin() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const querySnapshot = await getQueryOneField('users', 'email', user.email);
            const currentUser = querySnapshot.docs[0];
            const isNewUser = currentUser.data().newUser;
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
}

function bindEvents() {
    setupSexDropDownInit();
    yearDropDownInit();
    courseDropDownInit();

    resendVerification.addEventListener('click', () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                if (user.emailVerified) {
                    toastMessage("Your email is already verified.");
                    return;
                }
                user.sendEmailVerification()
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
        auth.onAuthStateChanged(async (user) => {
            if (user) await verifyEmailAndInputs(user);
        });
    });

    cancelSetupButton.addEventListener('click', async () => signOutFirebaseAuth());
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
            hideProcessDialog();
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
        course: course.textContent.trim(),
        year: year.textContent.trim(),
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
    if (!birthDate.value) {
        warning("Provide your birth date.", "setup");
        return false;
    }

    if (!isIdValid(id.value)) return false;

    if (year.textContent === "Year") {
        warning("Select your year.", "setup");
        return false;
    }

    if (course.textContent === "Course") {
        warning("Select your course.", "setup");
        return false;
    }

    return true;
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