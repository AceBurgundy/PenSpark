import makeToastNotification from "../../../static/helper.js";

const element = (className) => document.querySelector(className);
const elements = (className) => document.querySelectorAll(className);

const setMode = (mode) => {
    if (mode === "Night") {
        element("html").classList.add("night");
    }
    if (mode === "Day") {
        element("html").classList.remove("night");
    }
    
    fetch("/night-mode", {
        method: "POST",
        body: JSON.stringify({ mode : mode }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(response => {
        if (response.status === true) {
            makeToastNotification(mode);
        } else {
            makeToastNotification(response.message);
        }
    })
    .catch(error => {
        console.log(error);
    });
};

window.addEventListener("load", function() {
    const messages = elements(".message");
    
    messages.forEach(message => {
        if (message.textContent === "") {
            message.remove();
        } else {
            message.classList.toggle("active");
            setTimeout(() => {
                message.classList.toggle("active");
            }, 2000);
        }
    });
});

const nightToggle = element("#night-toggle");

if (nightToggle) {
    nightToggle.addEventListener("click", function(e) {
        if (element("html").classList.contains("night")) {
            setMode("Day");
            nightToggle.textContent = "Day";
        } else {
            nightToggle.textContent = "Night";
            setMode("Night");
        }
    });
}

const sunIcon = element("#sun");
const sunOffIcon = element("#sun-off");

if (sunOffIcon) {
    sunOffIcon.addEventListener("click", function() {
        setMode("Night");
        sunOffIcon.style.display = "none";
        sunIcon.style.display = "block";
    });
}

if (sunIcon) {
    sunIcon.addEventListener("click", function() {
        setMode("Day");
        sunIcon.style.display = "none";
        sunOffIcon.style.display = "block";
    });
}

const currentPath = window.location.pathname;

if (currentPath !== '/login' && currentPath !== '/register') {
    fetch("/night-mode", {
        method: "GET"
    })
    .then(response => response.json())
    .then(response => {
        if (response.mode === false) {
            element("html").classList.remove("night");
        }
        if (response.mode === true) {
            element("html").classList.add("night");
        }
    })
    .catch(error => {
        console.log(error);
    });
}
