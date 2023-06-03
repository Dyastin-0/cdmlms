import { displayDropDown, hideDropDown } from "./home-ui-utils.js";

const sexDropDown = document.querySelector("#sex-drop-down");
const sexDropDownMenu = sexDropDown.querySelector("#sex-drop-down-menu");

const selectedSex = sexDropDown.querySelector("#selected-sex");
const sexDropDownButton = sexDropDown.querySelector("#sex-drop-down-button");
const sexChevron = sexDropDown.querySelector("#sex-drop-down-chevron");

const maleSex = sexDropDownMenu.querySelector("#male-sex");
const femaleSex = sexDropDownMenu.querySelector("#female-sex");

export function sexDropDownInit() {
    bindEvents();
}

function bindEvents() {
    sexDropDownButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isOpen) {
            sexChevron.style.transform = 'rotate(180deg)';
            displayDropDown(sexDropDownMenu);
            isOpen = true;
            addGlobalClick();
        } else {
            sexChevron.style.transform = 'rotateY(360deg)';
            hideDropDown(sexDropDownMenu);
            isOpen = false;
            document.removeEventListener('click', handleGlobalClick);
        }
    });

    maleSex.addEventListener('click', (e) => {
        e.preventDefault();
        selectedSex.textContent = maleSex.textContent; 
    });

    femaleSex.addEventListener('click', (e) => {
        e.preventDefault();
        selectedSex.textContent = femaleSex.textContent; 
    });
}

let isOpen = false;
function handleGlobalClick(e) {
    const isClicked = sexDropDownButton.contains(e.target);

    if (!isClicked) {
        hideDropDown(sexDropDownMenu);
        isOpen = false;
        sexChevron.style.transform = 'rotateY(360deg)';
        document.removeEventListener('click', handleGlobalClick);
    }
}

function addGlobalClick() {
    document.addEventListener('click', handleGlobalClick);
}
