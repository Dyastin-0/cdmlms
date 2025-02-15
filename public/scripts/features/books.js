import { auth } from "../firebase/firebase.js";
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { getQueryTwoFields, updateQuery } from "../firebase/firestore-api.js";

import { getQueryOneField, searchQuery } from "../firebase/firestore-api.js";
import { saveQuery } from "../firebase/firestore-api.js";
import { currentDateTime } from '../../scripts/utils/date.js';
import { displayProcessDialog, hideProcessDialog } from '../utils/process-dialog.js';
import { toastMessage } from '../utils/toast-message.js'
import { displayConfirmDialog } from '../utils/confirm-dialog.js';

const overlay = document.querySelector("#second-overlay");

const viewBookModal = document.querySelector("#view-book-modal");
const bookDetails = viewBookModal.querySelector("#book-details");
const closeButton = viewBookModal.querySelector("#close-view-book-modal");

function bindPinEvent(pin, book, bookRef) {
    pin.addEventListener('click', () => {
        updateQuery(bookRef, {
            views: book.views + 1
        });

        const unsubscribe = onSnapshot(bookRef, (rtBook) => {
            const rtBookData = rtBook.data();

            const title = document.createElement("label");
            const author = document.createElement("label");
            const description = document.createElement("label");
            const category = document.createElement("label");
            const publication = document.createElement("label");
            const availability = document.createElement("label");
            const isbn = document.createElement("label");

            const eye = document.createElement("i");
            const views = document.createElement("label");

            const requestButton = document.createElement("button");

            title.classList.add("title");
            title.textContent = rtBookData.title;
            
            author.classList.add("other-details");
            author.classList.add("weighted");

            const authorsLength = rtBookData.author.length - 1;
            for (let i = 0; i <= authorsLength; i++) {
                author.textContent += i == authorsLength ? rtBookData.author[i] : rtBookData.author[i] + ", ";
            }

            description.classList.add("other-details");
            description.textContent = rtBookData.description;

            isbn.classList.add("other-details");
            isbn.textContent =  rtBookData.isbn;

            category.classList.add("other-details");
            category.classList.add("italic");

            const categoriesLength = rtBookData.category.length - 1;
            for (let i = 0; i <= categoriesLength; i++) {
                category.textContent += i == categoriesLength ? rtBookData.category[i] : rtBookData.category[i] + ", ";
            }

            publication.classList.add("other-details");
            publication.textContent = `${rtBookData.publisher}, ${rtBookData.datePublicated}`;

            availability.classList.add("other-details");
            availability.classList.add("green");
            availability.textContent = rtBookData.isAvailable ? "Available" : "Not available";
            
            views.classList.add("other-details");
            views.classList.add("views");
            views.textContent = rtBookData.views + " ";

            eye.classList.add("fa-solid");
            eye.classList.add("fa-eye");
            
            views.appendChild(eye);

            requestButton.classList.add("request-button");
            requestButton.textContent = "Request";

            requestButton.addEventListener('click', () => {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        if (!rtBookData.isAvailable) {
                            toastMessage("Book is not available.");
                            return;
                        }
                        const querySnapshot = await getQueryOneField('users', 'email', user.email);
                        const userData = querySnapshot.docs[0].data();
                        const penaltyCount = userData.penaltyCount;
                        if (penaltyCount >= 5) {
                            toastMessage("You are blocked from requesting a book.");
                            return;
                        }
                        const querySnapshot1 = await getQueryTwoFields('requests', 'bookIsbn', 'requestedBy', rtBookData.isbn, userData.id);
                        if (!querySnapshot1.empty) {
                            toastMessage("You have already sent a request for this book.");
                            return;
                        }
                        const process = async () => {
                            displayProcessDialog("Sending request...");
                            sendBookRequest(rtBookData.isbn, rtBookData.title, userData);
                        }
                        const processMessage = `You are about to send an issue request for '${book.title}.' Continue?`;
                        const toastText = "Book request sent, wait for an update.";
                        displayConfirmDialog(process, processMessage, toastText);
                    }
                });
            });
            bookDetails.innerHTML = "";
            bookDetails.appendChild(title);
            bookDetails.appendChild(author);
            bookDetails.appendChild(description);
            bookDetails.appendChild(category);
            bookDetails.appendChild(publication);
            bookDetails.appendChild(isbn);
            bookDetails.appendChild(availability);
            bookDetails.appendChild(views);
            bookDetails.appendChild(requestButton);

            overlay.classList.add("active");
            viewBookModal.classList.add("active");

            const subscription = () => {
                unsubscribe();
                viewBookModal.classList.remove("active");
                overlay.classList.remove("active");
                closeButton.removeEventListener('click', subscription);
                overlay.removeEventListener('click', subscription);
            }

            closeButton.addEventListener('click', subscription);
            overlay.addEventListener('click', subscription);
        });
    });
}

export function formatBook(book, bookRef) {
    const pin = document.createElement("div");
    const title = document.createElement("label");
    const author = document.createElement("label");

    pin.classList.add("pin");
    pin.classList.add("small");

    title.classList.add("title");
    title.textContent = book.title;

    author.classList.add("author");
    const authorsLength = book.author.length - 1;
    for (let i = 0; i <= authorsLength; i++) {
        author.textContent += i == authorsLength ? book.author[i] : book.author[i] + ", ";
    }
    pin.appendChild(title);
    pin.appendChild(author);

    bindPinEvent(pin, book, bookRef);

    return pin;
}

async function sendBookRequest(isbn, title, userData) {
    const requestInfo = {
        type: "Request",
        bookIsbn: isbn,
        bookTitle: title,
        requestedBy: userData.id,
        timeRequested: currentDateTime()
    }
    await saveQuery('requests', crypto.randomUUID(), requestInfo);
}
 
export function formatBooks(books, bookRef) {
    let formattedBoooks = [];

    books.forEach((book) => {
       const pin = formatBook(book, bookRef);
        formattedBoooks.push(pin);
    });

    return formattedBoooks;
}

export async function findBookBy(by, input) {
    try {
        const querySnapshot = await searchQuery('books', by, input, input);
        
        const search = {error: null, results: []};
        const queryResult = querySnapshot.docs;
        queryResult.forEach((book) => {
            const bookRef = {
                details: book.data(),
                ref: book.ref
            }
            search.results.push(bookRef)
        });

        if(search.results.length > 0) {
            return search;
        }

        search.error = "Search not found. Note, search is case-sensitive, and does not searches a word in between.";
        return search;
    } catch (error) {
        console.error(error);
    }
}