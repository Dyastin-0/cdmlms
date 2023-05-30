const adminHomeButton = document.querySelector("#admin-home");

export function adminNavUiInit() {
    adminHomeButton.addEventListener('click', () => {
        window.location.href = "./home.html";
    });
}