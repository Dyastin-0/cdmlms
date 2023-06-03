export function displayDropDown(container) {
    container.style.transform = "translateY(0) scaleY(1)";
    container.style.opacity = "1";
}

export function hideDropDown(container) {
    container.style.transform = "translateY(-50%) scaleY(0)";
    container.style.opacity = "0";
}