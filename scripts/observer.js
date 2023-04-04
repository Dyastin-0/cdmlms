const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
});

function observerScroll() {
    const elements = document.querySelectorAll(".hide");
    elements.forEach((element) => scrollObserver.observe(element));
}
