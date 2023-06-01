const leftNav = document.querySelector("#left-nav");

const homeButton = leftNav.querySelector("#left-home-button");
const homeCard = document.querySelector("#statistics");

const addBook = leftNav.querySelector("#left-add-button");
const addBookCard = document.querySelector("#add-book");

const requestButton = leftNav.querySelector("#left-requests-button");
const requestCard = document.querySelector("#issue-requests");

const cards = [
    homeCard,
    addBookCard,
    requestCard
];

bindEvents();

function bindEvents() {
    addBook.addEventListener('click', () => {
        hideCards();
        addBookCard.classList.add("active");
    });
    homeButton.addEventListener('click', () => {
        hideCards();
        homeCard.classList.add("active");
    });
    requestButton.addEventListener('click', () => {
        hideCards();
        requestCard.classList.add("active");
    });
}

function hideCards() {
    cards.forEach((card) => {
        card.classList.remove("active");
    });
}