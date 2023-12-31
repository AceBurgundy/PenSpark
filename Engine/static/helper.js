/**
 * Replace the default querySelector
*/
const element = (className) => document.querySelector(className);

/**
 * Adds a character counter to an input field and updates a corresponding counter element.
 * @param {string} inputId - The id of the input field.
 * @param {string} counterId - The id of the counter element.
 * @param {number|null} restriction - The character limit (null for no limit).
 */
export const counter = (inputId, counterId, restriction) => {
    const inputElement = element(`#${inputId}`);
    const counterElement = element(`#${counterId}`);

    inputElement.addEventListener("input", () => {
        if (restriction === null) {
            counterElement.children[0].textContent = inputElement.value.length;
        } else if (inputElement.value.length <= restriction) {
            counterElement.children[0].textContent = inputElement.value.length;
        }
    });

    window.addEventListener("load", () => {
        counterElement.children[0].textContent = inputElement.value.length;
    });
};

/**
 * Toggles the visibility of eye icons in a form.
 * @param {string} eyesContainerId - The id of the container for eye icons.
 * @param {string} inputId - The id of the input field.
 * @param {string} eyeId - The id of the eye icon (open).
 * @param {string} eyeSlashId - The id of the eye icon (close).
 */
export const eyeToggle = (eyesContainerId, inputId, eyeId, eyeSlashId) => {
    eyesContainerId.addEventListener("click", () => {
        if (inputId.getAttribute("type") === "text") {
            inputId.setAttribute("type", "password");
            eyeId.style.display = "none";
            eyeSlashId.style.display = "block";
        } else {
            inputId.setAttribute("type", "text");
            eyeId.style.display = "block";
            eyeSlashId.style.display = "none";
        }
    });
};

/**
 * Creates a toast notification element and appends it to the flashes container.
 * @param {string} message - The message content of the notification.
 */
export default function makeToastNotification(message) {
    const flashes = element(".flashes");

    if (message === "") return;

    const newToast = document.createElement("li");
    newToast.classList.add("message");
    newToast.textContent = message;
    flashes.append(newToast);
    newToast.classList.toggle("active");

    setTimeout(() => {
        newToast.classList.remove("active");
        setTimeout(() => {
            newToast.remove();
        }, 500);
    }, 2000);
}

/**
 * Automatically resizes a textarea element to fit its content.
 */
export const autoResize = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
};

/**
 * Adds an onClick event to blog-post__button--like responsible for liking and unliking a post.
 */
export const handleLikeButton = () => {

    document.onclick = (event) => {

        if (event.target.classList.contains("blog-post__button--like")) {

            let postId = event.target.getAttribute("data-post-id")

            fetch(`/blogs/${postId}/like`, {
                method: "POST",
            })
            .then((response) => response.json())
            .then((response) => {

                if (response.status === "success") {

                    makeToastNotification(response.message);

                    let likeCountElement = event.target.previousElementSibling

                    let likeCount = parseInt(likeCountElement.textContent);

                    if (response.message === "liked") {
                        likeCount++;
                        event.target.innerHTML = `<svg id="thumbs-up-filled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M448 910 c-22 -14 -257 -335 -274 -377 -9 -21 -14 -75 -14 -158 0 -168 20 -217 105 -256 35 -16 68 -19 258 -19 175 0 224 3 247 15 36 19 52 47 48 84 -1 17 6 38 21 56 17 23 21 37 16 60 -8 40 -8 64 0 98 6 21 2 36 -14 57 -12 16 -21 44 -21 63 0 23 -8 41 -26 58 -24 23 -34 24 -169 29 l-143 5 38 90 c48 110 49 137 11 176 -31 30 -54 35 -83 19z"/> </g> </svg>`
                    } else {
                        likeCount--;
                        event.target.innerHTML = `<svg id="thumbs-up-unfilled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M448 910 c-22 -14 -257 -335 -274 -377 -9 -21 -14 -75 -14 -158 0 -168 20 -217 105 -256 35 -16 68 -19 258 -19 175 0 224 3 247 15 36 18 52 47 48 84 -1 17 6 36 21 52 18 19 21 31 16 59 -7 44 -7 66 0 110 5 28 2 39 -14 54 -14 13 -21 31 -21 56 0 26 -7 43 -26 61 -24 22 -34 24 -169 29 l-143 5 39 90 c47 110 49 137 10 176 -31 30 -54 35 -83 19z m66 -61 c7 -20 -1 -47 -39 -137 -25 -61 -44 -116 -40 -122 4 -6 65 -10 159 -10 177 0 193 -5 183 -63 -5 -30 -2 -38 19 -52 30 -19 31 -44 3 -79 l-21 -27 21 -20 c28 -26 27 -45 -5 -74 -21 -20 -25 -29 -19 -55 5 -23 2 -37 -11 -51 -16 -18 -32 -19 -233 -19 -242 0 -266 5 -308 69 -21 31 -23 46 -23 157 0 67 5 135 10 150 11 27 159 237 227 322 39 48 63 51 77 11z"/> </g> </svg>`
                    }

                    likeCountElement.textContent = `${likeCount} ${likeCount > 1 ? "Likes" : "Like"}`;

                } else {
                    makeToastNotification(response.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    };
};

export const getCurrentOrientation = () => {

    if (window.matchMedia("(orientation: portrait)").matches) {
        return "portrait";
    } else {
        return "landscape";
    }
    
}