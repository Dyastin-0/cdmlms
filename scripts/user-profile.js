import { fetchProfilePhoto, uploadProfilePhoto } from "./storage-api.js";
import { displayConfirmDialog } from "./confirm-dialog.js";
import { toastMessage } from "./toast-message.js";

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
            if (user) {
                if (user.emailVerified) {
                    const photo = event.target.files[0];
                    const confirmMessage = "Are you sure you want to update your display photo?";
                    const toastMessage = "Profile photo changed!"
                    const process = () => updateProfilePhoto(photo, user);
                    await displayConfirmDialog(process, confirmMessage, toastMessage);
                } else {
                    toastMessage("Verify your account to start customizing your profile.");
                }
            }
            photoInputForm.reset();
        })
    });
}

async function updateProfilePhoto(photo, user) {
    await uploadProfilePhoto(user, photo);
    const imageURL = await fetchProfilePhoto(user);
    await user.updateProfile({
        photoURL: imageURL
    })
    profilePhoto.src = imageURL;
}

export async function displayProfile(user, userData) {
    await user.reload();
    if (userData && !userData.newUser) {
        email.textContent = user.email;
        displayedName.textContent = user.displayName;
        profileHeader.textContent = user.displayName;
        user.photoURL? profilePhoto.src = user.photoURL : null;
        fullName.textContent = userData.firstName + " " + userData.middleName + " " + userData.lastName;
    } else {
        displayedName.textContent = user.email;
        email.textContent = user.email;
    }
    user.emailVerified ? verified.textContent = "Verified ✓" : verified.textContent = "Not verified";
}