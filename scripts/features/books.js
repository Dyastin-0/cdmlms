import { searchQuery } from "../firebase/firestore-api.js";

const overlay = document.querySelector("#second-overlay");

const viewBookModal = document.querySelector("#view-book-modal");
const bookDetails = viewBookModal.querySelector("#book-details");
const closeButton = viewBookModal.querySelector("#close-view-book-modal");

bindEvents();

function bindEvents() {
    closeButton.addEventListener('click', () => {
        viewBookModal.classList.remove("active");
        overlay.classList.remove("active");
        bookDetails.innerHTML = "";
    });

    overlay.addEventListener('click', () => {
        viewBookModal.classList.remove("active");
        overlay.classList.remove("active");
        bookDetails.innerHTML = "";
    });
}

function bindPinEvent(pin, book, bookRef) {
    pin.addEventListener('click', () => {
        bookRef.update({
            views: book.views + 1
        });

        const title = document.createElement("label");
        const author = document.createElement("label");
        const description = document.createElement("label");
        const category = document.createElement("label");
        const availability = document.createElement("label");
        const isbn = document.createElement("label");

        const eye = document.createElement("i");
        const views = document.createElement("label");

        title.classList.add("title");
        title.textContent = book.title;

        author.classList.add("other-details");
        author.classList.add("weighted");
        author.textContent = book.author;

        description.classList.add("other-details");
        description.textContent = book.description;

        isbn.classList.add("other-details");
        isbn.textContent =  book.isbn;

        category.classList.add("other-details");
        category.classList.add("italic");
        category.textContent = book.category;

        availability.classList.add("other-details");
        availability.classList.add("green");
        availability.textContent = book.availability;
        
        views.classList.add("other-details");
        views.classList.add("views");
        views.textContent = book.views + " ";

        eye.classList.add("fa-solid");
        eye.classList.add("fa-eye");
        
        views.appendChild(eye);

        bookDetails.appendChild(title);
        bookDetails.appendChild(author);
        bookDetails.appendChild(description);
        bookDetails.appendChild(category);
        bookDetails.appendChild(isbn);
        bookDetails.appendChild(availability);
        bookDetails.appendChild(views);

        overlay.classList.add("active");
        viewBookModal.classList.add("active");
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
    author.textContent = book.author;

    pin.appendChild(title);
    pin.appendChild(author);

    bindPinEvent(pin, book, bookRef);

    return pin;
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