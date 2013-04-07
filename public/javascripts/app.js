// Bing maps hacking stuff go here
var map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
	credentials: PHD4.mapsKey,
	showDashboard: false,
	enableSearchLogo: false,
	enableClickableLogo: false
});
map.setView({ zoom: 10, center: new Microsoft.Maps.Location(37.47,-122.13)});

map.entities.clear();

var canvasPhotos = {};

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
			htmlContent: ("<div class='mapImage' data-id='" + item.id + "'><img src='"  + item.url_s + "' /></div>")
		}
	);
	map.entities.push(pushpin);
}

function appActivate() {
    $("header").addClass("active");
    $("#welcomeScreen").fadeOut(800);
    $("#theApp").removeClass("obscured");
}


$('#lookup').click(function(e){
	e.preventDefault();

	var to = $('#searchTo').val(),
		from = $('#searchFrom').val();

	if (to.length && from.length){

		$.getJSON('/api/locationsearch?q='+to+'&q='+from, function(resp){
		  	var toLat = resp.coordinates[0].latitude,
		  		toLong = resp.coordinates[0].longitude,
		  		fromLat = resp.coordinates[1].latitude,
		  		fromLong = resp.coordinates[1].longitude;

		  	map.setView({ bounds: Microsoft.Maps.LocationRect.fromLocations (new Microsoft.Maps.Location(toLat, toLong), new Microsoft.Maps.Location(fromLat, fromLong))});		
			
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
				pix.forEach(function(pic) {
					renderPhoto(pic);
				});
			});

		});
	}

	appActivate();
})