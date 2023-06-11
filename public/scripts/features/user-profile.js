import { auth, db } from "../firebase/firebase.js";
import { onSnapshot,
    query,
    collection,
    where
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

import { fetchProfilePhoto, uploadProfilePhoto } from "../firebase/storage-api.js";
import { displayConfirmDialog } from "../utils/confirm-dialog.js";
import { toastMessage } from "../utils/toast-message.js";

const profileModal = document.getElementById("user-profile-modal");
const profileHeader = profileModal.querySelector("#profile-modal-header");

const fullName = profileModal.querySelector("#full-name");
const email = profileModal.querySelector("#display-email");
const penaltyCount = profileModal.querySelector("#penalty-count");
const verified = profileModal.querySelector("#display-verified");

const profileButton = document.querySelector("#display-name");
const closeProfile = profileModal.querySelector("#close-profile");
const profilePhotoOverlay = profileModal.querySelector("#photo-overlay");
const profilePhoto = profileModal.querySelector("#display-photo");
const photoInput = profileModal.querySelector("#photo-input");
const photoInputForm = profileModal.querySelector("#photo-input-form");

const overlay = document.getElementById("overlay");

bindEvents();

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
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const photo = event.target.files[0];
                const confirmMessage = "Are you sure you want to update your display photo?";
                const toastText = "Profile photo updated!";
                const process = () => updateProfilePhoto(photo, user);
                await displayConfirmDialog(process, confirmMessage, toastText);
                photoInputForm.reset();
            }
        })
    });
}

async function updateProfilePhoto(photo, user) {
    toastMessage("Uploading your photo...");
    await uploadProfilePhoto(user, photo);
    const imageURL = await fetchProfilePhoto(user);
    await updateProfile(user, {
        photoURL: imageURL
    });
    profilePhoto.src = imageURL;
}

export function displayProfile(user, userData) {
    if (userData && !userData.newUser) {
        email.textContent = user.email;
        profileButton.textContent = user.displayName;
        profileHeader.textContent = user.displayName;
        user.photoURL? profilePhoto.src = user.photoURL : null;
        fullName.textContent = userData.firstName + " " + userData.middleName + " " + userData.lastName;
    } else {
        profileButton.textContent = user.email;
        email.textContent = user.email;
    }
    user.emailVerified ? verified.textContent = "Verified ✓" : verified.textContent = "Not verified";
    
    const colRef = collection(db, 'users');
    const colQuery = query(colRef,
        where('id', '==', userData.id)
    );

    onSnapshot(colQuery, (querySnapshot) => {
        const data = querySnapshot.docs[0].data();
        const penalties = data.penaltyCount;

        if (penalties > 0 && penalties <= 4) {
            penaltyCount.textContent = "Status: warning";
        } else if (penalties >= 5) {
            penaltyCount.textContent = "Status: blocked";
        } else {
            penaltyCount.textContent = "Status: good";
        }
    });
}