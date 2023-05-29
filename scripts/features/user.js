import { formatBook } from "./books.js";
import { userDropDownInit } from "../ui/home/user-drop-down-ui.js";
import { sexDropDownInit } from "../ui/home/sex-drop-down.js";
import { filterSearchInit } from "../ui/home/search-filter-drop-down.js";
import { filterSearchInitMobile } from "../ui/home/search-filter-drop-down-mobile.js";
import { signOutFirebaseAuth } from "../firebase/auth-api.js";
import { displayProfile } from "./user-profile.js";
import { bindSearchEvent, displayRecentSearches, displayRecentSearchMobile } from "../ui/home/search-ui.js";
import { search } from "./search-book.js";

const adminButton = document.querySelector("#admin-button");

const signOut = document.querySelector("#sign-out");
const mostViewed = document.querySelector("#most-viewed");
const mostRecent = document.querySelector("#most-recent");

const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#selected-filter");
const searchInputMobile = document.querySelector("#search-input-mobile");
const searchByMobile = document.querySelector("#selected-filter-mobile");

const indexButton = document.querySelector("#index-button");

sessionCheck();
bindEvents();

export async function userInit(user, currentUserData) {
    await renderData(user, currentUserData);
    displayRecentSearches(user.uid);
    displayRecentSearchMobile();
    userDropDownInit();
    bindSearchEvent();
    sexDropDownInit();
    filterSearchInit();
    filterSearchInitMobile();
}

async function renderData(user, currentUserData) {
    displayProfile(user, currentUserData);
    await renderBooks();
}

async function renderBooks() {
    await displayBooks(mostViewed, 'views');
    await displayBooks(mostRecent, 'dateAdded');
}

async function displayBooks(container, orderBy) {
    const query = await db
    .collection('books')
    .orderBy(orderBy, 'desc')
    .limit(5);

    const unsubscribe = query.onSnapshot((querySnapshot) => {
        container.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const book = formatBook(doc.data(), doc.ref);
            container.appendChild(book);
        });
    });
}

export async function logOut() {
    await signOutFirebaseAuth();
}

async function bindEvents() {
    adminButton.addEventListener('click', () => {
        window.location.href = "./admin.html";
    });

    signOut.addEventListener('click', async () => await logOut());

    searchInput.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInput.value !== '') {
            search(searchBy.textContent.toLowerCase().trim(), searchInput.value);
        }
    });

    searchInputMobile.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInputMobile.value !== '') {
            await search(searchByMobile.textContent.toLowerCase().trim(), searchInputMobile.value);
        }
    });

    indexButton.addEventListener('click', () => {
        window.location.href = './';
    });
}

function sessionCheck() {
    auth.onAuthStateChanged(user => {
        user ? null : window.location.href = "./";
    });
}