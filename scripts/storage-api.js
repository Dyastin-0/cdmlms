export async function uploadProfilePhoto(user, image) {
    const storageRef = storage.ref(user.email + "/" + user.displayName);
    await storageRef.put(image)
    .catch(error => {
        console.error(error);
    });
}

export async function fetchProfilePhoto(user) {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(user.email + "/" + user.displayName);

    let imageURL = null;
    await imageRef.getDownloadURL()
    .then(url => {
        imageURL = url;
    })
    .catch(error => {
        console.error(error);
    });
    
    return imageURL;
}