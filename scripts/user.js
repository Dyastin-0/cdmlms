import { fetchAllFeaturedBooks, formatBooks, findBookBy } from "./books.js";
import { userDropDownInit } from "./ui/home/user-drop-down-ui.js";
import { addRecentSearch, displayRecentSearches, bindSearchEvent, 
    generateSearchResultItem, generateErrorResult, displayRecentSearchMobile } from "./ui/home/search-ui.js";
import { signOutFirebaseAuth } from "./auth-api.js";
import { getQueryOneField } from "./firestore-api.js";
import { isIdValid, warning } from "./validation.js";
import { isDisplayNameAvailable, isIdAvailable } from "./authentication.js";

auth.onAuthStateChanged(user => {
    if (user) {
        user.getIdTokenResult()
        .then(async (IdTokenResult) => {
            const expiration = Date.parse(IdTokenResult.expirationTime);
            const dateNow = new Date().getTime();
            if (dateNow > expiration) {
                await signOutFirebaseAuth();
                window.location.href = './';
            }
        });
    } else {
        window.location.href = './';
    }
});

let cachedFeatured = {};
let myBooks = {};
const username = document.querySelector("#display-name");
const logout = document.querySelector("#log-out");
const featured = document.querySelector("#featured");
const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#search-by");
const searchResult = document.querySelector("#search-results");
const searchInputMobile = document.querySelector("#search-input-mobile");
const searchByMobile = document.querySelector("#search-by-mobile");

const splashScreen = document.querySelector("#splash-screen");
const oneTimeSetupModal = document.querySelector("#one-time-setup-modal");

const cancelSetupButton = document.querySelector("#cancel-setup");
const doneSetupButton = document.querySelector("#done-setup");

const firstName = oneTimeSetupModal.querySelector("#first-name");
const lastName = oneTimeSetupModal.querySelector("#last-name");
const middleName = oneTimeSetupModal.querySelector("#middle-name");
const sex = oneTimeSetupModal.querySelector("#sex");
const birthDate = oneTimeSetupModal.querySelector("#birth-date");
const id = oneTimeSetupModal.querySelector("#id");
const displayName = oneTimeSetupModal.querySelector("#display-name");

async function init() {
    await firstLogin();
    bindEvents();
    bindSearchEvent();
    userDropDownInit();
    cachedFeatured = await fetchAllFeaturedBooks();
    await renderData();
    displayRecentSearchMobile();
    observerScroll();
}

async function bindEvents() {
    logout.addEventListener('click', async () => await logOut());

    searchInput.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInput.value !== '') {
            await search(searchBy.value, searchInput.value);
        }
    });

    searchInputMobile.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInputMobile.value !== '') {
            await search(searchByMobile.value, searchInputMobile.value);
        }
    });

    cancelSetupButton.addEventListener('click', async () => await logOut());

    doneSetupButton.addEventListener('click', async () => {
        await auth.onAuthStateChanged(async (user) => {
            if (user) {
                const querySnapshot = await getQueryOneField("users", "email", user.email);
                const currentUser = querySnapshot.docs[0].ref;
                if (await areInputsValid()) {
                    setupInformation(currentUser);
                    oneTimeSetupModal.classList.remove("active");
                    splashScreen.remove();
                }
            }
        });
    });
}

async function renderData() {
    auth.onAuthStateChanged(user => {
        if (user) {
            displayRecentSearches(user.uid);
        }
    });

    const formattedBooks = formatBooks(cachedFeatured.books);

    formattedBooks.forEach((formattedBook) => {
        featured.appendChild(formattedBook);
    });
}

async function logOut() {
    await signOutFirebaseAuth();
    window.location.href = './';
}

export async function search(by, input) {
    auth.onAuthStateChanged(user => {
        if (user) {
            addRecentSearch(user.uid, input);
            displayRecentSearches(user.uid);
        }
    });

    const search = await findBookBy(by, input);

    if (search.error === null) {
        search.results.forEach((book) => {
            const result = generateSearchResultItem(book);
            searchResult.appendChild(result);
        });
    } else {
        const error = generateErrorResult(search.error);
        searchResult.appendChild(error);
    }
}

async function firstLogin() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const querySnapshot = await getQueryOneField('users', 'email', user.email);
            const currentUser = querySnapshot.docs[0];
            const isNewUser = currentUser.data().newUser;
            if (isNewUser) {
                oneTimeSetupModal.classList.add("active");
            } else {
                splashScreen.remove();
                username.textContent = currentUser.data().displayName;
            }
        }
    });
}

async function areInputsValid() {
    if (!firstName.value || !lastName.value 
        || !middleName.value || !birthDate.value
        || !id.value || !displayName.value || !birthDate.value) {
        warning("There is an empty field.", "setup");
        return false;
    }

    if (!birthDate.value) {
        warning("Provide your birth date.", "setup");
        return false;
    }

    if (!isIdValid(id.value)) return false;

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

async function setupInformation(userRef) {
    userRef.update({
        newUser: false,
        firstName: firstName.value,
        middleName: middleName.value,
        lastName: lastName.value,
        sex: sex.value,
        birthDate: birthDate.value,
        id: id.value,
        displayName: displayName.value
    })
}

init();
