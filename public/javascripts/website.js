var isOpened = false, urlState = {q:null,from:null,wp:[],pids:[],dpid:null};

function fullPicture(image) {
    $("#bigPicture").css({'background-image':'url('+image+')'}).addClass("active");
    $("#mapFrame").addClass("sidebar");
    
	if (!isOpened) _gaq.push(['_trackEvent', 'Photo', 'OpenedFullPictureViewer', image]);
	isOpened = true;
}

function smallPicture() {
    $("#bigPicture").removeClass("active");
    $("#mapFrame").removeClass("sidebar");
    if (isOpened) _gaq.push(['_trackEvent', 'Photo', 'ClosedFullPictureViewer']);
	isOpened = false;
}

// function hugePicture() {
//     if(alreadyBig = True){
//         $("header").removeClass("active");
//         $("#mapFrame").addClass("imageFullScreen");
//         $("#bigPicture").addClass("imageFullScreen");
//         alreadyBig = true;
//     }
//     else {
//         $("header").addClass("active");
//         $("#mapFrame").removeClass("imageFullScreen");
//         $("#bigPicture").removeClass("imageFullScreen");
//         alreadyBig = false;
//     }
    
// }


function getLink() {
	var link = document.location.origin, parameterArray = [];
	
	$.each(urlState, function(parameter, value) {
		if (value && value.toString().length > 0) {
			parameterArray.push(parameter + "=" + encodeURIComponent(value)); // encodeURIComponent converts an array from [1,2,3] to "1,2,3" then encodes the commas.
		}
	});
	
	if (parameterArray.length > 0) { link += '?' + parameterArray.join('&'); }
	
	link = link.split('%20').join('+');
	link = link.split('%2C').join(',');
	
	return link;
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

// $(document).on("click", "#bigPicture", function() {
//     alert("MERP!");
//     window.open("http://flickr.com/photos/" + canvasPhotos['2588515847'].owner + "/" + canvasPhotos['2588515847'].id, "_blank");
// })

$(document).on("touchstart", ".mapImage", function() {
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

// if (document.body.style.filter !== undefined) {
//     console.log("YES");
// }
// else {
//     console.log("NO");
// }



