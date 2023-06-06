const leftNav = document.querySelector("#left-nav");

const overlay = document.querySelector("#overlay");

const adminHomeButton = document.querySelector("#admin-home");
const leftNavButton = document.querySelector("#left-nav-button");

const desktopNavWidth = '50px';

if (window.innerWidth > 600) {
    leftNav.style.width = desktopNavWidth;
} else {
    leftNav.style.width = '0px';
}

export function adminNavUiInit() {
    adminHomeButton.addEventListener('click', () => {
        window.location.href = "./home.html";
    });

    leftNavButton.addEventListener('click', () => {
        overlay.classList.add("active");
        leftNav.style.width = '160px';
    });

    leftNav.onmouseover = () => {
        leftNav.style.width = '160px';
        overlay.classList.add("active");
    };

    leftNav.onmouseleave = () => {
        leftNav.style.width = window.innerWidth < 600 ? '0px' : desktopNavWidth;
        overlay.classList.remove("active");
    };

    overlay.addEventListener('click', () => {
        overlay.classList.remove("active");
        if (window.innerWidth > 600) {
            leftNav.style.width = desktopNavWidth;
        } else {
            leftNav.style.width = '0px';
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            leftNav.style.width = desktopNavWidth;
        } else {
            leftNav.style.width = '0px';
        }
    });
}