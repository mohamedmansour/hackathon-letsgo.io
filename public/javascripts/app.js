;(function(window, document){
	"use strict";

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

	// for (var i = 0; i < limit; i++) {
	// 	var pushpin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(
	// 		lat - (latDiff * Math.random()),
	// 		lon + (lonDiff * Math.random())),
	// 		{}
	// 	);
	// 	map.entities.push(pushpin);
	// }

})(window, document);