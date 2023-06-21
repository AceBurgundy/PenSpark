import makeToastNotification, {
    handleLikeButton,
    counter,
} from "../../../static/helper.js";

const element = (className) => document.querySelector(className);

counter("create-blog__body", "motto-counter", 3000);

const formBackground = element("#form-background");
const form = element("#create-blog");
const formXButton = element("#create-blog__close-box");
const toggleForm = element("#blog-buttons__create-button");

toggleForm.addEventListener("click", () => {
    formBackground.classList.add("active");
    form.classList.add("active");
});

formXButton.addEventListener("click", () => {
    formBackground.classList.remove("active");
    form.classList.remove("active");
});

// Get the current time
const currentTime = new Date();

// add blog form submission
form.addEventListener("submit", (event) => {

    event.preventDefault();

    const time = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${currentTime.getMilliseconds()}`
    
    const csrfInput = element("#csrf_token");
    const titleInput = element("#create-blog__title");
    const bodyInput = element("#create-blog__body");
    const imageInput = element("#create-blog__bottom-image");


    if (titleInput.value === "" || bodyInput.value === "") {
        makeToastNotification("Fields Cannot be empty");
        return;
    }

    if (bodyInput.value.length > 750) {
        makeToastNotification("Content cannot be greater than 750");
        return;
    }

    if (titleInput.value.length > 100) {
        makeToastNotification("Title cannot be greater than 100");
        return;
    }

    // Check if the selected file is an image
    const file = imageInput.files[0];
    if (file && !file.type.startsWith("image/")) {
        makeToastNotification("Not an image");
        return;
    }
 
    if (imageInput.files[0].size/1024 > 15000.0000) {
        makeToastNotification("Image must be less than 15mb");
        return;
    }

    const formData = new FormData();
    formData.append("csrf_token", csrfInput.value);
    formData.append("title", titleInput.value);
    formData.append("body", bodyInput.value);
    formData.append("image", file);
    formData.append("time", time)

    titleInput.value = "";
    bodyInput.value = "";
    imageInput.value = "";

    fetch("/blogs", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.status === "success") {
                makeToastNotification(response.message);
                fetchBlogPosts();
            } else {
                if (response.message.length > 1) {
                    makeToastNotification(response.message);
                } else {
                    makeToastNotification(response.message);
                }
            }
        })
        .catch((error) => {
            // Handle error
            console.log(error);
        });
});

let posts = []; // Empty list to store post IDs

function fetchBlogPosts() {
    fetch("/blogs")
        .then((response) => response.json())
        .then((response) => {
            if (response.length > 0) {
                if (element("#recent_blogs-text") === null) {
                    const heading = document.createElement("h1");
                    heading.setAttribute("id", "recent_blogs-text")
                    heading.textContent = "Recent Blogs";
                    element("#blog-posts").insertAdjacentElement("afterbegin", heading);
                }

                response.forEach((post) => {
                    if (!posts.includes(post.id)) {
                        posts.push(post.id);

                        let like = post.likes;

                        // Create HTML template literal
                        const template = `
                            <div class="blog-post" data-post-id="${post.id}">
                                <a class="blog-post__data" href="/blog/${post.id}">
                                    <p class="blog-details">Blog by ${post.author} on ${post.date_authored} ${post.time_authored}</p>
                                    <h2 class="blog-post__title">${post.title}</h2>
                                    <p class="blog-content">${post.content}</p>
                                </a>
                                <div class="blog-post__buttons">
                                    <div class="blog-post__buttons-like">
                                        <p class="likes">${like} ${like > 1 ? "Likes" : "Like"}</p>
                                        <button class="blog-post__button blog-post__button--like" data-post-id="${post.id}">
                                            ${
                                                post.liked_by_user
                                                    ? `<svg id="thumbs-up-filled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M448 910 c-22 -14 -257 -335 -274 -377 -9 -21 -14 -75 -14 -158 0 -168 20 -217 105 -256 35 -16 68 -19 258 -19 175 0 224 3 247 15 36 19 52 47 48 84 -1 17 6 38 21 56 17 23 21 37 16 60 -8 40 -8 64 0 98 6 21 2 36 -14 57 -12 16 -21 44 -21 63 0 23 -8 41 -26 58 -24 23 -34 24 -169 29 l-143 5 38 90 c48 110 49 137 11 176 -31 30 -54 35 -83 19z"/> </g> </svg>`
                                                    : `<svg id="thumbs-up-unfilled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M448 910 c-22 -14 -257 -335 -274 -377 -9 -21 -14 -75 -14 -158 0 -168 20 -217 105 -256 35 -16 68 -19 258 -19 175 0 224 3 247 15 36 18 52 47 48 84 -1 17 6 36 21 52 18 19 21 31 16 59 -7 44 -7 66 0 110 5 28 2 39 -14 54 -14 13 -21 31 -21 56 0 26 -7 43 -26 61 -24 22 -34 24 -169 29 l-143 5 39 90 c47 110 49 137 10 176 -31 30 -54 35 -83 19z m66 -61 c7 -20 -1 -47 -39 -137 -25 -61 -44 -116 -40 -122 4 -6 65 -10 159 -10 177 0 193 -5 183 -63 -5 -30 -2 -38 19 -52 30 -19 31 -44 3 -79 l-21 -27 21 -20 c28 -26 27 -45 -5 -74 -21 -20 -25 -29 -19 -55 5 -23 2 -37 -11 -51 -16 -18 -32 -19 -233 -19 -242 0 -266 5 -308 69 -21 31 -23 46 -23 157 0 67 5 135 10 150 11 27 159 237 227 322 39 48 63 51 77 11z"/> </g> </svg>`
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;

                        element("#no_blogs-yet-text") &&
                            element("#no_blogs-yet-text").remove();

                        // Append the template after the 'blog-posts' first element child
                        element("#blog-posts").children[0].insertAdjacentHTML("afterend", template);
                        formBackground.classList.remove("active");
                        form.classList.remove("active");
                    }
                });
            } else {
                const template = `<p id="no_blogs-yet-text">No blogs yet</p>`;
                element("#blog-posts").innerHTML = template
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

element("#create-blog__submit").addEventListener("click", () => {
    makeToastNotification("Adding Blog");
});

fetchBlogPosts();
handleLikeButton();
