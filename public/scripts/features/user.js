import { auth } from "../firebase/firebase.js";
import { db } from "../firebase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { onSnapshot,
    query,
    collection,
    limit, orderBy, startAt, endAt, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { formatBook } from "./books.js";
import { userDropDownInit } from "../ui/home/user-drop-down-ui.js";
import { sexDropDownInit } from "../ui/home/sex-drop-down.js";
import { filterSearchInit } from "../ui/home/search-filter-drop-down.js";
import { filterSearchInitMobile } from "../ui/home/search-filter-drop-down-mobile.js";
import { displayProfile } from "./user-profile.js";
import { hideSearchResult } from "../ui/home/search-ui.js";
import { bindSearchEvent, addRecentSearch, displayRecentSearches, displayRecentSearchMobile } from "../ui/home/search-ui.js";
import { renderPendingRequests, renderReturnedTransactions, renderTransactions } from "./user-transactions.js";

const transactionModal = document.querySelector("#transactions");
const notificationButton = document.querySelector("#user-notification");

const searchResult = document.querySelector("#search-results");
const closeResultButton = document.querySelector("#close-result-button");

const adminButton = document.querySelector("#admin-button");
const overlay = document.querySelector("#overlay");

const signOutButton = document.querySelector("#sign-out");
const mostViewed = document.querySelector("#most-viewed");
const mostRecent = document.querySelector("#most-recent");

const searchInput = document.querySelector("#search-input");
const searchBy = document.querySelector("#selected-filter");
const searchInputMobile = document.querySelector("#search-input-mobile");
const searchByMobile = document.querySelector("#selected-filter-mobile");

sessionCheck();
bindEvents();
userDropDownInit();
bindSearchEvent();
sexDropDownInit();
filterSearchInit();
filterSearchInitMobile();
displayRecentSearchMobile();

export async function userInit(user, currentUserData) {
    renderData(user, currentUserData);
    displayRecentSearches(user.uid);
}

async function renderData(user, currentUserData) {
    displayProfile(user, currentUserData);
    renderTransactions(currentUserData.id);
    renderPendingRequests(currentUserData.id);
    renderReturnedTransactions(currentUserData.id);
    renderBooks();
}

async function renderBooks() {
    await displayBooks(mostViewed, 'views');
    await displayBooks(mostRecent, 'dateAdded');
}

async function displayBooks(container, ob) {
    const colRef = collection(db, 'books');
    const colQuery = await query(colRef,
        orderBy(ob, 'desc'),
        limit(10)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        container.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const book = formatBook(doc.data(), doc.ref);
            container.appendChild(book);
        });
    });
}

export async function searchBooks(by, input) {
    onAuthStateChanged(auth, user => {
        if (user) {
            addRecentSearch(user.uid, input);
            displayRecentSearches(user.uid);
        }
    });

    const colRef = collection(db, 'books');
    let colQuery;

    if (by === "author" || by === "category") {
        input = input.split(",");
        colQuery = query(colRef,
            where(by, 'array-contains-any', input)
        );
    } else {
        colQuery = query(colRef,
            orderBy(by),
            startAt(input),
            endAt(input  + "\uf8ff")
        );
    }

    const unsubscribe = await onSnapshot(colQuery, (querySnapshot) => {
        searchResult.innerHTML = "";
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                const formattedBook = formatBook(doc.data(), doc.ref);
                searchResult.appendChild(formattedBook);
            });
        } else {
            const tipsLabel = document.createElement("label");
            const notFound = document.createElement("label");
            notFound.classList.add("black");
            notFound.textContent = "Not found.";
            tipsLabel.classList.add("black");
            tipsLabel.textContent = "Searching tips: When searching for author or category, it needs to be " +
                "an exact value, e.g., when you are searching for books with Programming catogery, " +
                "click the drop-down filters, select Category and input 'Programming' on the search bar, you " +
                "can also search for multiple categories, like this, 'Programming, Database'.";
            searchResult.appendChild(notFound);
            searchResult.appendChild(tipsLabel);
        }
    });
    const subscription = async () => {
        unsubscribe();
        overlay.removeEventListener('click', subscription);
        closeResultButton.removeEventListener('click', subscription);
        searchResult.innerHTML = "";
        overlay.classList.remove("active");
        hideSearchResult();
    }

    overlay.addEventListener('click', subscription);
    closeResultButton.addEventListener('click', subscription);
}

async function bindEvents() {
    adminButton.addEventListener('click', () => {
        window.location.href = "./admin.html";
    });

    signOutButton.addEventListener('click', async () => signOut(auth));

    searchInput.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInput.value !== '') {
            searchBooks(searchBy.textContent.toLowerCase().trim(), searchInput.value);
        }
    });

    searchInputMobile.addEventListener('keyup', async (e) => {
        if (e.key === "Enter" && searchInputMobile.value !== '') {
            await searchBooks(searchByMobile.textContent.toLowerCase().trim(), searchInputMobile.value);
        }
    });

    notificationButton.addEventListener('click', () => {
        overlay.classList.add("active");
        transactionModal.style.width = '250px';
    });

    overlay.addEventListener('click', () => {
        overlay.classList.remove("active");
        transactionModal.style.width = '0px';
    });
}

function sessionCheck() {
    onAuthStateChanged(auth, user => {
        user ? null : window.location.href = "./sign-in.html";
    });
}