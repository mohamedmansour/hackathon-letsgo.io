var isOpened = false;

function fullPicture(image) {
    console.log(image);
    $("#bigPicture").css({'background-image':'url('+image+')'}).addClass("active");
    $("#mapFrame").addClass("sidebar");
    isOpened = true;
}

function logoSize() {
    var offsert = $("#bigSearchBar").offset();
    $("#introLogo").css({height: (offsert.top/3)*2, paddingTop: offsert.top/6});
    if($("#introLogo").hasClass("hidden")) {
        $("#introLogo").removeClass("hidden");
    }
}

$(document).ready(function() {
    logoSize();
});

$(window).resize(function() {
    logoSize();
});

$(document).on("click", "#welcomeScreen", function(e) {
	if (e.target.id === 'welcomeScreen' || e.target.id === 'introLogo') appActivate();
});

$(document).on("click", ".mapImage", function() {
	var item = canvasPhotos[$(this).attr("data-id")];
	//var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_l.jpg";
	fullPicture(item.url_l);
});
