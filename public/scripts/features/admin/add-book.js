import { toastMessage } from "../../utils/toast-message.js";
import { saveQuery } from "../../firebase/firestore-api.js";
import { displayProcessDialog, hideProcessDialog } from '../../utils/process-dialog.js';
import { currentDate } from '../../utils/date.js';
import { displayConfirmDialog } from "../../utils/confirm-dialog.js";

const addBookForm = document.querySelector("#add-book-form");

const title = addBookForm.querySelector("#add-book-title");
const author = addBookForm.querySelector("#add-book-author");
const  publication = addBookForm.querySelector("#add-book-publication");
const datePublication = addBookForm.querySelector("#add-book-date-publication");
const category = addBookForm.querySelector("#add-book-category");
const isbn = addBookForm.querySelector("#add-book-isbn");
const availability = addBookForm.querySelector("#add-book-availability");
const description = addBookForm.querySelector("#add-book-description");

const addBookButton = addBookForm.querySelector("#add-book-button");
const clearFormButton = addBookForm.querySelector("#add-book-clear-button");

export async function bindAddBookEvents() {
    clearFormButton.addEventListener('click', (e) => {
        e.preventDefault();
        addBookForm.reset();
    });

    addBookButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const areInputFilled = areInputsFilled();
        if (areInputFilled) {
            const proceess = async () => {
                displayProcessDialog("Adding book...");
                await saveQuery('books', crypto.randomUUID(), bookInfo());
                hideProcessDialog();
                addBookForm.reset();
            }
            const confirmMessage = "You are about to add the book on the catalogue. Continue?";
            const toastText = "Book added.";
            displayConfirmDialog(proceess, confirmMessage, toastText);
        }
    });
}

function areInputsFilled() {
    const inputs = [
        title.value,
        author.value,
        publication.value,
        datePublication.value,
        category.value,
        isbn.value,
        availability.textContent,
        description.value
    ]
    
    if (inputs.some(field => !field)) {
        toastMessage("There is an empty field.");
        return false;
    }
    return true;
}

function bookInfo() {
    const bookAvailability = availability.textContent == "Available" ? true : false;
    const info = {
        title: title.value,
        author: author.value,
        description: description.value,
        category: category.value,
        isAvailable: bookAvailability,
        isbn: isbn.value,
        publisher: publication.value,
        datePublicated: datePublication.value,
        dateAdded: currentDate(),
        views: 0
    }
    return info;
}