import makeToastNotification, {
    getCurrentOrientation,
    handleLikeButton,
} from "../../../static/helper.js";

$(document).ready(function () {
    
    const formBackground = $("#form-background");
    const form = $("#create-blog");
    const formXButton = $("#create-blog__close-box");
    const toggleForm = $("#blog-buttons__create-button");

    toggleForm.on("click", function () {
        formBackground.addClass("active");
        form.addClass("active");
    });

    formXButton.on("click", function () {
        formBackground.removeClass("active");
        form.removeClass("active");
    });

    // add blog form submission
    form.on("submit", function (event) {
        event.preventDefault();

        const titleInput = $("#create-blog__title");
        const bodyInput = $("#create-blog__body");
        const imageInput = $("#create-blog__bottom-image");

        if (titleInput.val() === "" || bodyInput.val() === "") {
            makeToastNotification("Fields Cannot be empty");
            return;
        }

        if (titleInput.val().length > 100) {
            makeToastNotification("Title cannot be greater than 100");
            return;
        }

        // Create a FormData object
        var formData = new FormData();
        formData.append("title", titleInput.val());
        formData.append("body", bodyInput.val());
        formData.append("image", imageInput[0].files[0]);

        // Clear the form inputs
        titleInput.val("");
        bodyInput.val("");
        imageInput.val("");

        // Make the AJAX POST request
        $.ajax({
            url: "/blogs",
            type: "POST",
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status === "success") {
                    makeToastNotification(response.message);
                    fetchBlogPosts();
                } else {
                    makeToastNotification(response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle error
                console.log(error);
            },
        });
    });

    handleLikeButton();

    let posts = []; // Empty list to store post IDs

    function fetchBlogPosts() {

        $.ajax({
            url: "/blogs",
            type: "GET",
            data: { post_ids: posts },
            success: function (response) {

                if (response.length > 0) {

                    if ($(':contains("Recent Blogs")').length === 0) {
                        $("#blog-posts").append("<h1>Recent Blogs</h1>")
                    }
                    
                    response.forEach(function (post) {

                        if (!posts.includes(post.id)) {
                            
                            posts.push(post.id);

                            let like = post.likes;

                            // Create HTML template literal
                            let template = `
                                <div class="blog-post" data-post-id="${post.id}">
                                    <a class="blog-post__data" href="/blog/${post.id}">
                                        <p class="blog-details">Blog by ${post.author} on ${post.date_authored} ${post.time_authored}</p>
                                        <h2 class="blog-post__title">${post.title}</h2>
                                        <p class="blog-content">${post.content}</p>
                                    </a>
                                    <div class="blog-post__buttons">
                                        <div class="blog-post__buttons-like">
                                            <p class="likes">${like} ${like > 1 ? "Likes" : "Like"}</p>
                                            <button class="blog-post__button blog-post__button--like">
                                                ${ post.liked_by_user ? 
                                                        `<svg id="thumbs-up-filled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M448 910 c-22 -14 -257 -335 -274 -377 -9 -21 -14 -75 -14 -158 0 -168 20 -217 105 -256 35 -16 68 -19 258 -19 175 0 224 3 247 15 36 19 52 47 48 84 -1 17 6 38 21 56 17 23 21 37 16 60 -8 40 -8 64 0 98 6 21 2 36 -14 57 -12 16 -21 44 -21 63 0 23 -8 41 -26 58 -24 23 -34 24 -169 29 l-143 5 38 90 c48 110 49 137 11 176 -31 30 -54 35 -83 19z"/> </g> </svg>`  
                                                    :
                                                        `<svg id="thumbs-up-unfilled" version="1.0" xmlns="http://www.w3.org/2000/svg" width="100.000000pt" height="100.000000pt" viewBox="0 0 100.000000 100.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M448 910 c-22 -14 -257 -335 -274 -377 -9 -21 -14 -75 -14 -158 0 -168 20 -217 105 -256 35 -16 68 -19 258 -19 175 0 224 3 247 15 36 18 52 47 48 84 -1 17 6 36 21 52 18 19 21 31 16 59 -7 44 -7 66 0 110 5 28 2 39 -14 54 -14 13 -21 31 -21 56 0 26 -7 43 -26 61 -24 22 -34 24 -169 29 l-143 5 39 90 c47 110 49 137 10 176 -31 30 -54 35 -83 19z m66 -61 c7 -20 -1 -47 -39 -137 -25 -61 -44 -116 -40 -122 4 -6 65 -10 159 -10 177 0 193 -5 183 -63 -5 -30 -2 -38 19 -52 30 -19 31 -44 3 -79 l-21 -27 21 -20 c28 -26 27 -45 -5 -74 -21 -20 -25 -29 -19 -55 5 -23 2 -37 -11 -51 -16 -18 -32 -19 -233 -19 -242 0 -266 5 -308 69 -21 31 -23 46 -23 157 0 67 5 135 10 150 11 27 159 237 227 322 39 48 63 51 77 11z"/> </g> </svg>`
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;

                            $("p:contains('No blogs yet')").remove();

                            // Append the template after the 'blog-posts' first element child
                            $("#blog-posts").children().eq(0).after(template);
                            formBackground.removeClass("active");
                            form.removeClass("active");
                        }
                    });
                } else {
                    let template = `<p>No blogs yet</p>`;
                    $("#blog-posts").append(template);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    }

    fetchBlogPosts();
});
