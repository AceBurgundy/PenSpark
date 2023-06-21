import makeToastNotification, { handleLikeButton } from "../../../static/helper.js";

const element = (className) => document.querySelector(className);

document.addEventListener("DOMContentLoaded", () => {

    handleLikeButton();

    const commentInput = element("#add-comment-box__right-input");
    const commentButtons = element("#add-comment-box__right-bottom");
    const cancelCommentButton = element("#cancel-comment");
    
    commentInput.addEventListener("click", () => {
        commentButtons.style.display = "flex";
    });

    cancelCommentButton.addEventListener("click", () => {
        commentButtons.style.display = "none";
    });

    const formBackground = element("#form-background");
    const deletePrompt = element("#delete-prompt");
    const deletePromptCancel = element("#delete-prompt__buttons__cancel");
    const deletePromptToggle = element("#delete-button-prompt");

    if (deletePromptToggle) {
        deletePromptToggle.addEventListener("click", () => {
            formBackground.classList.add("active");
            deletePrompt.classList.add("active");
        });
    }

    if (deletePromptCancel) {
        deletePromptCancel.addEventListener("click", () => {
            formBackground.classList.remove("active");
            deletePrompt.classList.remove("active");
        });
    }

    const loadComments = () => {
        const blogId = element("#blog_id").value;

        fetch("/blog/" + blogId + "/comments")
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const comments = data.comments;
                    const current_username = data.current_user_username;
                    const commentsList = element("#comments-list");

                    if (commentsList.innerHTML !== "") {
                        commentsList.innerHTML = "";
                    }

                    if (comments.length > 0) {
                        comments.forEach(comment => {
                            const commentHtml = `
                                <div class="comment-box">
                                <a href="/profile/${comment.user_id}">
                                    <img class="comment-box__profile" src="${comment.profile_picture}" alt="${comment.username}">
                                </a>
                                <div class="comment-box__right">
                                    <h3 class="comment-box__author">${comment.username}</h3>
                                    <p class="comment-box__text">${comment.comment}</p>
                                </div>
                                ${
                                    current_username === comment.username
                                        ? `<button class="comment-box__delete" data-comment-id="${comment.id}">
                                        <p>Delete</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18ZM20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Zm-3-1a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"></path>
                                        </svg>
                                        </button>`
                                        : ""
                                }
                                </div>
                            `;
                            commentsList.innerHTML += commentHtml;
                        });

                    } else {
                        commentsList.innerHTML += "<p id='no_comment-yet-text'>No Comments Yet</p>";
                    }
                } else {
                    console.log("Error: " + data.message);
                }
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    }

    element("#add-comment").addEventListener("click", (event) => {

        event.preventDefault();

        const blogId = element("#add-comment").dataset.blogId;
        const text = element("#add-comment-box__right-input").value;

        if (text === "") {
            makeToastNotification("Cannot be empty");
            return;
        }

        fetch("/blogs/" + blogId + "/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: text })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    makeToastNotification(data.message);
                    element("#add-comment-box__right-input").value = "";

                    const commentData = data.comment;
                    const commentHtml = `
                        <div class="comment-box">
                            <a class="comment-box__author_profile" href="profile/${commentData.user_id}">
                                <img class="comment-box__profile" src="${commentData.profile_picture}" alt="${commentData.username}">
                            </a>
                            <div class="comment-box__right">
                                <h3 class="comment-box__author">${commentData.username}</h3>
                                <p class="comment-box__text">${commentData.comment}</p>
                            </div>
                            <button class="comment-box__delete" data-comment-id="${commentData.id}">
                                <p>Delete</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18ZM20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Zm-3-1a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"></path>
                                </svg>
                            </button>
                        </div>
                    `;
                    element("#comments-list").innerHTML += commentHtml;

                    const noCommentsText = element("#no_comment-yet-text");
                    if (noCommentsText) {
                        noCommentsText.remove();
                    }

                } else {
                    makeToastNotification(data.message);
                }
            })
            .catch(error => {
                console.error(error);
            });
    });

    document.onclick = (event) => {

        if (event.target.className === "comment-box__delete") {
            const commentId = event.target.getAttribute("data-comment-id");

            if (!commentId) {
                makeToastNotification("Comment not found");
                return;
            }

            fetch("/blog/comments/" + commentId, {
                method: "POST"
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    makeToastNotification(data.message);
                    event.target.parentElement.remove();
                } else {
                    makeToastNotification(data.message);
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    loadComments();

});
