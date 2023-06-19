import { eyeToggle } from "/static/helper.js";

const toLogin = document.querySelector("#to-login");

eyeToggle(
    document.getElementById("regpassword-icon-container"),
    document.getElementById("regpassword"),
    document.getElementById("regeye"),
    document.getElementById("reg-eye-off")
);

toLogin.addEventListener("click", () => {
    window.location = "/login";
});

document.querySelector("#form-register").addEventListener("keyup", () => {
    let form = document.getElementById("form-register");
    const userName = document.getElementById("username").value;
    const regPassword = document.getElementById("regpassword");
    const email = document.getElementById("register-email").value;
    const pattern =
        /(where)|(select)|(update)|(delete)|(.schema)|(from)|(drop)|[0-9]|[!@#$%^&*()_+}{":?></*+[;'./,]|-/gi;
    /* Dot Icons */
    const userNameCircle = document.getElementById("first-name-circle");
    const emailCircle = document.getElementById("email-circle");

    const errorMessages = [
        "Username must have at least 3 characters.",
        "Username must have at most 30 characters.",
        "Username contains invalid characters.",
        "Invalid email format.",
        "Password contains restricted words or characters.",
        "Password must contain at least one number and one symbol.",
    ];

    let validations = [
        userName.length > 2
            ? (userNameCircle.style.fill = "green")
            : (userNameCircle.style.fill = "red"),
        userName.length < 30
            ? (userNameCircle.style.fill = "green")
            : (userNameCircle.style.fill = "red"),
        userName.match(pattern) || userName.trim() === ""
            ? (userNameCircle.style.fill = "red")
            : (userNameCircle.style.fill = "green"),
        email.match(/[@]/) && email.match(".com")
            ? (emailCircle.style.fill = "green")
            : (emailCircle.style.fill = "red"),
        regPassword.value.match(
            /(where)|(select)|(update)|(delete)|(.schema)|(from)|(drop)|-/gi
        )
            ? (regPassword.style.color = "red")
            : (regPassword.style.color = "green"),
        regPassword.value.match(/[0-9]/) &&
        regPassword.value.match(/[!@#$%^&*()_+}{":?></*+[;'./,]/)
            ? (regPassword.style.color = "green")
            : (regPassword.style.color = "red"),
    ];

    validations.forEach((validation, index) => {
        if (validation === false) {
            makeToastNotification(errorMessages[index]);
        }
    });

    form.addEventListener("submit", (event) => {
        if (validations.includes(false)) {
            event.preventDefault();
        } else {
            return true;
        }
    });
});
