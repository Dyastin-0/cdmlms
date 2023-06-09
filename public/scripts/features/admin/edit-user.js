import { updateQuery } from "../../firebase/firestore-api.js";
import { isIdValid } from "../../utils/validation.js";
import { toastMessage } from "../../utils/toast-message.js"; 

const editUserForm = document.querySelector("#edit-user-form");
const id = editUserForm.querySelector("#edit-user-id");
const role = editUserForm.querySelector("#edit-user-role");

export async function updateUser(userRef) {
    if (!isIdValid(id.value)) {
        toastMessage("Invalid ID format.");
        return;
    }
    const isAdmin = role.textContent === "Admin" ? true : false;
    const changes = {
        id: id.textContent, 
        isAdmin: isAdmin
    };
    updateQuery(userRef, changes);
}