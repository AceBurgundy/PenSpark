import makeToastNotification, { handleLikeButton } from "../../../static/helper.js";

$(document).ready(function () {

    handleLikeButton();

    const commentInput = $("#add-comment-box__right-input");
    const commentButtons = $("#add-comment-box__right-bottom");
    const cancelCommentButton = $("#cancel-comment");

    commentInput.click(function () {
        commentButtons.css("display", "flex");
    });

    cancelCommentButton.click(function () {
        commentButtons.css("display", "none");
    });

    const formBackground = $("#form-background");
    const deletePrompt = $("#delete-prompt");
    const deletePromptCancel = $("#delete-prompt__buttons__cancel");
    const deletePromptToggle = $("#delete-button-prompt");

    if (deletePromptToggle.length) {
        deletePromptToggle.click(function () {
            formBackground.addClass("active");
            deletePrompt.addClass("active");
        });
    }

    if (deletePromptCancel.length) {
        deletePromptCancel.click(function () {
            formBackground.removeClass("active");
            deletePrompt.removeClass("active");
        });
    }

    function loadComments() {
        const blogId = $("#blog_id").val();

        $.ajax({
            url: "/blog/" + blogId + "/comments",
            type: "GET",
            success: function (response) {

                if (response.status === "success") {

                    if ($("#comments-list").html() !== "") {
                        $("#comments-list").empty();
                    }

                    const comments = response.comments;
                    const current_username = response.current_user_username;

                    if (comments.length > 0) {

                        comments.forEach(function (comment) {

                            const commentHtml = `
                                <div class="comment-box">
                                <a href="/profile/${comment.user_id}">
                                    <img class="comment-box__profile" src="${
                                        comment.profile_picture
                                    }" alt="${comment.username}">
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
                            $("#comments-list").append(commentHtml);
                        });

                    } else {
                        $("#comments-list").append("<p>No Comments Yet</p>");
                    }
                } else {
                    console.log("Error: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            },
        });
    }

    $("#add-comment").click(function (event) {

        event.preventDefault();

        const blogId = $(this).data("blog-id");
        const text = $("#add-comment-box__right-input").val();

        if (text === "") {
            makeToastNotification("Cannot be empty");
            return;
        }

        $.ajax({
            url: "/blogs/" + blogId + "/comments",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ text: text }),
            success: function (response) {

                if (response.status === "success") {

                    makeToastNotification(response.message);

                    $("#add-comment-box__right-input").val("");

                    const commentData = response.comment;
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
                    $("#comments-list").append(commentHtml);

                    $("p:contains('No Comments Yet')").remove();

                } else {
                    makeToastNotification(response.message);
                }
            },
            error: function (error) {
                console.error(error);
            },
        });
    });

    $(document).on("click", ".comment-box__delete", function () {

        const commentId = $(this).data("comment-id");

        if (!commentId) {
            makeToastNotification("Comment Id not found");
            return;
        }

        $.ajax({
            url: "/blog/comments/" + commentId,
            type: "POST",
            success: function (response) {

                if (response.status === "success") {
                    makeToastNotification(response.message);
                    $(this).closest(".comment-box").remove();
                } else {
                    makeToastNotification(response.message);
                }

            }.bind(this),
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
            },
        });

    });

    // $("#delete-prompt__buttons__delete").click(function () {
    //     const actionUrl = $("#delete-prompt [data-action]").data("action");

    //     $.ajax({
    //         url: actionUrl,
    //         type: "POST",
    //         success: function (response) {
                
    //             if (response.status === "error") {
    //                 makeToastNotification("Cannot find blog");
    //             } else {
    //                 window.location.href = response.url
    //             }

    //         },
    //         error: function (xhr, status, error) {
    //             // Handle error response here
    //             console.log("Error deleting blog:", error);
    //         },
    //     });
    // });
      
    loadComments();

});
