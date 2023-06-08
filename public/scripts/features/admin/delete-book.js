import { db } from "../../firebase/firebase.js";
import { deleteQueryFromRef } from "../../firebase/firestore-api.js";
import { collection,
    onSnapshot,
    query,
    orderBy, startAt, endAt, where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { displayConfirmDialog } from "../../utils/confirm-dialog.js";
import { displayProcessDialog } from "../../utils/process-dialog.js";
const deleteBookCard = document.querySelector("#delete-book");

const input = deleteBookCard.querySelector("#search-input-delete-book");
const by = deleteBookCard.querySelector("#delete-selected-filter");

const deleteBookContainer = deleteBookCard.querySelector("#delete-book-pins-container");

export function delebookInit() {
    bindEvents();
}

function formatBookToDelete(book, bookRef) {
    const pin = document.createElement("div");

    const title = document.createElement("label");
    const author = document.createElement("label");
    const category = document.createElement("label");
    const isbn = document.createElement("label");

    const wrapper = document.createElement("div");
    const deleteButton = document.createElement("button");

    pin.classList.add("pin");
    pin.classList.add("large");
    pin.classList.add("nh");

    title.classList.add("title");
    title.textContent = book.title;

    author.classList.add("author");
    const authorsLength = book.author.length - 1;
    for (let i = 0; i <= authorsLength; i++) {
        author.textContent += i == authorsLength ? book.author[i] : book.author[i] + ", ";
    }

    category.classList.add("other-details");
    category.classList.add("italic");
    const categoriesLength = book.category.length - 1;
    for (let i = 0; i <= categoriesLength; i++) {
        category.textContent += i == categoriesLength ? book.category[i] : book.category[i] + ", ";
    }

    isbn.classList.add("other-details");
    isbn.textContent = book.isbn;

    wrapper.classList.add("wrapper");
    deleteButton.classList.add("red");
    deleteButton.classList.add("fill");
    deleteButton.textContent = "Delete";
    wrapper.appendChild(deleteButton);

    deleteButton.addEventListener('click', () => {
        const process = async () => {
            displayProcessDialog("Deleting book...");
            await deleteBook(bookRef);
        }
        const confirmMessage = `You are about to delete ${book.title} permanently. Continue?`;
        const toastText = "Book deleted.";
        displayConfirmDialog(process, confirmMessage, toastText);
    });

    pin.appendChild(title);
    pin.appendChild(author);
    pin.appendChild(category);
    pin.appendChild(wrapper);

    return pin;
}

async function deleteBook(bookRef) {
    deleteQueryFromRef(bookRef);
}

async function searchBookToDelete(input, by) {
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
        deleteBookContainer.innerHTML = "";
        querySnapshot.forEach((doc) => {
            const formatted = formatBookToDelete(doc.data(), doc.ref);
            deleteBookContainer.appendChild(formatted);
        });
    });
}

function bindEvents() {
    input.addEventListener('keyup', (e) => {
        if (e.key === "Enter" && input.value !== '') {
            searchBookToDelete(input.value, by.textContent.toLowerCase().trim());
        }
    });
}