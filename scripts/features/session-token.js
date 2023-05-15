export async function sessionTokenCheck() {
    auth.onAuthStateChanged(user => {
        if (user) {
            user.getIdTokenResult()
            .then(async (IdTokenResult) => {
                const expiration = Date.parse(IdTokenResult.expirationTime);
                const dateNow = new Date().getTime();
                if (dateNow > expiration) {
                    await signOutFirebaseAuth();
                    window.location.href = './';
                }
            });
        } else {
            window.location.href = './';
        }
    });
}