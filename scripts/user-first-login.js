import { getQueryOneField } from "./firestore-api.js";
import { isIdValid, warning } from "./validation.js";
import { isDisplayNameAvailable, isIdAvailable } from "./dataAvailabilityCheck.js";
import { init } from "./user.js";
import { logOut } from "./user.js";

const splashScreen = document.querySelector("#splash-screen");
const oneTimeSetupModal = document.querySelector("#one-time-setup-modal");

const firstName = oneTimeSetupModal.querySelector("#first-name");
const lastName = oneTimeSetupModal.querySelector("#last-name");
const middleName = oneTimeSetupModal.querySelector("#middle-name");
const sex = oneTimeSetupModal.querySelector("#sex");
const birthDate = oneTimeSetupModal.querySelector("#birth-date");
const id = oneTimeSetupModal.querySelector("#id");
const displayName = oneTimeSetupModal.querySelector("#display-name");

const cancelSetupButton = document.querySelector("#cancel-setup");
const doneSetupButton = document.querySelector("#done-setup");

bindEvents();
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
                splashScreen.remove();
                await init(user, currentUser.data());
            }
        }
    });
}

function bindEvents() {
    doneSetupButton.addEventListener('click', async () => {
        auth.onAuthStateChanged(async (user) => {
            await verifyEmailAndInputs(user);
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
        await setupInformation(currentUserRef, user);
        oneTimeSetupModal.classList.remove("active");
        splashScreen.remove();
        user.reload()
        .then(async () => {
            const querySnapshot = await getQueryOneField('users', 'email', user.email);
            const currentUser = querySnapshot.docs[0];
            await init(user, currentUser.data());
        })
    }
}

async function setupInformation(userRef, user) {
    userRef.update({
        newUser: false,
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        sex: sex.value,
        birthDate: birthDate.value,
        id: id.value
    });

    user.updateProfile({
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

    const areInputAvailable = await areInputUsed();
    if (!areInputAvailable) return false;
    return true;
}

function areInputFieldsFilled() {
    const inputs = [
    firstName.value,
    lastName.value,
    middleName.value,
    birthDate.value,
    id.value,
    displayName.value,
    birthDate.value
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
    return true;
}

async function areInputUsed() {
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