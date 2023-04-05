export async function createUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
    .then((credentials) => {
        console.log(credentials)
    });
}

export async function logInFirebaseAuth(email, password) {
    await auth.signInWithEmailAndPassword(email, password)
    .then((credentials) => {
        console.log(credentials)
    });
}