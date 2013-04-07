// Bing maps hacking stuff go here
var map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
	credentials: PHD4.mapsKey,
	showDashboard: false,
	enableSearchLogo: false,
	enableClickableLogo: false
});
map.setView({ zoom: 10, center: new Microsoft.Maps.Location(37.47,-122.13)});

map.entities.clear();
Microsoft.Maps.Events.addHandler(map, "viewchangeend", getPhotos);

var canvasPhotos = {};
var photosCurrentlyOnMap = {};


// var limit = 5,
// 	bounds = map.getBounds(),
// 	latlon = bounds.getNorthwest(),
// 	lat = latlon.latitude - bounds.height/4,
// 	lon = latlon.longitude + bounds.width/4,
// 	latDiff =  bounds.height/2,
// 	lonDiff =  bounds.width/2;

function renderPhoto(item) {
	canvasPhotos[item.id] = item;
	
	//var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_s.jpg"
	
	var pushpin = new Microsoft.Maps.Pushpin(
		new Microsoft.Maps.Location(item.latitude, item.longitude),
		 {
			width: null,
			height: null,
			htmlContent: ("<div class='mapImage' data-id='" + item.id + " id='" + item.id + "'><img src='"  + item.url_s + "' /></div>")
		}
	);
	
	photosCurrentlyOnMap[item.id] = pushpin;
	
	map.entities.push(pushpin);
}

function appActivate() {
    $("header").addClass("active");
    $("#welcomeScreen").fadeOut(800);
    $("#theApp").removeClass("obscured");
}

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

	//getBoundingBoxPhotos(fromLong, fromLat, toLong, toLat, function(pix){
	getBoundingBoxPhotos(minimumLongitude, minimumLatitude, maximumLongitude, maximumLatitude, function(pix){
		canvasPhotos = {};
		
		//map.entities.clear();
		
		pix.slice(0,30).forEach(function(pic) {
			var photosToDisplay = {};
			$.each(pix, function(i,photo) {
				photosToDisplay[photo.id] = 1;
			});
			
			$.each(photosCurrentlyOnMap, function(photoid, pushpin) {
				if (!photosToDisplay[photoid]) {
					map.entities.remove(pushpin);
					delete photosCurrentlyOnMap[photoid];
					console.log("Removing " + photoid);
				}
			});
			
			renderPhoto(pic);
		});
	});
}

function fetchLocationAndLaunchQuery(){

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

		$.getJSON('/api/locationsearch?q='+to+'&q='+from, function(resp){
		  	var toLat = resp.coordinates[0].latitude,
		  		toLong = resp.coordinates[0].longitude,
		  		fromLat = resp.coordinates[1].latitude,
		  		fromLong = resp.coordinates[1].longitude;

		  	map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations (new Microsoft.Maps.Location(toLat, toLong), new Microsoft.Maps.Location(fromLat, fromLong))});		
			
			//getPhotos();
			
			
			//setTimeout(function() { getPhotos(); }, 2000);
		});
	}

	appActivate();
}


$('#lookup, #lookupHeader').click(function(e){
	e.preventDefault();
	return fetchLocationAndLaunchQuery();
});
$('input').keyup(function(e){
	if(e.keyCode === 13)
		return fetchLocationAndLaunchQuery();
});
