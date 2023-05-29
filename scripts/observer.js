const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
});

scrollObserver();

function scrollObserver() {
    const elements = document.body.querySelectorAll(".hide");
    elements.forEach((element) => observer.observe(element));
}
