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
        $(this).text() === ""
            ? $(this).remove()
            : $(this).toggleClass("active");

        setTimeout(function() {
            $(this).toggleClass("active");
        }, 2000);
    });
});

$(window).on("load", function() {
    const errors = $(".error");

    for (let i = 0; i < errors.length; i++) {
        const error = $(errors[i]);
        error.html(error.text().toString().replace("_", " "));

        setTimeout(function() {
            error.addClass("active");
        }, 100 * i)

        setTimeout(function() {
            error.removeClass("active");

            setTimeout(function() {
                error.remove();
            }, 100);

        }, 1500 * i);
    }
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



