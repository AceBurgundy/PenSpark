import makeToastNotification from "../../../static/helper.js";

function setMode(mode) {

    if (mode === "Night") {
        $("html").addClass("night");
    }
    if (mode === "Day") {
        $("html").removeClass("night");
    }
    
    $.ajax({
        url: "/night-mode",
        type: "POST",
        data: { mode: mode },
        success: function (response) {
            if (response.status === true) {
                makeToastNotification(mode)
            } else {
                makeToastNotification(response.message);
            }
        }.bind(this),
        error: function (xhr, status, error) {
            // Handle error
            console.log(error);
        },
    });
}

$(window).on("load", function() {
    $(".message").each(function() {
        const message = $(this);
        message.text() === ""
            ? message.remove()
            : message.toggleClass("active");

        setTimeout(function() {
            message.toggleClass("active");
        }, 2000);
    });
});

$(window).on("load", function() {
    $(".error").each(function() {
        const error = $(this);
        error.html(error.text().toString().replace("_", " "));
        error.toggleClass("active");

        setTimeout(function() {
            error.removeClass("active");
        }, 3000);
    });
});

$(".error").each(function() {
    const error = $(this);
    error.css("visibility", "visible");
    error.css("opacity", 1);

    setTimeout(function() {
        error.css("opacity", 0);
        error.css("visibility", "hidden");
    }, 1000);
});

const nightToggle = $("#night-toggle");

nightToggle.on("click", function(e) {
    if ($("html").hasClass("night")) {
        setMode("Day")
        nightToggle.text("Day");
    } else {
        nightToggle.text("Night");
        setMode("Night")
    }
});

const sunIcon = $("#sun");
const sunOffIcon = $("#sun-off");

sunOffIcon.on("click", function() {
    setMode("Night")
    sunOffIcon.css("display", "none");
    sunIcon.css("display", "block");
});

sunIcon.on("click", function() {
    setMode("Day")
    sunIcon.css("display", "none");
    sunOffIcon.css("display", "block");
});

const currentPath = window.location.pathname;

if (currentPath !== '/login' && currentPath !== '/register') {
    $.ajax({
        url: "/night-mode",
        type: "GET",
        success: function (response) {
            
            if (response.mode === false) {
                $("html").removeClass("night");
            }
    
            if (response.mode === true) {
                $("html").addClass("night");
            }
    
        }.bind(this)
    })
}



