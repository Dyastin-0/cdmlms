function bindPinEvent(pin) {
    pin.addEventListener('click', () => {
        console.log("Test");
    });
}

export function formatBook(book) {
    const pin = document.createElement("div");
    const title = document.createElement("label");
    const author = document.createElement("label");
    const genre = document.createElement("label");
    const isbn = document.createElement("label");

    pin.classList.add("pin");
    pin.classList.add("small");

    title.classList.add("title");
    title.textContent = book.title;
    author.classList.add("author");
    author.textContent = book.author;
    genre.classList.add("genre");
    genre.textContent = book.genre;
    isbn.classList.add("author");
    isbn.textContent = book.isbn;

    pin.appendChild(title);
    pin.appendChild(author);
    pin.appendChild(genre);
    pin.appendChild(isbn);

    bindPinEvent(pin);
    return pin;
}

export async function fetchAllBooks() {
    const cachedBooks = fetchCachedBooks();
    const currentTime = new Date().getTime();

    if (cachedBooks && cachedBooks.expiration > currentTime) {
        return cachedBooks;
    }

    localStorage.removeItem("books");
    try {
        const querySnapshot = await db
        .collection('books')
        .get();

        const books = querySnapshot.docs;
        let allBooks = [];
        
        books.forEach((book) => {
            const bookData = book.data();
            allBooks.push(bookData);
        });

        cacheBooks(allBooks);
        return books;
    } catch (error) {
        console.log(error)
    }
}

export async function findBookBy(by, input) {
    try {
        const querySnapshot = await db
        .collection('books')
        .orderBy(by).startAt(input)
        .endAt(input + "\uf8ff")
        .get();
        
        const search = {error: null, results: []};
        const queryResult = querySnapshot.docs;

        queryResult.forEach((book) => {
            search.results.push(book.data());
        });

        if(search.results.length > 0) {
            return search;
        }

        search.error = "Not found, check if you are searching with the right field.";
        return search;
    } catch (error) {
        console.log(error)
    }
}

function cacheBooks(books) {
    const expirationTime = 24 * 60 * 60 * 1000;
    const expirationDate = new Date().getTime() + expirationTime;
    const cacheData = {
        books: books.map((book) => book),
        expiration: expirationDate
    };

    localStorage.setItem("books", JSON.stringify(cacheData));
}

function fetchCachedBooks() {
    return JSON.parse(localStorage.getItem("books"));
}