function appActivate() {
    $("header").addClass("active");
    $("#welcomeScreen").fadeOut(800);
    $("#theApp").removeClass("obscured");
}

function fullPicture(image) {
    $("#bigPicture").addClass("active");
    $("#mapFrame").addClass("sidebar");
}

function logoSize() {
    var offsert = $("#bigSearchBar").offset();
    $("#introLogo").css({height: (offsert.top/3)*2, paddingTop: offsert.top/6});
}

$(document).ready(function() {
    logoSize();
})

$(window).resize(function() {
    logoSize();
})