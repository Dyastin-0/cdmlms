import { db } from '../../firebase/firebase.js';
import { updateQuery } from '../../firebase/firestore-api.js';
import { collection,
    onSnapshot,
    query,
    orderBy, startAt, endAt, where, limit
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { displayConfirmDialog } from '../../utils/confirm-dialog.js';
import { currentDateTime } from '../../utils/date.js';
import { toastMessage } from '../../utils/toast-message.js';
import { displayProcessDialog } from '../../utils/process-dialog.js';

const overlay = document.querySelector("#third-overlay");

const card = document.querySelector("#edit-book");
const editBookContainer = card.querySelector("#edit-book-pins");
const editBookContainerRecent = card.querySelector("#edit-book-pins-recent");
const input = card.querySelector("#search-input-edit-book");
const filterBy = card.querySelector("#selected-filter");

const editBookModal = document.querySelector("#edit-book-modal");
const closeModal = editBookModal.querySelector("#close-edit-book-modal");
const editBookForm = editBookModal.querySelector("#edit-book-form");
const title = editBookForm.querySelector("#edit-book-title");
const isbn = editBookForm.querySelector("#edit-book-isbn");
const author = editBookForm.querySelector("#edit-book-author");
const publisher = editBookForm.querySelector("#edit-book-publication");
const year = editBookForm.querySelector("#edit-book-date-publication");
const category = editBookForm.querySelector("#edit-book-category");
const description = editBookForm.querySelector("#edit-book-description");
const availability = editBookForm.querySelector("#edit-book-availability");

const saveButton = editBookForm.querySelector("#save-book-button");

export function editBookInit() {
    bindEvents();
    displayRecentlyAddedBooks();
}

function formatBookToEdit(book, bookRef) {
    const pin = document.createElement("div");

    const titleEdit = document.createElement("label");
    const isbnEdit = document.createElement("label");
    const authorEdit = document.createElement("label");
    const categoryEdit = document.createElement("label");
    
    const wrapper = document.createElement("div");
    const editButton = document.createElement("button");

    pin.classList.add("pin");
    pin.classList.add("large");
    pin.classList.add("nh");

    titleEdit.classList.add("title");
    titleEdit.textContent = book.title;

    isbnEdit.classList.add("other-details");
    isbnEdit.textContent = book.isbn;

    authorEdit.classList.add("author");
    const authorsLength = book.author.length - 1;
    for (let i = 0; i <= authorsLength; i++) {
        authorEdit.textContent += i == authorsLength ? book.author[i] : book.author[i] + ", ";
    }

    categoryEdit.classList.add("other-details");
    categoryEdit.classList.add("italic");
    const categoriesLength = book.category.length - 1;
    for (let i = 0; i <= categoriesLength; i++) {
        categoryEdit.textContent += i == categoriesLength ? book.category[i] : book.category[i] + ", ";
    }

    wrapper.classList.add("wrapper");

    editButton.classList.add("yellow");
    editButton.textContent = "Edit";

    const process = async () => {
        overlay.classList.add("active");
        editBookModal.classList.add("active");
        title.value = book.title;
        author.value = authorEdit.textContent;
        isbn.value = book.isbn;
        publisher.value = book.publisher;
        year.value = book.datePublicated;
        category.value = categoryEdit.textContent;
        description.value = book.description;
        availability.textContent = book.isAvailable? "Available" : "Not available";
        const saveProcess = async function(e) {
            e.preventDefault();
            const isValid = validateInputs();
            if (isValid) {
                const process = async () => {
                    displayProcessDialog("Updating book...");
                    await save(bookRef);
                    overlay.classList.remove("active");
                    editBookModal.classList.remove("active");
                };
                const confirmMessage = "Save the changes you made?";
                const toastText = "Changes saved.";
                displayConfirmDialog(process, confirmMessage, toastText);
            }
        }
    
        saveButton.addEventListener('click', saveProcess);
    
        closeModal.addEventListener('click', () => {
            hideModal(saveProcess);
        });
        overlay.addEventListener('click', () => {
            hideModal(saveProcess);
        });

    }
    
    editButton.addEventListener('click', process);
    wrapper.appendChild(editButton);

    pin.appendChild(titleEdit);
    pin.appendChild(authorEdit);
    pin.appendChild(categoryEdit);
    pin.appendChild(isbnEdit);
    pin.appendChild(wrapper);

    return pin;
}

async function searchCatalogueFor(input, by) {
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
    onSnapshot(colQuery, (querySnapshot) => {
        editBookContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatBookToEdit(doc.data(), doc.ref);
            editBookContainer.appendChild(formatted);
        });
    });
}

async function save(bookRef) {
    const bookAvailability = availability.textContent == "Available" ? true : false;
    const categories = category.value.split(",").map(element => element.trim());
    const authors = author.value.split(",").map(element => element.trim());
    const changes = {
        title: title.value.trim(),
        author: authors,
        description: description.value.trim(),
        category: categories,
        isAvailable: bookAvailability,
        isbn: isbn.value.trim(),
        publisher: publisher.value.trim(),
        datePublicated: year.value.trim(),
        dateModified: currentDateTime(),
    }
    updateQuery(bookRef, changes);
}

async function displayRecentlyAddedBooks() {
    const colRef = collection(db, 'books');
    const colQuery = await query(colRef,
        orderBy('dateAdded', 'desc'),
        limit(10)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        editBookContainerRecent.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const book = formatBookToEdit(doc.data(), doc.ref);
            editBookContainerRecent.appendChild(book);
        });
    });
}

function validateInputs() {
    if (!areInputsFilled()) return false;
    if (!areInputsValid()) return false;
    return true;
}

function areInputsFilled() {
    const inputs = [
        title.value,
        author.value,
        publisher.value,
        year.value,
        category.value,
        isbn.value,
        availability.textContent,
        description.value
    ];
    
    if (inputs.some(field => !field)) {
        toastMessage("There is an empty field.");
        return false;
    }
    return true;
}

function areInputsValid() {
    if (!/^\d{4}$/.test(year.value)) {
        toastMessage("Invalid year format.");
        return false;
    }

    if (!/^\d{13}$/.test(isbn.value)) {
        toastMessage("Invalid ISBN format.");
        return false;
    }
    
    return true;
}

function bindEvents() {
    input.addEventListener('keyup', (e) => {
        if (e.key === "Enter" && input.value !== '') {
            searchCatalogueFor(input.value, filterBy.textContent.toLowerCase().trim());
        }
    });
}

function hideModal(eventRef) {
    const process = async () => {
        overlay.classList.remove("active");
        editBookModal.classList.remove("active");
        editBookForm.reset();
        saveButton.removeEventListener('click', eventRef);
        overlay.removeEventListener('click', eventRef);
        closeModal.removeEventListener('click', eventRef);
    }
    const confirmMessage = "The changes you made will be lost. Continue?";
    displayConfirmDialog(process, confirmMessage, null);
}