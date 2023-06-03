import { recoverAccount } from "../firebase/auth-api.js";

const resetLink = document.querySelector("#forgot-password");
const email = document.querySelector("#sign-in-email");

resetLink.addEventListener('click', () => {
    recoverAccount(email.value);
});