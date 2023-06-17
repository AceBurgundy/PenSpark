import makeToastNotification from "../../../static/helper.js";
import { eyeToggle } from "/static/helper.js";

eyeToggle(
    document.getElementById("logpassword-icon-container"),
    document.getElementById("logpassword"),
    document.getElementById("logeye"),
    document.getElementById("log-eye-off")
);

const toRegister = document.querySelector("#to-register");

toRegister.addEventListener("click", () => {
    window.location = "/register"
})

$("#login-button").click(function (e) {
    e.preventDefault();

    const formData = $(".authentication-form").serialize();

    $.ajax({
        type: "POST",
        url: $(".authentication-form").data("route"),
        data: formData,
        success: function (response) {
            if (response.status === "success") {
                if (response.url) {
                    window.location.href = response.url;
                }
            } else {
                if (response.message) {
                    response.message.forEach((message) => {
                        makeToastNotification(message);
                    });
                }
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        },
    });
});
