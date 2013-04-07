function appActivate() {
    $("header").addClass("active");
    $("#welcomeScreen").fadeOut(800);
    $("#theApp").removeClass("obscured");
}

function fullPicture(image) {
    $("#bigPicture").addClass("active");
    $("#mapFrame").addClass("sidebar");
}

