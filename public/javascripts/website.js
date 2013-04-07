var isOpened = false;

function fullPicture(image) {
    $("#bigPicture").css({'background-image':'url('+image+')'}).addClass("active");
    $("#mapFrame").addClass("sidebar");
    isOpened = true;
}

function smallPicture() {
    $("#bigPicture").removeClass("active");
    $("#mapFrame").removeClass("sidebar");
    isOpened = false;
}

function hugePicture() {

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

$(document).on("keyup", function(e) {
	if (e.keyCode === 27) smallPicture();
});


//Check CSS3 Filters
//From http://stackoverflow.com/questions/11047206/how-can-i-feature-detect-css-filters

// function css3FilterFeatureDetect(enableWebkit) {
//     if(enableWebkit === undefined) {
//         enableWebkit = false;
//     }
//     el = document.createElement('div');
//     el.style.cssText = (enableWebkit)?'-webkit-':'' + 'filter: blur(2px)';
//     test1 = (el.style.length != 0);
//     test2 = (
//         document.documentMode === undefined
//         || document.documentMode > 9
//     );
//     return test1 && test2;
// }

// alert(css3FilterFeatureDetect());

if (document.body.style.filter !== undefined) {
    console.log("YES");
}
else {
    console.log("NO");
}



