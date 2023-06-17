import { eyeToggle } from "/static/helper.js";

const toLogin = document.querySelector("#to-login");

eyeToggle(
    document.getElementById("regpassword-icon-container"),
    document.getElementById("regpassword"),
    document.getElementById("regeye"),
    document.getElementById("reg-eye-off")
)

toLogin.addEventListener("click", () => {
    window.location = "/login"
})

document.querySelector("#form-register").addEventListener(("keyup"), () => {

    let form = document.getElementById('form-register');
    const userName = document.getElementById('username').value;
    const regPassword = document.getElementById('regpassword');
    const email = document.getElementById('register-email').value;
    const pattern = /(where)|(select)|(update)|(delete)|(.schema)|(from)|(drop)|[0-9]|[!@#$%^&*()_+}{":?></*+[;'./,]|-/gi;
    /* Dot Icons */
    const userNameCircle = document.getElementById('first-name-circle');

    const emailCircle = document.getElementById('email-circle');

    validations = [
        (userName.length > 2 ? userNameCircle.style.fill = "green" : userNameCircle.style.fill = "red"),
        (userName.length < 30 ? userNameCircle.style.fill = "green" : userNameCircle.style.fill = "red"),
        (userName.match(pattern) || userName.trim() === "" ? userNameCircle.style.fill = "red" : userNameCircle.style.fill = "green"),
        (email.match(/[@]/) && email.match(".com") ? emailCircle.style.fill = "green" : emailCircle.style.fill = "red"),
        (regPassword.value.match(/(where)|(select)|(update)|(delete)|(.schema)|(from)|(drop)|-/gi) ? regPassword.style.color = "red" : regPassword.style.color = "green")
    ]

    form.addEventListener('submit', (Event) => {
        if (validations.includes('red')) {
            Event.preventDefault();
        } else {
            return true;
        }
    })
})