import makeToastNotification, {
    autoResize,
    counter,
    eyeToggle,
    getCurrentOrientation,
} from "../../../static/helper.js";

const bannerInput = $("#motto");

autoResize(bannerInput);

bannerInput.on("input", () => autoResize(bannerInput));

counter("motto", "motto-counter", 200);

$(document).on("click", ".close-button", function () {
    window.history.back();
});

$("#profile-top-controls").append($(`
    <div class="button close-button" id="close-text">Go Back</div>
    <div class="button" id="profile-close-button">Cancel</div>
    <svg class="close-button" id="x-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/></svg>
`))

if (getCurrentOrientation() === "portrait") {
    $("#profile-bottom").prepend($(`<div class="button" id="change-password">Change password</div>`))
    $("#profile-bottom").prepend($(`<div class="button" id="delete-account-toggle">Delete Account</div>`))
} else {
    $("#profile-top-controls").prepend($(`<div class="button" id="change-password">Change password</div>`))
    $("#profile-top-controls").prepend($(`<div class="button" id="delete-account-toggle">Delete Account</div>`))
}

const editButton = $("#edit-button");
const topSave = $("#top-save-button");
const bottomSave = $("#bottom-save-button");
const cancelButton = $("#profile-close-button");
const cameraIcon = $("#camera-icon-container");
const inputCounter = $("#motto-counter");
const profilePictureInput = $("#profile-picture-input");
const usernameInput = $("#username");
const imageInput = $("#profile-picture-input");
const deleteAccountToggle = $("#delete-account-toggle")

editButton.on("click", () => {
    if (getCurrentOrientation() === "portrait") {
        bottomSave.css("display", "block");
    } else {
        topSave.css("display", "block");
    }

    deleteAccountToggle.css("display", "block")
    cancelButton.css("display", "block");
    cameraIcon.css("display", "block");
    inputCounter.css("display", "block");
    bannerInput.removeAttr("readonly");
    bannerInput.css("backgroundColor", "var(--input-background)");
    profilePictureInput.removeAttr("readonly");
    usernameInput.removeAttr("readonly");
    usernameInput.css("backgroundColor", "var(--input-background)");
    imageInput.css("display", "block");
    editButton.css("display", "none")
});

cancelButton.on("click", () => {
    if (getCurrentOrientation() === "portrait") {
        bottomSave.css("display", "none");
    } else {
        topSave.css("display", "none");
    }

    deleteAccountToggle.css("display", "none")
    cancelButton.css("display", "none");
    editButton.css("display", "block");
    cameraIcon.css("display", "none");
    inputCounter.css("display", "none");
    bannerInput.attr("readonly", "readonly");
    profilePictureInput.attr("readonly", "readonly");
    usernameInput.attr("readonly", "readonly");
    imageInput.css("display", "none");
    bannerInput.css("backgroundColor", "inherit");
    usernameInput.css("backgroundColor", "inherit");
});

const changePasswordToggle = $("#change-password");

// new password
const newPasswordCancel = $("#new-password-close-button");
const newPasswordForm = $("#new-password-modal");

changePasswordToggle.on("click", () => {
    $("#form-background").addClass("active")
    newPasswordForm.addClass("active");
});

newPasswordCancel.on("click", () => {
    $("#form-background").removeClass("active")
    newPasswordForm.removeClass("active");
});

eyeToggle(
    $("#verify-eyes-icon-container"),
    $("#old-password-input"),
    $("#verify-eye"),
    $("#verify-eye-off")
);

eyeToggle(
    $("#new-password-eyes-icon-container"),
    $("#new-password-input"),
    $("#new-password-eye"),
    $("#new-password-eye-off")
);

eyeToggle(
    $("#delete-verify-eyes-icon-container"),
    $("#delete-account-password-input"),
    $("#delete-verify-eye"),
    $("#delete-verify-eye-off")
);

$("#new-password-update-button").click(function (e) {
    e.preventDefault();

    var oldPassword = $("#old-password-input").val();
    var newPassword = $("#new-password-input").val();

    $.ajax({
        url: "/change-password",
        type: "POST",
        data: {
            oldPassword: oldPassword,
            newPassword: newPassword,
        },
        success: function (response) {
            if (response.status === "success") {
                makeToastNotification(response.message);
                newPasswordForm.removeClass("active");
                $("#form-background").removeClass("active")
            } else {
                makeToastNotification(response.message);
            }
        }.bind(this),
    });
});

deleteAccountToggle.click(function (e) {
    $("#form-background").addClass("active")
    $("#delete-account-form").addClass("active")
})

$("#delete-account-cancel").click(function (e) {
    $("#form-background").removeClass("active")
    $("#delete-account-form").removeClass("active") 
})

$("#delete-account-form").submit(function (e) {
    e.preventDefault(); // Prevent default form submission

    var formData = $(this).serialize();

    $.ajax({
        type: "POST",
        url: "/profile/delete",
        data: formData,
        success: function (response) {
            
            if (response.status === "error") {
                makeToastNotification(response.message)
                $(this).find("#delete-account-password-input").text("")
            } else {
                window.location.href = response.url
            }

        }.bind(this),
        error: function (error) {
            // Handle the error case
            console.log(error);
        },
    });
});