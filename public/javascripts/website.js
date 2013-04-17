/* START: Modernizr 2.6.2 (Custom Build) | MIT & BSD *
 * Build: http://modernizr.com/download/#-svg */
;window.Modernizr=function(a,b,c){function u(a){i.cssText=a}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function w(a,b){return typeof a===b}function x(a,b){return!!~(""+a).indexOf(b)}function y(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:w(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={svg:"http://www.w3.org/2000/svg"},m={},n={},o={},p=[],q=p.slice,r,s={}.hasOwnProperty,t;!w(s,"undefined")&&!w(s.call,"undefined")?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e}),m.svg=function(){return!!b.createElementNS&&!!b.createElementNS(l.svg,"svg").createSVGRect};for(var z in m)t(m,z)&&(r=z.toLowerCase(),e[r]=m[z](),p.push((e[r]?"":"no-")+r));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)t(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},u(""),h=j=null,e._version=d,e}(this,this.document);
/* END: Modernizr 2.6.2 (Custom Build) */

var isOpened = false,
	urlState = {
		q:null, // To field
		from:null, // From field
		wp:[], // Way points
		pids:[], // Photo IDs in the itinerary 
		dpid:null, // The diplayed photo ID 
		vp:[], // View port [lat, long, lat, long]
		lp:null, // Large photos
		nf:null // No photo fade-in (used for screenshot)
	};

if(!Modernizr.svg) {
	$('img[src*="svg"]').attr('src', function() {
		return $(this).attr('src').replace('.svg', '.png');
	});
}

function fullPicture(item) {
	var image = item.url_l, 
		photoID = item.id;

	$("#bigPicture").css({'background-image':'url('+image+')'}).addClass("active");
	$("#mapFrame").addClass("sidebar");
	$('#credits').html('<a href="http://www.flickr.com/photos/'+item.owner+'/'+item.id+'" target="_blank">'+item.title+'</a> by <a href="http://www.flickr.com/photos/'+item.owner+'" target="_blank">'+item.ownername+'</a>');

	if (!isOpened) { _gaq.push(['_trackEvent', 'Photo', 'OpenedFullPictureViewer', getUrl()]); }
	urlState.dpid = photoID;
	isOpened = true;
}

function smallPicture() {
	$("#bigPicture").removeClass("active");
	$("#mapFrame").removeClass("sidebar");
	if (isOpened) { _gaq.push(['_trackEvent', 'Photo', 'ClosedFullPictureViewer', getUrl()]); }
	urlState.dpid = null;
	isOpened = false;
}

function restoreStateFromUrl() {
	"use strict";
	
	var queryTerms = {}, query, queryParameterSplit, fromLat, fromLong, toLat, toLong;
	
	query = document.location.search;
	urlState = {q:null,from:null,wp:[],pids:[],dpid:null,vp:[],lp:null,nf:null}
	
	if (document.documentElement.clientWidth * document.documentElement.clientHeight > 600000) { urlState.lp = true; }
	
	if (query && query.length) {
		query = query.slice(1); // Remove the '?' at the start.
		$.each(query.split('&'), function(i,queryParameter) {
			queryParameterSplit = queryParameter.split('=');
			queryTerms[queryParameterSplit[0]] = queryParameterSplit[1];
		});
		
		if (queryTerms.q && queryTerms.q.length) { urlState.q = decodeURIComponent(queryTerms.q).split('+').join(' '); }
		if (queryTerms.from && queryTerms.from.length) { urlState.from = decodeURIComponent(queryTerms.from).split('+').join(' '); }
		if (queryTerms.wp && queryTerms.wp.length) { urlState.wp = decodeURIComponent(queryTerms.wp).split(','); }
		if (queryTerms.pids && queryTerms.pids.length) { urlState.pids = decodeURIComponent(queryTerms.pids).split(','); }
		if (queryTerms.dpid && queryTerms.dpid.length) { urlState.dpid = decodeURIComponent(queryTerms.dpid); }
		if (queryTerms.vp && queryTerms.vp.length) { urlState.vp = decodeURIComponent(queryTerms.vp).split(','); }
		if (queryTerms.lp !== undefined) { urlState.lp = (queryTerms.lp === "1" || queryTerms.lp === "true"); }
		if (queryTerms.nf !== undefined) { urlState.nf = (queryTerms.nf === "1" || queryTerms.nf === "true"); }
		if (queryTerms.Screenshot !== undefined) { urlState.Screenshot = (queryTerms.Screenshot === "1" || queryTerms.Screenshot === "true"); }
		
		if (urlState.q) { $('#searchTo').val(urlState.q); $('#searchToHeader').val(urlState.q); }
		if (urlState.from) { $('#searchFrom').val(urlState.from); $('#searchFromHeader').val(urlState.from); }
		if (urlState.pids) {
			// ToDo: Search for all images referenced here to make sure we have their metadata in the cache. Then set the photos to be selected in their itinerary.
		}
		if (urlState.dpid) {
			// ToDo: Search for the image referenced here to make sure we have its metadata in the cache. Then set the photo to be shown in the large picture viewer.
		}
		if (urlState.wp && urlState.wp.length >= 4) {
			fromLat = urlState.wp[0];
			fromLong = urlState.wp[1];
			toLong = urlState.wp[urlState.wp.length-1];
			toLat = urlState.wp[urlState.wp.length-2];
			map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations (new Microsoft.Maps.Location(toLat, toLong), new Microsoft.Maps.Location(fromLat, fromLong))});		
			createDrivingRoute(fromLat, toLat, fromLong, toLong, false);
			appActivate(); // Hide the start model screen
		}
		
	}
}

function getUrl() {
	"use strict";

	var link = document.location.origin, parameterArray = [];
	
	$.each(urlState, function(parameter, value) {
		if (value && value.toString().length > 0) {
			parameterArray.push(parameter + "=" + encodeURIComponent(value)); // encodeURIComponent converts an array from [1,2,3] to "1,2,3" then encodes the commas.
		}
	});
	
	if (parameterArray.length > 0) { link += '/?' + parameterArray.join('&'); }
	
	link = link.split('%20').join('+');
	link = link.split('%2C').join(',');
	
	return link;
}

function getTitle() {
	"use strict";
	
	var from = '', to = '', title = "LetsGo - Discover Scenic Highways and Byways";
	
	if (urlState.q && urlState.q.length) to = urlState.q;
	if (urlState.from && urlState.from.length) from = urlState.from;
		
	if (from.length && to.length) title += " - " + from + " to " + to; 
	else if (!from.length && to.length) title += " - " + to;
	else if (from.length && !to.length) title += " - " + from;
	else { /* add nothing to the title */ }
	
	return title;
}

function replaceWindowHistory() {
	"use strict";
	
	window.history.replaceState(null, getTitle(), getUrl());
}


// Responsive Logo for the home screen splash.
function logoSize() {
    var $searchBar = $("#bigSearchBar");
    if ($searchBar.length) {
	    var offsert = $searchBar.offset();
	    $("#introLogo").css({height: (offsert.top/3)*2, paddingTop: offsert.top/6});
	    if($("#introLogo").hasClass("hidden")) {
	        $("#introLogo").removeClass("hidden");
	    }
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

$(document).on("keyup", function(e) {
	if (e.keyCode === 27) smallPicture();
});