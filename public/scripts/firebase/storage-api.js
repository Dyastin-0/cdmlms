import { storage } from "./firebase.js";
import { ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

export async function uploadProfilePhoto(user, image) {
    const storageRef = ref(storage, user.email + "/" + user.displayName);
    await uploadBytes(storageRef, image)
    .catch(error => {
        console.error(error);
    });
}

export async function fetchProfilePhoto(user) {
    const imageRef = ref(storage, user.email + "/" + user.displayName);

    let imageURL = null;
    await getDownloadURL(imageRef)
    .then(url => {
        imageURL = url;
    })
    .catch(error => {
        console.error(error);
    });
    
    return imageURL;
}