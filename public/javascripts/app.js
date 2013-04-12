var map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
	credentials: PHD4.mapsKey,
	showDashboard: false,
	disableBirdseye: true,
	enableSearchLogo: false,
	showScalebar: false,
	enableClickableLogo: false
});

var canvasPhotos = {},
	photosCurrentlyOnMap = {},
	searchManager;

var firstRun = true;

Microsoft.Maps.Events.addHandler(map, 'click', propagateClick);
Microsoft.Maps.Events.addHandler(map, "viewchangeend", getPhotos);
Microsoft.Maps.Events.addHandler(map, "viewchangeend", function(){ if (firstRun) { firstRun=false; restoreStateFromUrl(); }});

Microsoft.Maps.loadModule('Microsoft.Maps.Directions');
Microsoft.Maps.loadModule('Microsoft.Maps.Search', function(){
	searchManager = new Microsoft.Maps.Search.SearchManager(map);
});

var currentLocation = PHD4.currentLocation;
map.setView({ zoom: 11, center: new Microsoft.Maps.Location(currentLocation.ll[0], currentLocation.ll[1])});
map.entities.clear();

function renderPhoto(item) {
	canvasPhotos[item.id] = item;
	
	var pushpin = new Microsoft.Maps.Pushpin(
		new Microsoft.Maps.Location(item.latitude, item.longitude), {
			width: 75,
			height: 75,
			htmlContent: ("<div class='mapImage' data-id='" + item.id + "' id='" + item.id + "'></div>")
		}
	);
	
	photosCurrentlyOnMap[item.id] = pushpin;
	
	map.entities.push(pushpin);

	setTimeout(function() {
		var imgDOM = document.createElement('img');
		imgDOM.className = "fadeIN";
		imgDOM.width = 75;
		imgDOM.height = 75;
		imgDOM.src = item.url_sq;
		imgDOM.onload = function() {
			if (document.getElementById(item.id) && !document.getElementById(item.id).childNodes.length) {
				document.getElementById(item.id).appendChild(imgDOM);
				setTimeout(function(){imgDOM.classList.add('loaded');});
			}
		};
	});
}

function appActivate() {
	var styleDOM = document.createElement('style');
	styleDOM.innerHTML = '.fadeIN { opacity: 0; margin-top: 25px; font-size: 21px; text-align: center; -webkit-transition: opacity 0.5s ease-in; -moz-transition: opacity 0.5s ease-in; -o-transition: opacity 0.5s ease-in; -ms-transition: opacity 0.5s ease-in; transition: opacity 0.5s ease-in;} .loaded { opacity: 1;}';
	document.body.appendChild(styleDOM);

	$("header").addClass("active");
	$("#welcomeScreen").fadeOut(800);
	$("#theApp").removeClass("obscured");
}

var photoSetRequested = 0;
var photoSetOnDisplay = 0;

function getPhotos() {
	// map.getBounds(); 
	var bounds = map.getBounds();
	console.log(bounds);
	var halfWidth = bounds.width / 2;
	var halfHeight = bounds.height / 2;
	var minimumLongitude = bounds.center.longitude - halfWidth,
		minimumLatitude = bounds.center.latitude - halfHeight,
		maximumLongitude = bounds.center.longitude + halfWidth,
		maximumLatitude = bounds.center.latitude + halfHeight;
	var thisPhotoSet = photoSetRequested+1;
	
	photoSetRequested += 1;
	
	//getBoundingBoxPhotos(fromLong, fromLat, toLong, toLat, function(pix){
	getBoundingBoxPhotos(minimumLongitude, minimumLatitude, maximumLongitude, maximumLatitude, function(pix){
		var photoSliced = pix.slice(0,30);
		//canvasPhotos = {};
		
		if (!photoSliced || !photoSliced.length) return;
		
		if (thisPhotoSet < photoSetOnDisplay) { console.log("Photos returned out of order. Currently displaying #" + photoSetOnDisplay + ", incomming is #" + thisPhotoSet); return; }
		
		photoSetOnDisplay = thisPhotoSet;
		
		//map.entities.clear();
	
		_gaq.push(['_trackEvent', 'Map', 'ReceivedPhotosInBoundingBox', getUrl(), pix.length]);
		
		var photosToDisplay = {};
		$.each(photoSliced, function(i,photo) {
			photosToDisplay[photo.id] = 1;
		});
		
		$.each(photosCurrentlyOnMap, function(photoid, pushpin) {
			if (!photosToDisplay[photoid]) {
				map.entities.remove(pushpin);
				delete photosCurrentlyOnMap[photoid];
				console.log("Removing id=" + photoid);
			}
		});
		
		photoSliced.forEach(function(pic) {
			"use strict";
			
			if (!photosCurrentlyOnMap[pic.id] && pic.url_l) renderPhoto(pic);
		});
	});
}



function createDrivingRoute(fromLat, toLat, fromLong, toLong) {
	var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
	
	Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function() {console.log('Directions updated') });

	directionsManager.resetDirections();
	directionsManager.setRequestOptions({routeMode: Microsoft.Maps.Directions.RouteMode.driving });

	var start = new Microsoft.Maps.Directions.Waypoint({
			location: new Microsoft.Maps.Location(fromLat, fromLong)
		}),
		stop = new Microsoft.Maps.Directions.Waypoint({
			location: new Microsoft.Maps.Location(toLat, toLong)
		});

	directionsManager.addWaypoint(start);
	directionsManager.addWaypoint(stop);

	directionsManager.calculateDirections();
}

function fetchLocationAndLaunchQuery(){
	var searchManager = searchManager || new Microsoft.Maps.Search.SearchManager(map),
		fromLat, toLat, fromLong, toLong;

	if ($("header").hasClass("active")) {
		var to = $('#searchToHeader').val(),
			from = $('#searchFromHeader').val();
	} else {
		var to = $('#searchTo').val(),
			from = $('#searchFrom').val();

		$('#searchFromHeader').val(from);
		$('#searchToHeader').val(to);
	}

	if(isOpened){
		$("#bigPicture").removeClass("active");
		$("#mapFrame").removeClass("sidebar");
	}

	map.entities.clear(); 

	if (to.length && from.length){

		var geocodeRequestFrom = {where:from, count:1, callback:function(geocodeResult){

			var geoCodeResultFrom = geocodeResult.results[0].location;
			fromLat = geoCodeResultFrom.latitude;
			fromLong = geoCodeResultFrom.longitude;

			geocodeRequestTo = {where:to, count:1, callback:function(geocodeResult){
				var geoCodeResultTo = geocodeResult.results[0].location;
				toLat = geoCodeResultTo.latitude
				toLong = geoCodeResultTo.longitude
				
				map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations (new Microsoft.Maps.Location(toLat, toLong), new Microsoft.Maps.Location(fromLat, fromLong))});		
				createDrivingRoute(fromLat, toLat, fromLong, toLong);
						
				urlState.from = from;
				urlState.q = to;
				urlState.wp = [fromLat, fromLong, toLat, toLong];

				_gaq.push(['_trackEvent', 'Map', 'DirectionSearch', getUrl()]);
			}};
			
			searchManager.geocode(geocodeRequestTo);
		}};

		searchManager.geocode(geocodeRequestFrom);
	}

	appActivate();
}


$('#lookup, #lookupHeader').click(function(e){
	e.preventDefault();
	return fetchLocationAndLaunchQuery();
});

$('input').keypress(function(e){
	if(e.keyCode === 13) return fetchLocationAndLaunchQuery();
});

function propagateClick (e){
	var self = e.target;
	if (e.targetType === "pushpin"){
		var item = canvasPhotos[$(self._htmlContent).attr('data-id')];
		fullPicture(item.url_l, item.id);
		_gaq.push(['_trackEvent', 'Map', 'CirclePhotoClick', getUrl()]);
	}
}
