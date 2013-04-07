// Bing maps hacking stuff go here
var map = new Microsoft.Maps.Map(document.getElementById('mapFrame'), {
	credentials: PHD4.mapsKey,
	showDashboard: false,
	enableSearchLogo: false,
	enableClickableLogo: false
});
map.setView({ zoom: 10, center: new Microsoft.Maps.Location(37.47,-122.13)});

map.entities.clear();

// var limit = 5,
// 	bounds = map.getBounds(),
// 	latlon = bounds.getNorthwest(),
// 	lat = latlon.latitude - bounds.height/4,
// 	lon = latlon.longitude + bounds.width/4,
// 	latDiff =  bounds.height/2,
// 	lonDiff =  bounds.width/2;

var pushpinOptions = {
	width: null,
	height: null,
	htmlContent: "<div style='font-size:12px;font-weight:bold;border:solid 2px;background-color:LightBlue;width:100px;'>Custom Pushpin</div>"
}; 

// for (var i = 0; i < limit; i++) {
// 	var pushpin = new Microsoft.Maps.Pushpin(
//		new Microsoft.Maps.Location(
// 		lat - (latDiff * Math.random()),
// 		lon + (lonDiff * Math.random())),
//		pushpinOptions
// 	);
// 	map.entities.push(pushpin);
// }


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
			
			getBoundingBoxPhotos(fromLong, fromLat, toLong, toLat, function(pix){
				console.log(pix);
			});

		});
	}

	appActivate();
})