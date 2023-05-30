import { toastMessage } from "../../utils/toast-message.js";
import { saveQuery } from "../../firebase/firestore-api.js";

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
            await saveQuery('books', crypto.randomUUID(), bookInfo());
            toastMessage("Book added!");
            addBookForm.reset();
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
        availability.value,
        description.value
    ]
    
    if (inputs.some(field => !field)) {
        toastMessage("There is an empty field.");
        return false;
    }
    return true;
}

function bookInfo() {
    const info = {
        title: title.value,
        author: author.value,
        description: description.value,
        category: category.value,
        availability: availability.value,
        isbn: isbn.value,
        publication: publication.value,
        datePublication: datePublication.value,
        dateAdded: currentDate(),
        views: 0
    }
    return info;
}

function currentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }