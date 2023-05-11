import { fetchProfilePhoto, uploadProfilePhoto } from "./storage-api.js";
import { displayConfirmDialog } from "./confirm-dialog.js";

const profileModal = document.getElementById("user-profile-modal");
const profileHeader = profileModal.querySelector("#profile-modal-header");

const fullName = profileModal.querySelector("#full-name");
const email = profileModal.querySelector("#display-email");
const verified = profileModal.querySelector("#display-verified");
const displayedName = document.querySelector("#display-name");

const profileButton = document.querySelector("#display-name");
const closeProfile = profileModal.querySelector("#close-profile");
const profilePhotoOverlay = profileModal.querySelector("#photo-overlay");
const profilePhoto = profileModal.querySelector("#display-photo");
const photoInput = profileModal.querySelector("#photo-input");
const photoInputForm = profileModal.querySelector("#photo-input-form");

const overlay = document.getElementById("overlay");

export function userProfileInit() {
    bindEvents();
}

function bindEvents() {
    profileButton.addEventListener('click', () => {
        profileModal.classList.add("active");
        overlay.classList.add("active");
    });

    closeProfile.addEventListener('click', () => {
        profileModal.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay.addEventListener('click', () => {
        profileModal.classList.remove("active");
        overlay.classList.remove("active");
    });

    profilePhotoOverlay.addEventListener('mouseenter', async () => {
        profilePhotoOverlay.classList.add("hovered");
    });
    profilePhotoOverlay.addEventListener('mouseleave', async () => {
        profilePhotoOverlay.classList.remove("hovered");
    });

    photoInput.addEventListener('input', async (event) => {
        auth.onAuthStateChanged(async (user) => {
            if (user && user.emailVerified) {
                const photo = event.target.files[0];
                await uploadProfilePhoto(user, photo);

                const imageURL = await fetchProfilePhoto(user);
                const confirmMessage = "Are you sure you want to update your display photo?";
                const process = () => updateProfilePhoto(user, imageURL);
                await displayConfirmDialog(process, confirmMessage);

            } else {
                alert("Verify your account to start customizing your profile.");
            }
            photoInputForm.reset();
        })
    });
}

async function updateProfilePhoto(user, imageURL) {
    await user.updateProfile({
        photoURL: imageURL
    })
    profilePhoto.src = imageURL;
}

export async function displayProfile(user, userData) {
    user.emailVerified ? verified.textContent = "Verified ✓" : verified.textContent = "Not verified";
    if (!userData.newUser) {
        email.textContent = user.email;
        displayedName.textContent = user.displayName;
        profileHeader.textContent = user.displayName;
        if (user.photoURL) profilePhoto.src = user.photoURL;
        fullName.textContent = userData.firstName + " " + userData.middleName + " " + userData.lastName;
    } else {
        displayedName.textContent = user.email;
        email.textContent = user.email;
    }
}